const moment = require("moment");

function handleMessage(message, level = "info") {
  console.log(`[BitPreco BOT] [${moment().format()}] [${level}] - ${message}`);
}

function handleError(message, error, throwError = false) {
  console.error(
    `[BitPreco BOT] [${moment().format()}] [error] - ${message}`,
    error
  );
  if (throwError) {
    throw new Error(error);
  }
}

function percent(value1, value2) {
  return (Number(value2) / Number(value1) - 1) * 100;
}

module.exports = {
  handleMessage,
  handleError,
  percent,
};
