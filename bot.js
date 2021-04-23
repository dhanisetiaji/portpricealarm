const TelegramBot = require("node-telegram-bot-api");
const puppeteer = require("puppeteer");
const delay = require("delay");
const moment = require("moment");
const COLORS = require("./lib/colors");
const date = require("date-and-time");

const url = "https://zilstream.com/tokens/port";
const token = "YOUR TOKEN";
const bot = new TelegramBot(token, { polling: true });
const serverOption = {
  headless: true,
  // args: [
  //     '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
  //     '--user-data-dir=/tmp/user_data/',
  // ]
};

(async () => {
  try {
    const now = new Date();
    const browser = await puppeteer.launch(serverOption);
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load" });

    while (true) {
      const valueusd = await page.evaluate(
        () => document.querySelectorAll(".text-gray-500")[1].innerText
      );
      const valuezil = await page.evaluate(
        () => document.querySelectorAll(".flex-grow")[3].innerText
      );
      const data = valueusd
        .toString()
        .replace(/\r\n|\r|\n/g, " ")
        .split(" ");
      const harga = data[0];
      const persen = data[1] + data[2];
      let waktu = date.format(now, "YYYY/MM/DD HH:mm:ss");
      const pesan = `Price ZIL: ${valuezil}\nPrice USD: ${harga}( ${persen} )\nUpdate On:  ${waktu}\n\nWait 5 Minute to next msg`;
      // bot.on("message", (msg) => {
      //   //get chat id
      //   const chatId = msg.chat.id;
      //   // send a message to the chat acknowledging receipt of their message
      //   // bot.sendMessage(chatId, 'Received your message');
      // });
      const chatId = 1065848664;
      console.log(chatId);
      bot.sendMessage(chatId, pesan);
      await delay(300000);
      await page.reload({ waitUntil: "load" });
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
