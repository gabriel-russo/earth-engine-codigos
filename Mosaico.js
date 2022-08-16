// Colocando um ponto e colocando centralizando o foco do mapa
var geometria = ee.Geometry.Point([-65.3486012195008, -10.802451442340297])
Map.centerObject(geometria, 13)

// Carregando a coleção de imagens
var s2 = ee.ImageCollection('COPERNICUS/S2')

var rgbVis = {
  min: 0.0,
  max: 3000,
  bands: ['B4', 'B3', 'B2'],
};

// Fazendo um filtro na coleção de imagens
var filtrado = s2.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 30))
.filter(ee.Filter.date('2022-06-20', '2022-07-20'))
.filter(ee.Filter.bounds(geometria))

// Criando um mosaico da pilha de imagens
var mosaico = filtrado.mosaic()

// Criando uma composição de imagem onde cada pixel possui um valor médio com relação
// a todos os pixels empilhados.
var mosaico_pixel_mediano = filtrado.median()

// Adiciona imagens ao mapa
Map.addLayer(mosaico_pixel_mediano, rgbVis, 'Mosaico dos pixels médios')
Map.addLayer(mosaico, rgbVis, 'Mosaico das coleções filtradas')
Map.addLayer(filtrado, rgbVis, 'Coleção Filtrada')
