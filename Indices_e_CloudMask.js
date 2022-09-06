//Vamos definir a área de estudo com base em uma featurecollection
//`Para isso você precisará importar os arquivos shp que disponibilizamos ou uma base sua 

//Definição da área de estudo 
var selecao = ee.Geometry.Point([-43.3172042724492, -11.843134589273733])

var roi = ee.Geometry.Polygon(
        [[[-43.622761523425766, -11.566792092687411],
          [-43.622761523425766, -12.018477596534735],
          [-43.062458789050766, -12.018477596534735],
          [-43.062458789050766, -11.566792092687411]]]);

//Vamos criar uma máscara de nuvens e vamos converter os valores para reflectância
//Acesse o link https://www.usgs.gov/faqs/how-do-i-use-scale-factor-landsat-level-2-science-products

/*
Como uso um fator de escala com produtos científicos Landsat Level-2?
Um fator de escala deve ser aplicado aos produtos de refletância de superfície e 
temperatura de superfície da Coleção 1 e Coleção 2 Landsat Level-2 antes de usar os dados. 
Observação: os produtos científicos Landsat Collection 1 e Collection 2 de nível 2 têm fatores de escala, 
valores de preenchimento e tipos de dados diferentes (consulte a tabela).

Os usuários podem aplicar um fator de escala aos produtos científicos por meio de um script de dados, 
por meio de cálculo manual ou em determinados programas de software.

*/


//Seleção da coleção
//Aplicando uma máscara de núvens na coleção landsat/
function maskL8sr(image){
    // Bit 0 - Fill
    // Bit 1 - Dilated Cloud
    // Bit 2 - Cirrus
    // Bit 3 - Cloud
    // Bit 4 - Cloud Shadow
    // Bit 5 - Snow
    var qaMask = image.select(['QA_PIXEL']).bitwiseAnd(parseInt('111111', 2)) //analisar
                                          .eq(0) //2 = Unused //eq = 0 condições claras
    var saturationMask = image.select("QA_RADSAT").eq(0) //Radiometric saturation QA
    
    // Aplicar os fatores de escala às bandas apropriadas
    var opticalBands = image.select("SR_B.").multiply(0.0000275).add(-0.2)
    var thermalBands = image.select("ST_B.*").multiply(0.00341802).add(149.0)
    
    // Substitua as faixas originais pelas escalonadas e aplique as máscaras.
    return image
        .addBands(opticalBands, null, true)
        .addBands(thermalBands, null, true)
        .updateMask(qaMask)
        .updateMask(saturationMask)
       .clip(roi) //com o clip você vai recortar todas as imagens para sua área de estudo 
                  // observe que o clip não deve ser utilizado com recorrência, aumenta a necessidade de processamento
        .copyProperties(image, image.propertyNames()) //copia a propriedade da coleção
        .set({date: image.date().format('YYYY-MM-dd')}) 
}

//Podemos criar funções para calcular os índices de vegetação em todos as imagens que vamos utilizar

//Função dos índices 
function indices (image) {
  //Indices de Vegetação 
  var ndvi =  image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');// Rouse 1973
  
  var evi = image.expression('2.5 * ((N - R) / (N + (6 * R) - (7.5 * B) + 1))', 
  { //Huete 2002
        'N': image.select('SR_B5'), 'R': image.select('SR_B4'), 'B': image.select('SR_B2')}).rename('EVI');
  
    //Índices de Água
  var ndwi = image.normalizedDifference(['SR_B3', 'SR_B5']).rename ('NDWI'); //Mc Feeters 1996
  var ndwi_veg = image.normalizedDifference(['SR_B5', 'SR_B6']).rename ('NDWI_VEG'); //Gao 1996
  var mndwi = image.normalizedDifference(['SR_B3', 'SR_B6']).rename('MNDWI'); // Xu 2006
  
  return image.addBands([ndvi,evi,ndwi,ndwi_veg,mndwi])}

//Agora, vamos aplicar a mascara de nuvens e os índices sobre nossa coleção
//Importando coleção Landsat 8/
var collection = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
                            .filterDate('2020-01-01','2020-12-31')
                            .filterBounds(selecao)
                            .filter(ee.Filter.lt('CLOUD_COVER',50))
                            .map(maskL8sr)
                            .map(indices)
                            
print('Qtds imgs:',collection.size())

// // Coleção reduzida
var collection_reduce = collection.median()
print('Bandas', collection_reduce.bandNames())

// //Visualizar a coleação 
Map.addLayer(collection_reduce,{bands:['SR_B4','SR_B3','SR_B2'],min:0.016, max:0.19},'RGB')
Map.addLayer(collection_reduce.select('NDWI'),{palette:['white','cyan','blue'],min:0, max:0.8},'NDWI')

var mask = collection_reduce.select('NDWI').gte(0.1).selfMask()
Map.addLayer(mask,{palette:['pink'],min:0, max:0.8},'Água')
