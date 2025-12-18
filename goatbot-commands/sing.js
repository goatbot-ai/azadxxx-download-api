const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "sing",
    version: "1.0",
    author: "Toshiro Editz",
    role: 0,
    shortDescription: "Play a song from YouTube",
    longDescription: "Search and play audio from YouTube based on song name",
    category: "music",
    guide: {
      en: "{pn} <song name>\nExample: {pn} faded",
    },
    cooldowns: 10,
  },

  onStart: async function ({ api, event, args, message }) {
    let filePath = null;

    try {
      if (!args[0]) {
        return message.reply(
          "⚠️ Please provide a song name!\n\nUsage: sing <song name>\nExample: sing faded",
        );
      }

      const query = args.join(" ");

      message.reply("🔍 Searching for: " + query + "\n⏳ Please wait...");

      const API_URL = `https://toshiro-eight.vercel.app/api/sing?query=${encodeURIComponent(query)}`;

      const response = await axios.get(API_URL, {
        responseType: "stream",
      });

      const contentType = response.headers["content-type"] || "audio/mpeg";
      let fileExtension = ".mp3";

      if (contentType.includes("webm")) {
        fileExtension = ".webm";
      } else if (contentType.includes("mp4") || contentType.includes("m4a")) {
        fileExtension = ".m4a";
      } else if (contentType.includes("ogg") || contentType.includes("opus")) {
        fileExtension = ".ogg";
      }

      const fileName = `${Date.now()}${fileExtension}`;
      filePath = path.join(__dirname, "cache", fileName);

      await fs.ensureDir(path.join(__dirname, "cache"));

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await message.reply({
        body: `🎵 Now Playing: ${query}\n\n👤 Requested by: ${event.senderID}\n⚡ Command by: Toshiro Editz`,
        attachment: fs.createReadStream(filePath),
      });
    } catch (error) {
      console.error("Error in sing command:", error);
      message.reply(
        "❌ Error: Failed to play the song. Please try again or use a different song name.\n\n" +
          error.message,
      );
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupError) {
          console.error("Failed to cleanup file:", cleanupError);
        }
      }
    }
  },
};
