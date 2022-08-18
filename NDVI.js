// Buscando a feição do municipio de Porto Velho - RO
var porto_velho = ee.FeatureCollection('users/gabrielrusso/lml_municipios')
.filter(ee.Filter.eq('NM_MUN', 'Porto Velho'))

// Buscando imagem Sentinel-2 para o municipio, criando o pixel medio e recortando
var s2 = ee.ImageCollection('COPERNICUS/S2')
.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 30))
.filter(ee.Filter.date('2022-06-20','2022-08-01'))
.filter(ee.Filter.bounds(porto_velho)).median().clip(porto_velho)

// Calculando o NDVI
// Diferença normalizada : B8 (NIR) e B4 (Vermelha)
// Formula: NIR - Vermelha / NIR + Vermelha
// O earth engine possui uma função para isso (Fica em ee.Image):
var NDVI = s2.normalizedDifference(['B8', 'B4'])

// Adicionando o NDVI ao mapa. Valores de -1 a 1 e paleta de cor do Vermelho ao Verde
Map.addLayer(NDVI, {min: -1, max: 1, palette: ['#fc0000','#00fc00']}, 'Sentinel - NDVI')
