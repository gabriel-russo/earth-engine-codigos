// Não é estritamente necessário utilizar variáveis locais
var numero = 1;

// Mas sim utilizar "variáveis" do EE,
// onde se pode manipular esses dados
// utilizando computação em núvem
var ee_numero = ee.Number(1)

print(ee_numero)

var soma = ee_numero.add(1)

print('Resultado da soma em nuvem é ', soma)

// Lista de numeros

// Da mesma forma, não é estritamente necessário listas locais
var lista = [1, 2, 3, 4]

// Criar uma lista com sequência de 1 a 100
var ee_lista = ee.List.sequence(1, 100)

print(ee_lista)