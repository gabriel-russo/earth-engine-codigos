//Manipulando datas com earth engine

// Primeiro é necessário adquirir o "AGORA", pois o ee não sabe a hora da sua localidade
var date = Date.now()

// Utilizando a classe Date do Earth Engine
var agora = ee.Date(date)
print(agora)

// Manipulando tempo ===

// 1 mês pra frente
print("Mês que vem: ", agora.advance(1, 'month'))

// 1 dia atrás
print("1 dia atrás: ", agora.advance(-1, 'day'))

// 1 semana atrás
print("1 semana atrás: ", agora.advance(-1, 'week'))

// 1 mês pra trás
print("1 mês atrás: ", agora.advance(-1, 'month'))

// 1 semana atrás
print("1 ano atrás: ", agora.advance(-1, 'year'))

// Calculo de tempo
var oito_semanas_atras = agora.advance(-8, 'week')
var diferenca_em_dias = agora.difference(oito_semanas_atras, 'day')

print("Desde ", oito_semanas_atras," já se passaram ", diferenca_em_dias, "dias")

// Formatando tempo
var data_formatada_BR = agora.format('d/M/y')
print(data_formatada_BR)
