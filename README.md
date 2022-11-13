## BitPreço

Fazer cadastro na [corretora BitPreço](https://bitpreco.com?r=241)

[![Deploy to DO](https://mp-assets1.sfo2.digitaloceanspaces.com/deploy-to-do/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/lagoanova/bitPreco-trading-arbitrage/tree/main&refcode=a076ff7a9a6a)

# Configuração das variáveis

Renomear o arquivo .env.example para .env e preencher conforme instruções:

`

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
- MIN_PROFIT_PERCENT: Informe o lucro mínimo potencial, em percentual, para que o robô tente executar a arbitragem. Valor padrão: 0.09%
- DIFFERENCE_LOGGER: exibir o log na tela
  `

# Instalação

Você pode fazer a instalação usando o botão acima, da DigitalOcean, ou manualmente seguindo os passos abaixo:

- preencher os dados
- instalar com o comando `npm i`
- executar com `npm start`

# Disclaimer

Nenhum proprietário ou contribuidor é responsável por qualquer coisa feita com este bot. Você o usa por sua própria conta e risco. Não há garantias expressas ou implícitas. Você assume toda a responsabilidade e obrigação.

AVISO LEGAL:

Todas as estratégias e investimentos envolvem risco de perda. Você nunca deve negociar com dinheiro que não pode ou tem medo de perder.

Use por sua conta e risco!

VOCÊ É RESPONSÁVEL POR QUAISQUER PERDAS QUE POSSAM SER RESULTANTES DO USO DO BOT!

Se você não entende como o bot funciona, não deve usá-lo. Você é sempre bem-vindo para pedir ajuda ou obter mais informações sobre como funciona exatamente.

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
