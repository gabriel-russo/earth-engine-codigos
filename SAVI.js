// Área de interesse - Rio Tocantins
var Pantanal = ee.Geometry.Polygon(
        [[[-58.33333311279824, -16.28420300131378],
          [-58.33333311279824, -17.283428685467726],
          [-56.97102842529824, -17.283428685467726],
          [-56.97102842529824, -16.28420300131378]]]);

// Centralizando o rio no mapa
Map.centerObject(Pantanal, 9)

// Coletando imagem do sentinel-2 L2A
var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 30))
.filter(ee.Filter.date('2021-06-21', '2021-12-21'))
.filter(ee.Filter.bounds(Pantanal)).median().clip(Pantanal)

// Adicionando imagem Cor verdadeira ao mapa
Map.addLayer(s2, {min: 0, max: 3000, bands: ['B4','B3','B2']}, 'Sentinel-2 L2 TCI')

//  O SAVI (Soil-Adjusted Vegetation Index) consiste na própria fórmula do NDVI, 
// acrescida de uma constante L, que varia de 0 a 1, dependendo do grau da maior 
// ou menor cobertura do solo
// Formula: 1.5 * ((NIR - RED) / (NIR + RED + 0.5))

// Nota: 
// Para a formula do SAVI, o valor do pixel precisa ser convertido para a refletância
// Multiplicando o valor pela 'escala', dando o valor da refletancia
// O valor da escala para o dataset do sentinel-2 é de 0.0001

// Para expressões mais complexas, utilize a função .expression()
var SAVI = s2.expression( '1.5 * ((NIR - RED) / (NIR + RED + 0.5))', {
      'NIR': s2.select('B8').multiply(0.0001),
      'RED': s2.select('B4').multiply(0.0001),
})

// Adicionando SAVI ao mapa
Map.addLayer(SAVI, {min:0, max:1, palette: ['white', 'green']}, 'SAVI - Pantanal')
