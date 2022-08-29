var rio_tocantins = ee.Geometry.Polygon(
        [[[-49.998735414448525, -3.6603950265689655],
          [-49.998735414448525, -4.860051836565587],
          [-49.081377016011025, -4.860051836565587],
          [-49.081377016011025, -3.6603950265689655]]]);
 
// Gerar ndwi de cada imagem
function add_nwdi(image){
  var ndwi = image.normalizedDifference(['B3','B8']).rename('NDWI')
  return image.addBands(ndwi)
}

// Imagens do local
var s2 = ee.ImageCollection('COPERNICUS/S2')
.filter(ee.Filter.bounds(rio_tocantins))
.filter(ee.Filter.date('2022-02-28', '2022-08-28'))
.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 30))

// Gerar NDWI com pixel medio e com recorte da area 
var ndwi_rio_tocantins = s2.map(add_nwdi).select('NDWI').mean().clip(rio_tocantins)

// Limite valor do pixel das imagens - somente acima -0.1
var ndwiThreshold = ndwi_rio_tocantins.gte(-0.1);

// Gerar mascara do rio tocantins
var rio_toncantins_mask = ndwi_rio_tocantins.updateMask(ndwiThreshold)

Map.addLayer(rio_toncantins_mask, {palette: ['blue']})
