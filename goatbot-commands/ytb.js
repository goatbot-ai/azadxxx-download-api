const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "ytb",
    version: "1.0",
    author: "Toshiro Editz",
    role: 0,
    shortDescription: "Get YouTube video information",
    longDescription: "Get detailed information about a YouTube video including title, duration, thumbnail, and download links",
    category: "media",
    guide: {
      en: "{pn} <YouTube URL>\nExample: {pn} https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    cooldowns: 5
  },

  onStart: async function({ api, event, args, message }) {
    let thumbnailPath = null;

    try {
      if (!args[0]) {
        return message.reply("⚠️ Please provide a YouTube URL!\n\nUsage: ytb <YouTube URL>\nExample: ytb https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      }

      const url = args[0];

      if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return message.reply("❌ Invalid URL! Please provide a valid YouTube URL.");
      }

      message.reply("📥 Fetching video information...\n⏳ Please wait...");

      const API_URL = `https://toshiro-eight.vercel.app/api/ytb?url=${encodeURIComponent(url)}`;

      const response = await axios.get(API_URL);
      const data = response.data;

      const minutes = Math.floor(data.duration / 60);
      const seconds = data.duration % 60;
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      thumbnailPath = path.join(__dirname, 'cache', `${Date.now()}.jpg`);
      await fs.ensureDir(path.join(__dirname, 'cache'));

      const thumbnailResponse = await axios.get(data.thumbnail, {
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(thumbnailPath);
      thumbnailResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const infoMessage = `📹 YouTube Video Information\n\n` +
        `📝 Title: ${data.title}\n` +
        `👤 Author: ${data.author}\n` +
        `⏱️ Duration: ${formattedDuration}\n` +
        `🔗 Video URL: ${data.video}\n` +
        `🎵 Audio URL: ${data.audio}\n\n` +
        `⚡ Command by: Toshiro Editz`;

      await message.reply({
        body: infoMessage,
        attachment: fs.createReadStream(thumbnailPath)
      });

    } catch (error) {
      console.error('Error in ytb command:', error);
      
      if (error.response && error.response.data) {
        return message.reply("❌ Error: " + (error.response.data.error || "Failed to fetch video information"));
      }
      
      message.reply("❌ Error: Failed to fetch video information. Please check the URL and try again.\n\n" + error.message);
    } finally {
      if (thumbnailPath && fs.existsSync(thumbnailPath)) {
        try {
          fs.unlinkSync(thumbnailPath);
        } catch (cleanupError) {
          console.error('Failed to cleanup thumbnail:', cleanupError);
        }
      }
    }
  }
};
