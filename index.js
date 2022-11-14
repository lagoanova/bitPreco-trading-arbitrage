const axios = require("axios");
const { Telegraf, Markup } = require("telegraf");
const apiKeyCheck = process.env.API_KEY;
const signatureCheck = process.env.SIGNATURE;
const BOT_CHAT = process.env.BOT_CHAT;
const bot = new Telegraf(process.env.BOT_TOKEN);
const bitpreco = require("./api");
const Bottleneck = require("bottleneck");
const logger = require("./logger");
const { handleMessage, handleError, percent } = require("./utils");
const limiter = new Bottleneck({
  reservoir: 30,
  reservoirRefreshAmount: 30,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 1,
});

if (!apiKeyCheck || !signatureCheck) {
  console.log(`Crendentials not found!`);
  process.exit(0);
}
// VARS
let amount = Number(process.env.AMOUNT);
let initialDeposit = Number(process.env.INITIAL_DEPOSIT);
let initialDate = process.env.INITIAL_DATE;
let minProfitPercent = Number(process.env.MIN_PROFIT_PERCENT);
let initialSell = process.env.INITIAL_SELL.toLowerCase() === "true";
let test = process.env.TEST.toLowerCase() === "true";
let differencelogger = process.env.DIFFERENCE_LOGGER.toLowerCase() === "true";
let balances;
let BRL, BTC, USDT, ETH;

// Os mercados disponníveis são:
// BTC-BRL | ETH-BRL | USDT-BRL
const MARKET = process.env.MARKET;

// Websocket
const { Socket } = require("phoenix-channels");
const SOCKET_URL = "wss://bp-channels.gigalixirapp.com";

// Conecta com o socket
const socket = new Socket(`${SOCKET_URL}/orderbook/socket`);
socket.connect();

// O client nos oferece callbacks de sucesso e erro de conexão
socket.onOpen(() => {
  console.log("Connected successfully");
});
socket.onError((e) => {
  console.log("Failed to connect to socket");
  logger.error(e);
});

// Conecta no canal, passando o topic desejado
const channel = socket.channel(`orderbook:${MARKET}`, {});
channel
  .join()
  .receive("ok", (resp) => {
    console.log("Joined successfully", resp);
  })
  .receive("error", (resp) => {
    console.log("Unable to join", resp);
  });

// Telegram Keyboard
const keyboard = Markup.keyboard([
  ["🧾 Balance", "🔍 BTC Price"], // Row1 with 2 buttons
  ["☸ Configs", "🔛 Test Mode"], // Row2 with 2 buttons
  ["📖 Help", "₿ BitPreço"], // Row3 with 2 buttons
])
  .oneTime()
  .resize();

// Telegram Commands
bot.hears("📖 Help", async (ctx) => {
  ctx.replyWithMarkdown(
    `*Comandos disponíveis:* 
        ============  
    *🧾 Balance:* Extrato resumido do saldo na corretora.\n
    *🔍 BTC Price:* Último preço do Bitcoin na corretora.\n
    *☸ Configs:* Configurações do Bot.\n
    *🔛 Test Mode:* Ativar/Desativar modo simulação.\n
    *₿:* Acessar a corretora.\n
        ============
        `,
    keyboard
  );
});

bot.hears("₿ BitPreço", async (ctx) => {
  ctx.reply("Acesse a corretora https://bitpreco.com/", keyboard);
});

bot.hears("🧾 Balance", async (ctx) => {
  await checkBalances();
});

bot.hears("🔛 Test Mode", async (ctx) => {
  if (test === false) {
    test = true;
    ctx.reply("\u{1F6D1} Modo teste ativado!", keyboard);
    checkBalances();
  } else {
    test = false;
    ctx.replyWithMarkdown(`\u{1F911} Modo teste desativado!`, keyboard);
    checkBalances();
  }
});

bot.hears("☸ Configs", async (ctx) => {
  ctx.replyWithMarkdown(
    `
  ℹ️ *Modo teste*: ${test ? "ativado" : "desativado"}
  ℹ️ *InitialSell*: ${initialSell ? "ativado" : "desativado"}
  💵 *Valor em operação*: ${amount}
      `,
    keyboard
  );
});

bot.hears("🔍 BTC Price", async (ctx) => {
  let priceBTC = await bitpreco.ticker("BTC-BRL");
  ctx.replyWithMarkdown(
    `*BitPreço:*
  📊 *Último preço:* ${Number(priceBTC.last).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  })}
  📈 *Alta de hoje:* ${Number(priceBTC.high).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  })}
  📉 *Baixa de hoje:* ${Number(priceBTC.low).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  })}
   ₿ *Volume:* ${Number(priceBTC.vol)} BTC
  `,
    keyboard
  );
});

bot.command("status", async (ctx) => {
  await loadBalance();
});

async function loadBalance() {
  const result = await bitpreco.balance();

  BRL = result.BRL;
  BTC = result.BTC;
  USDT = result.USDT;
  ETH = result.ETH;
}

async function checkOrderbook(payload) {
  try {
    const bids = payload.bids; // lista das ofertas de compra disponíveis
    const asks = payload.asks; // lista das ofertas de venda disponíveis

    const bestOrderSell = bids[0];
    const bestOrderBuy = asks[0];

    return { bestOrderSell, bestOrderBuy };
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
}

const checkBalances = async () => {
  try {
    balances = await bitpreco.balance();
    const { BRL, BTC, USDT, ETH } = balances;
    let priceBTC = await bitpreco.ticker("BTC-BRL");
    let priceUSDT = await bitpreco.ticker("USDT-BRL");

    // Pegando a data
    let data = initialDate;

    // Precisamos quebrar a string para retornar cada parte
    const dataSplit = data.split("/");

    const day = dataSplit[0]; // 30
    const month = dataSplit[1]; // 03
    const year = dataSplit[2]; // 2019

    // Agora podemos inicializar o objeto Date, lembrando que o mês começa em 0, então fazemos -1.
    data = new Date(year, month - 1, day);
    const now = new Date(); // Data de hoje
    const past = new Date(data); // Outra data no passado
    const diff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).

    // Cálculo do lucro
    let profitBRLBTC = Number(BRL) + Number(priceBTC.last * BTC);
    let realizedProfit = percent(initialDeposit, profitBRLBTC);

    await bot.telegram.sendMessage(
      BOT_CHAT,
      `\u{1F911} Balanço:
<b>Status</b>: ${
        !test ? `\u{1F51B} Robô operando.` : `\u{1F6D1} Modo simulação.`
      } 
<b>Data inicial</b>: ${initialDate}
<b>Dias ativado</b>: ${days}
<b>Depósito inicial</b>: R$ ${initialDeposit.toFixed(2)}
<b>Saldo BRL:</b> R$ ${BRL} 
<b>Saldo USDT:</b> $ ${USDT} 
<b>Saldo ETH:</b> $ ${ETH} 
<b>Saldo BTC:</b> ${BTC} (R$ ${(priceBTC.last * BTC).toFixed(2)})
<b>Operando com</b>: ${amount}
<b>Profit (BRL + BTC):</b> ${realizedProfit.toFixed(2)}% (R$ ${(
        profitBRLBTC - initialDeposit
      ).toFixed(2)});
`,
      { parse_mode: "HTML" }
    );
    await bot.telegram.sendMessage(
      BOT_CHAT,
      "Extrato resumido. Para maiores detalhes, acesse a corretora BitPreço!",
      keyboard
    );

    handleMessage(`Balances:  BRL: ${BRL} - BTC: ${BTC} `);
  } catch (e) {
    console.log(e);
    bot.telegram.sendMessage(
      BOT_CHAT,
      "Máximo de 12 requisições por minuto. Tente novamente em alguns instantes!"
    );
  }
};

async function start() {
  handleMessage("Starting trades");
  bot.telegram.sendMessage(BOT_CHAT, "\u{1F911} Iniciando trades!", keyboard);

  // Adicionamos um callback pro evento snapshot,
  // que vai receber versões completas e atualizadas do orderbook
  channel.on("snapshot", async (payload) => {
    if (!BRL || !BTC || !ETH || !USDT) {
      await loadBalance();
    }

    const { bestOrderBuy, bestOrderSell } = await checkOrderbook(payload);

    const maxAmount = Math.min(bestOrderBuy.amount, bestOrderSell.amount);
    const maxVolume = (maxAmount * bestOrderBuy.price).toFixed(2);
    let volume = amount;

    if (maxVolume < volume) {
      volume = maxVolume - 1;
    }

    const profit = percent(bestOrderBuy.price, bestOrderSell.price);

    if (differencelogger) {
      handleMessage(`📈 Variação de preço: ${profit.toFixed(2)}%`);
      handleMessage(`📈 Profit: ${minProfitPercent}`);
      handleMessage(
        `📈 Saldo: BTC ${BTC} - BRL ${BRL} - USDT ${USDT} - ETH ${ETH}`
      );
      handleMessage(`📈 inititalSell: ${initialSell}`);
      handleMessage(`Test mode: ${test}`);
      differencelogger = false;
    }

    handleMessage(`📈 Variação de preço: ${profit.toFixed(2)}%`);

    if (profit >= minProfitPercent && !test) {
      // buy
      try {
        const buyOffer = await bitpreco.offer(
          "buy",
          `${MARKET}`,
          "", // price
          `${volume}`, // volume
          "", // amount
          "false"
        );
        handleMessage("Success on buy");
        logger.info("sucess on buy");
        const coinAmount = buyOffer.exec_amount;

        const isExecuted = buyOffer.message_cod === "ORDER_FULLY_EXECUTED";

        if (isExecuted) {
          // sell
          const sellOffer = await bitpreco.offer(
            "sell",
            `${MARKET}`,
            "", // price
            "", // volume em reais
            `${coinAmount}`, //amount
            "false"
          );
          handleMessage("Success on sell");
          logger.info("sucess on sell");
          bot.telegram.sendMessage(
            BOT_CHAT,
            `\u{1F911} Sucesso! Lucro: ${profit.toFixed(2)}%\nBuy: ${
              bestOrderBuy.price
            }, Sell: ${bestOrderSell.price}`,
            keyboard
          );
        } else {
          const cancelOrder = await bitpreco.orderCancel(buyOffer.order_id);
        }
      } catch (error) {
        bot.telegram.sendMessage(
          BOT_CHAT,
          `Error on buy: ${JSON.stringify(error.message)}`,
          keyboard
        );
        logger.error(error);
      }
    }
  });
}

start().catch((e) => handleMessage(JSON.stringify(e), e));

bot.launch();
