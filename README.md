# Atividade de JS - Semana 05

Projeto desenvolvido para a aula de Desenvolvimento Web trabalhando com manipulação de objetos e arrays, requisições assíncronas (fetch e async/await) e atualização do DOM.

O que foi feito:
- Resumo de Pedidos: Filtra uma lista de pedidos em JS, mantendo apenas os pedidos válidos com status pago e calculando o total faturado.
- Buscador de CEP: Consulta a API do ViaCEP trazendo o endereço e tratando os estados da tela (carregando, erro de rede, CEP não encontrado e sucesso), além de guardar o histórico.
- Mini Pokédex: Busca de Pokémons na PokéAPI exibindo foto e tipos, tratando o erro 404 caso o nome digitado não exista.

Por que Promise.all pode ser mais rápido que vários await seguidos?
Quando usamos vários await em sequência, o código trava e espera uma requisição responder para só depois disparar a seguinte. O tempo total acaba sendo a soma de todas as chamadas.

Com o Promise.all, todas as requisições são disparadas ao mesmo tempo (em paralelo). O código aguarda todas terminarem juntas, fazendo com que o tempo total seja apenas o tempo da requisição mais demorada.
