const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs-extra");

const PAGE_ID = process.env.PAGE_ID;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const images = [
  "ใส่ลิงก์รูป1",
  "ใส่ลิงก์รูป2",
  "ใส่ลิงก์รูป3"
];

const captions = [
  "✨ Fluk Room รับตัดเย็บเสื้อผ้าตามแบบ ใส่แล้วพอดีตัว มั่นใจทุกงาน 👗",
  "👔 อยากได้ชุดพอดีตัวจริง ๆ? ให้ Fluk Room ดูแลคุณ",
  "🧵 งานตัดเย็บคุณภาพ ใส่ใจทุกรายละเอียด เลือก Fluk Room",
  "🔥 โปรพิเศษวันนี้ ทักแชทจองคิวกับ Fluk Room ได้เลย!",
  "💎 ตัดเย็บตามไซซ์จริง สวยเป๊ะทุกมุม โดย Fluk Room"
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function getUnusedImage() {
  let used = await fs.readJson("used.json");
  let unused = images.filter(img => !used.includes(img));

  if (unused.length === 0) {
    used = [];
    unused = images;
  }

  const selected = getRandomItem(unused);
  used.push(selected);
  await fs.writeJson("used.json", used);

  return selected;
}

cron.schedule("0 13 * * *", async () => {
  console.log("เริ่มโพสต์ 13:00...");

  try {
    const image = await getUnusedImage();
    const caption = getRandomItem(captions);

    await axios.post(
      `https://graph.facebook.com/${PAGE_ID}/photos`,
      {
        url: image,
        caption: caption,
        access_token: PAGE_ACCESS_TOKEN
      }
    );

    console.log("โพสต์สำเร็จ");
  } catch (error) {
    console.log("เกิดข้อผิดพลาด", error.response?.data);
  }

}, {
  timezone: "Asia/Bangkok"
});
