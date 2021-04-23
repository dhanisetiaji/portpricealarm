const puppeteer = require("puppeteer");
const delay = require("delay");
const moment = require("moment");
const COLORS = require("./lib/colors");
const { Telegraf } = require("telegraf");
const mysql = require("mysql");

const url = "https://zilstream.com/tokens/port";
const bot = new Telegraf("1777128302:AAF6K0ulmQYaHyN6DUtWN2K5XCuX-agu7i8");
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bot_port",
});
dbcon();
function dbcon() {
  console.log("DB Connected!");
  conn.query("SELECT * FROM msg", function (err, result, fields) {
    if (err) {
      throw err;
    }
    dataChat = [];
    result.forEach((item) => {
      // console.log(item.jawab)
      dataChat.push({
        id: item.id,
        pesan: item.pesan,
        UpdateDate: item.UpdateDate,
      });
    });
  });
}

const serverOption = {
  headless: true,
  // args: [
  //     '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
  //     '--user-data-dir=/tmp/user_data/',
  // ]
};

async function data() {
  const browser = await puppeteer.launch(serverOption);
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "load" });
  const valueusd = await page.evaluate(
    () => document.querySelectorAll(".text-gray-500")[1].innerText
  );
  const data = valueusd
    .toString()
    .replace(/\r\n|\r|\n/g, " ")
    .split(" ");
  //   const data = JSON.parse(valueusd);
  const harga = data[0];
  const persen = data[1] + data[2];
  const addData = `Price : ${harga}( ${persen} )`;
  let sql = `UPDATE msg SET pesan="${addData}" WHERE msg.id=1`;
  conn.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    dbcon();
  });
}

(async () => {
  try {
    while (true) {
      data();
      await delay(5000);
      bot.start((ctx) => {
        console.log(dataChat);
        ctx.reply(`${dataChat.pesan}\nUpdate Date : ${dataChat.UpdateDate}`);
        console.log(ctx.message.from.username);
      });
      await delay(10000);
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
  //   }
})();

bot.launch(
  console.log(
    `[ ${moment().format("HH:mm:ss")} ]`,
    COLORS.FgGreen,
    `Bot Berhasil dijalankan!`,
    COLORS.Reset
  )
);
