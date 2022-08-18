// Adicionando camada com os municipios do Brasil
var municipios = ee.FeatureCollection('users/gabrielrusso/lml_municipios')

// Selecionando o municipio de itaquaquecetuba
var itaquaquecetuba = municipios.filter(ee.Filter.eq('NM_MUN', 'Itaquaquecetuba'))

// Adicionando ao mapa
Map.addLayer(itaquaquecetuba, {'color': 'green'}, 'Itaquaquecetuba - SP')

// Adquirindo o tempo atual
var agora = Date.now()
agora = ee.Date(agora)

// Calculo de data - 1 mês atrás
var mes_anterior = agora.advance(-1, 'month')

// Formatando a data para string ano-mes-dia
mes_anterior = mes_anterior.format('y-M-d') 
agora = agora.format('y-M-d')

// Adquirindo imagem sentinel-2
var s2 = ee.ImageCollection('COPERNICUS/S2')
.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 30))
.filter(ee.Filter.date(mes_anterior, agora))
.filter(ee.Filter.bounds(itaquaquecetuba))
.median()
.clip(itaquaquecetuba)

// Adicionando ao mapa
Map.addLayer(s2, {min: 0, max: 3000, bands: ['B4', 'B3', 'B2'] }, 'Sentinel-2')
