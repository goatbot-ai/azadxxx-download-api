const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API_BASE = "https://azadxxx-download-api.onrender.com"; // Update to deployed API
const supportedDomains = ["tiktok.com","youtube.com","instagram.com","facebook.com","x.com","twitter.com"];

const cooldown = new Set();

module.exports = {
  config: { name: "autodownload", author: "Azad 💥", version: "3.0" },

  onChat: async function({ api, event }) {
    const content = event.body?.trim();
    if (!content || !content.startsWith("https://")) return;
    if (!supportedDomains.some(d => content.includes(d))) return;
    if (cooldown.has(content)) return;
    cooldown.add(content);
    setTimeout(() => cooldown.delete(content), 10000);

    api.setMessageReaction("⌛️", event.messageID, () => {}, true);

    try {
      const res = await axios.get(`${API_BASE}/api/download?url=${encodeURIComponent(content)}`);
      const data = res.data;

      if (!data.status || !data.result?.video) throw new Error("Media not found");

      const mediaURL = data.result.video;
      const title = data.result.title || "Unknown Title";
      const platform = data.result.platform || "Unknown Platform";

      const buffer = (await axios.get(mediaURL, { responseType: "arraybuffer" })).data;
      const filePath = path.join(__dirname, "cache", `video_${Date.now()}.mp4`);
      await fs.ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, Buffer.from(buffer));

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      api.sendMessage(
        { body: `✅ Downloaded!\n🎬 Title: ${title}\n🔖 Platform: ${platform}`, attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );

    } catch (err) {
      console.error("AutoDL Error:", err.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
