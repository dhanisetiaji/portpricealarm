const TelegramBot = require("node-telegram-bot-api");
const delay = require("delay");
const moment = require("moment");
const COLORS = require("./lib/colors");
const date = require("date-and-time");
const axios = require("axios");

const token = "TOKEN TELE U";
const bot = new TelegramBot(token, { polling: true });

(async () => {
  try {
    const now = new Date();
    const res = await axios.get("https://api.zilstream.com/tokens/port");
    const data = res.data;

    while (true) {
      const usdvalue = data.rate_usd.toFixed(2);
      const zilvalue = data.rate.toFixed(3);
      const persen = data.market_data.change_24h.toFixed(2);
      //  ? bot.on("message", (msg) => {
      //  ?  //get chat id
      //  ? const chatId = msg.chat.id;
      //  ? // send a message to the chat acknowledging receipt of their message
      //  ? // bot.sendMessage(chatId, 'Received your message');
      //  ? });
      let waktu = date.format(now, "YYYY/MM/DD HH:mm:ss");
      const pesan = `Price ZIL: ${zilvalue}\nPrice USD: ${usdvalue}$( ${persen}% )\nUpdate On:  ${waktu}\n\nWait 5 Minute to next msg`;
      const chatId = ID CHAT u;
      console.log(chatId);
      bot.sendMessage(chatId, pesan);
      await delay(300000);
    }
  } catch (e) {
    console.log(
      `[ ${moment().format("HH:mm:ss")} ]`,
      COLORS.FgRed,
      `Error : ${e}`,
      COLORS.Reset
    );
    console.log("");
  }
})();
