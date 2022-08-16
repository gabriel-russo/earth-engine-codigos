// Adicionando imagem e coleção de feições
var s2 = ee.ImageCollection('COPERNICUS/S2')
var estados_brasil = ee.FeatureCollection('users/gabrielrusso/lml_unidade_federacao')

// Filtrar estados apenas para Distrito Federal
var brasilia = estados_brasil.filter(ee.Filter.eq('sigla', 'DF'))

// Filtrando a coleção de imagens do sentinel 2
var s2_filter = s2.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 30))
.filter(ee.Filter.date('2022-06-20','2022-07-20')).filter(ee.Filter.bounds(brasilia))

// Criando o mosaico com píxels médios
var s2_mosaic = s2_filter.median()

// Recortando a imagem
var clip = s2_mosaic.clip(brasilia)

var rgbVis = {
  min: 0.0,
  max: 3000,
  bands: ['B4', 'B3', 'B2'], 
};

Map.addLayer(clip, rgbVis, 'Brasilia - Sentinel 2')