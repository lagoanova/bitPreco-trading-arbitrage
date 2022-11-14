const axios = require("axios");
const axiosRetry = require("axios-retry");
const FormData = require("form-data");
let signature = process.env.SIGNATURE;
let api_key = process.env.API_KEY;
let url;

axiosRetry(axios, { retries: 3 });

if (process.env.TEST.toLowerCase() === "true") {
  url = process.env.API_SIMULADOR;
  signature = process.env.TEST_SIGNATURE;
  api_key = process.env.TEST_API_KEY;
} else {
  url = process.env.API_URL;
}

const auth_token = signature + api_key;

async function ticker(market) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const ticker = await axios.get(
          `${url.replace("trading/", "")}${market.toLowerCase()}/ticker`
        );
        resolve(ticker.data);
      } catch (error) {
        reject(error);
      }
    })();
  });
}

async function balance() {
  return call("balance", null, "POST");
}

function offer(type, market, price, volume, amount, limited = false) {
  return call(type, { market, price, volume, amount, limited }, "POST");
}

function orderCancel(orderId) {
  let data = new FormData();
  data.append("cmd", "order_cancel");
  data.append("auth_token", `${auth_token}`);
  data.append("order_id", `${orderId}`);

  var config = {
    method: "post",
    url,
    headers: {
      ...data.getHeaders(),
    },
    data,
  };

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios(config);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

async function call(endpoint, params, method = "POST") {
  let data = new FormData();
  data.append("cmd", endpoint);
  data.append("auth_token", auth_token);
  data.append("market", params?.market ?? "");
  data.append("price", params?.price ?? "");
  data.append("volume", params?.volume ?? "");
  data.append("amount", params?.amount ?? "");
  data.append("limited", params?.limited ?? "");

  var config = {
    method: "post",
    url,
    headers: {
      ...data.getHeaders(),
    },
    data,
  };

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios(config);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  ticker,
  balance,
  offer,
  orderCancel,
};
