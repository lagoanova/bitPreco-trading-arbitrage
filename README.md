## BitPreço

Fazer cadastro na [corretora BitPreço](https://bitpreco.com?r=241)

[![Deploy to DO](https://mp-assets1.sfo2.digitaloceanspaces.com/deploy-to-do/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/lagoanova/bitPreco-trading-arbitrage/tree/main&refcode=a076ff7a9a6a)

# Como funciona?

O robô verifica a existência de oportunidades de arbitragem e tenta executá-las.

A Bitpreço conecta você a várias corretoras. É normal que durante movimentos naturais do mercado o preço de compra em uma corretora seja mais barato que o preço de venda em outra, gerando assim uma oportunidade de fazer o que chamamos de arbitragem.

Arbitragem é a ação de comprar mais barato em uma corretora e vender mais caro em outra. Descontando as taxas essa movimentação, deve resultar em lucro para o operador.

Tendo em vista a facilidade em se conectar a várias corretoras e utilizando a API de negociações da Bitpreço, escrevi esse código para exemplificar o uso em NodeJS.

# Configuração das variáveis

Copiar o arquivo .env.example e gerar o .env:

- SIGNATURE: gerado na corretora bitpreço
- API_KEY: gerado na corretora bitpreço
- TEST: true ou false. Modo simulação: true
- TEST_SIGNATURE: gerado na corretora bitpreço (https://simulador.bitpreco.com/)
- TEST_API_KEY: gerado na corretora bitpreço (https://simulador.bitpreco.com/)
- MARKET: Os mercados disponníveis são: BTC-BRL | ETH-BRL | USDT-BRL
- BOT_CHAT: código do chat do Telegram
- BOT_TOKEN: https://t.me/BotFather
- AMOUNT: valor em BRL
- INITIAL_DEPOSIT: depósito inicial feito na corretora
- INITIAL_DATE: data inicial de execução do bot
- INITIAL_SELL: informe `true` para que o robô execute primeiro venda e depois compra, `false` para que execute primeiro compra e depois venda. Se o seu saldo está em reais, use `false`, se esta em BTC ou ETH, use `true`.
- MIN_PROFIT_PERCENT: Informe o lucro mínimo potencial, em percentual, para que o robô tente executar a arbitragem. Valor padrão: 0.6%
- DIFFERENCE_LOGGER: exibir o log na tela

# Instalação

Você pode fazer a instalação usando o botão acima, da DigitalOcean, ou manualmente seguindo os passos abaixo:

- preencher os dados do .env
- instalar com o comando `npm i`
- executar com `npm start`

## Docker

**Execute o seguinte comando para subir a aplicação:**

    docker-compose -f docker-compose.yml up -d

**Após alterar uma configuração, execute:**

    docker-compose -f docker-compose.yml down

    docker-compose -f docker-compose.yml up -d

**Para verificar se deu certo, execute o seguinte comando:**

    docker-compose -f docker-compose.yml ps -a

Para visualizar o log do container, execute:

- Listar os container com `docker container ls`
- Visualizar o log do container com `docker container logs -f container_id`

## PM2

**Execute o seguinte comando para subir a aplicação:**

    pm2 start ecosystem.config.js

**Execute o seguinte comando para listar a aplicação:**

    pm2 ls

**Execute o seguinte comando para parar a aplicação:**

    pm2 delete all

Mais informações em https://pm2.keymetrics.io/docs/usage/quick-start/

# Disclaimer

Nenhum proprietário ou contribuidor é responsável por qualquer coisa feita com este bot. Você o usa por sua própria conta e risco. Não há garantias expressas ou implícitas. Você assume toda a responsabilidade e obrigação.

AVISO LEGAL:

Todas as estratégias e investimentos envolvem risco de perda. Você nunca deve negociar com dinheiro que não pode ou tem medo de perder.

Use por sua conta e risco!

VOCÊ É RESPONSÁVEL POR QUAISQUER PERDAS QUE POSSAM SER RESULTANTES DO USO DO BOT!

Se você não entende como o bot funciona, não deve usá-lo. Você é sempre bem-vindo para [pedir ajuda](https://github.com/lagoanova/bitPreco-trading-arbitrage/issues) ou obter mais informações sobre como funciona exatamente.

Não é recomendação de investimento!

# Telegram

1. Abra o https://t.me/BotFather
2. Digite /newbot e siga as instruções abaixo:

![image](https://user-images.githubusercontent.com/54438080/134407558-512d6a08-bb3c-45ed-8d49-0b48d597f364.png)

3. Anote o TOKEN do bot

![image](https://user-images.githubusercontent.com/54438080/134408189-a83e714b-9d91-423b-bcfd-7a690dbc71ae.png)

4. Após criar o bot, clique nele para abrir

![image](https://user-images.githubusercontent.com/54438080/134407708-5467712b-80fe-48a1-a86a-cae9ef549503.png)

5. Clique em START

![image](https://user-images.githubusercontent.com/54438080/134407755-81b76166-e510-4ead-b452-85c9bfaba7c6.png)

6. Pegue o ID do seu bot acessando https://t.me/raw_data_bot

![image](https://user-images.githubusercontent.com/54438080/134407981-9219652e-997e-4242-afbc-340371455e15.png)
