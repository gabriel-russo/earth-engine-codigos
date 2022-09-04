var estados_brasil = ee.FeatureCollection('users/gabrielrusso/lml_unidade_federacao')

var area_estudo = estados_brasil.filter(ee.Filter.eq('sigla', 'RO'))

var agora = Date.now()

var data_ee = ee.Date(agora)

var s2_swir = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
.sort('GENERATION_TIME', false)
.filter(ee.Filter.date(data_ee.advance(-15, 'days').format('y-M-d'), data_ee.format('y-M-d')))
.select(['B12','B8A', 'B4'])
.mosaic()
.clip(area_estudo)

Map.addLayer(s2_swir, {min: 0.0, max:3000}, 'SWIR - RO')
