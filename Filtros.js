// Colocando um ponto e colocando centralizando o foco do mapa
var geometria = ee.Geometry.Point([-65.3486012195008, -10.802451442340297])
Map.centerObject(geometria, 13)

// Carregando a coleção de imagens
var s2 = ee.ImageCollection('COPERNICUS/S2')

// Filtrando por metadata
var filtrado = s2.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 30))

// Filtrando por data
var filtrado = s2.filter(ee.Filter.date('2022-06-20','2022-07-20'))

// Filtrando por localização
var filtrado = s2.filter(ee.Filter.bounds(geometria))

// Agrupando todos os filtros em 1 só

var filtrado = s2.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 30))
.filter(ee.Filter.date('2022-06-20','2022-07-20'))
.filter(ee.Filter.bounds(geometria)).filter(ee.Filter.eq('SPACECRAFT_NAME', 'Sentinel-2A'))

// Ver a quantidade de imagens retornadas pelo filtro
print(filtrado.size())