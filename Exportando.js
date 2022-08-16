// Criando área de interesse
var jericoacoara = ee.Geometry.Polygon([
  [[-40.54586820941123, -2.8335628961844757],
  [-40.38587980609092, -2.8318483799622998],
  [-40.38690977435264, -2.752634988612399],
  [-40.545524886657326, -2.751606208305718]]
]);

// Adicionando uma coleção, filtrando, pixel medio e recortando
var s2 = ee.ImageCollection('COPERNICUS/S2').filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 30))
.filter(ee.Filter.date('2022-06-20', '2022-07-20')).filter(ee.Filter.bounds(jericoacoara))
.median().clip(jericoacoara)

// Adicionando ao mapa
Map.addLayer(s2, { min: 0.0, max: 3000, bands: ['B4', 'B3', 'B2']} )

// Exportando dados ====================

// Exportando com bandas separadas:
// Primeiro seleciono quais bandas vou exportar utilizando .select()
var composicao_escolhida = s2.select('B.*')

// // Exporto imagem
Export.image.toDrive({
  image: composicao_escolhida,
  description: 'Jericoacoara_jun_jul2022_Sentinel2',
  folder: 'earthengine',
  fileNamePrefix: 'jericoacoara_raw',
  region: jericoacoara,
  scale: 7,
  maxPixels: 1e9
})

// Exportando com RGB utilizando o metodo visualize()

var imagem_rgb = s2.visualize({ min: 0.0, max: 3000, bands: ['B4', 'B3', 'B2']})

Export.image.toDrive({
  image: imagem_rgb,
  description: 'Jericoacoara_jun_jul2022_Sentinel2',
  folder: 'earthengine',
  fileNamePrefix: 'jericoacoara_rgb',
  region: jericoacoara,
  crs: 'EPSG:4674',
  scale: 10, // Resolução em metros por pixel
  maxPixels: 1e9 // Numero maximo de pixels para exportar. Padrao: 1e8
})
