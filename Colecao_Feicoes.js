// Importando uma coleção de feições dos assets
var estados = ee.FeatureCollection('users/gabrielrusso/lml_unidade_federacao')
// Exibindo as colunas da tabela dessa camada
print(estados.getInfo().columns)

// Fazendo um Filtro para um estado
var rondonia = estados.filter(ee.Filter.eq('sigla', 'RO'))

// Adicionando as Features ao mapa
Map.addLayer(rondonia, {'color': 'blue'})
Map.addLayer(estados, {'color': 'green'})
