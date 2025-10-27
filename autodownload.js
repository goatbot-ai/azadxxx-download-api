const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API_BASE = "https://azadxxx-download-api.onrender.com";

const supportedDomains = [
  "facebook.com", "fb.watch", "youtube.com", "youtu.be", "tiktok.com",
  "instagram.com", "instagr.am", "likee.com", "likee.video", "capcut.com",
  "spotify.com", "terabox.com", "twitter.com", "x.com", "drive.google.com",
  "soundcloud.com", "ndown.app", "pinterest.com", "pin.it"
];

const cooldown = new Set();

module.exports = {
  config: { name: "autodownload", version: "3.0", author: "Azad 💥", role: 0 },

  onStart: async function({ api, event }) {
    api.sendMessage("📥 Send any supported video/media link to auto-download.", event.threadID, event.messageID);
  },

  onChat: async function({ api, event }) {
    const content = event.body?.trim();
    if (!content || !content.startsWith("https://")) return;
    if (!supportedDomains.some(domain => content.includes(domain))) return;

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
      const ext = mediaURL.includes(".mp3") ? "mp3" : "mp4";

      const buffer = (await axios.get(mediaURL, { responseType: "arraybuffer" })).data;
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const filePath = path.join(cacheDir, `auto_media_${Date.now()}.${ext}`);
      fs.writeFileSync(filePath, Buffer.from(buffer));

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      const info = `✅ Successfully downloaded!\n🎬 Title: ${title}\n🔖 Platform: ${platform}\nMade with 💫 by Azad💥`;

      api.sendMessage({ body: info, attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    } catch (err) {
      console.error("AutoDL Error:", err.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
