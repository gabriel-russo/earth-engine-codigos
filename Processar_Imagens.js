var Itacoatiara = ee.Geometry.Polygon(
        [[[-58.4757132888641, -3.091726245977068],
          [-58.4757132888641, -3.16680181276382],
          [-58.39606240995785, -3.16680181276382],
          [-58.39606240995785, -3.091726245977068]]]);
          
// Busca coleção de imagens
var s2 = ee.ImageCollection('COPERNICUS/S2')
.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 10))
.filter(ee.Filter.date('2021-08-22', '2022-08-22'))
.filter(ee.Filter.bounds(Itacoatiara))

// Para cada imagem, aplique essa função. No caso, uma função que faz o 
// processamento de NDVI
var ndvi_collection = s2.map(function(image){ return image.normalizedDifference(['B8','B4']) })

// Faz um mosaico com o pixel médio de todas as imagens NDVI e faz o recorte em seguida
var ndvi_collection = ndvi_collection.median().clip(Itacoatiara)

// Paleta de cores escolhidas para o NDVI
var palette = [
  'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
  '74A901', '66A000', '529400', '3E8601', '207401', '056201',
  '004C00', '023B01', '012E01', '011D01', '011301'];

// Adiciona o NDVI ao mapa
Map.addLayer(ndvi_collection, {min: 0, max: 0.5, palette: palette}, 'NDVI - Itacoatiara')
