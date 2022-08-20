// Área de interesse - Rio Tocantins
var rio_tocantins = ee.Geometry.Polygon(
        [[[-50.04044289374164, -3.666353255935999],
          [-50.04044289374164, -5.054805058043083],
          [-49.06265969061664, -5.054805058043083],
          [-49.06265969061664, -3.666353255935999]]]);

// Centralizando o rio no mapa
Map.centerObject(rio_tocantins, 9)

// Coletando imagem do sentinel-2 L2A
var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 30))
.filter(ee.Filter.date('2021-06-21', '2021-12-21'))
.filter(ee.Filter.bounds(rio_tocantins)).median().clip(rio_tocantins)

// Adicionando imagem Cor verdadeira ao mapa
Map.addLayer(s2, {min: 0, max: 3000, bands: ['B4','B3','B2']}, 'Sentinel-2 TCI')

// Calculando a diferença normalizada da banda Verde (B3) e NIR(B8)
var NDWI = s2.normalizedDifference(['B3','B8'])
// Adicionando NDWI ao mapa
Map.addLayer(NDWI, {min: -0.3, max: 1, palette: ['white', 'blue']}, 'NDWI - Rio tocantins')
