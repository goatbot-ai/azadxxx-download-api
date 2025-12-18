const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "autodl",
    version: "2.0",
    author: "Toshiro Editz",
    role: 0,
    shortDescription: "Download video from any social media platform",
    longDescription: "Auto-download videos from YouTube, TikTok, Instagram, Twitter, Facebook, Reddit, Pinterest, Likee",
    category: "media",
    guide: {
      en: "{pn} <video URL>\nExample: {pn} https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    cooldowns: 15,
  },

  onStart: async function ({ api, event, args, message }) {
    let filePath = null;
    let thumbnailPath = null;

    try {
      if (!args[0]) {
        return message.reply(
          "⚠️ Please provide a video URL!\n\n" +
          "Supported platforms:\n" +
          "🎬 YouTube\n" +
          "🎵 TikTok\n" +
          "📷 Instagram\n" +
          "🐦 Twitter/X\n" +
          "📘 Facebook\n" +
          "🔗 Reddit\n" +
          "📌 Pinterest\n" +
          "❤️ Likee\n\n" +
          "Usage: autodl <video URL>"
        );
      }

      const url = args[0];

      message.reply("📥 Processing your video...\n⏳ Please wait...");

      // Use your Replit or Render API URL here
      const API_URL = `${process.env.API_URL || "http://localhost:3000"}/download?url=${encodeURIComponent(url)}`;

      const response = await axios.get(API_URL);
      const data = response.data;

      if (!data.status) {
        return message.reply(
          `❌ Error: ${data.message || "Failed to download video"}`
        );
      }

      // Download video file
      const videoResponse = await axios.get(data.video, {
        responseType: "stream",
        timeout: 60000,
      });

      const videoFileName = `${Date.now()}_video.mp4`;
      filePath = path.join(__dirname, "cache", videoFileName);
      await fs.ensureDir(path.join(__dirname, "cache"));

      const videoWriter = fs.createWriteStream(filePath);
      videoResponse.data.pipe(videoWriter);

      await new Promise((resolve, reject) => {
        videoWriter.on("finish", resolve);
        videoWriter.on("error", reject);
      });

      // Download thumbnail if available
      let attachment = fs.createReadStream(filePath);
      if (data.thumbnail) {
        try {
          const thumbResponse = await axios.get(data.thumbnail, {
            responseType: "stream",
            timeout: 10000,
          });

          const thumbFileName = `${Date.now()}_thumb.jpg`;
          thumbnailPath = path.join(__dirname, "cache", thumbFileName);

          const thumbWriter = fs.createWriteStream(thumbnailPath);
          thumbResponse.data.pipe(thumbWriter);

          await new Promise((resolve, reject) => {
            thumbWriter.on("finish", resolve);
            thumbWriter.on("error", () => resolve()); // Don't fail if thumbnail fails
          });

          if (fs.existsSync(thumbnailPath)) {
            attachment = [
              fs.createReadStream(filePath),
              fs.createReadStream(thumbnailPath),
            ];
          }
        } catch (thumbError) {
          console.log("Thumbnail download skipped:", thumbError.message);
        }
      }

      const infoMessage =
        `📥 Successfully Downloaded!\n\n` +
        `📝 Title: ${data.title || "Unknown"}\n` +
        `🎬 Platform: ${(data.platform || "Unknown").toUpperCase()}\n` +
        (data.channel ? `👤 Channel: ${data.channel}\n` : "") +
        (data.duration ? `⏱️ Duration: ${data.duration}s\n` : "") +
        (data.author ? `👨‍💼 Author: ${data.author}\n` : "") +
        `\n⚡ Command by: Toshiro Editz`;

      await message.reply({
        body: infoMessage,
        attachment: attachment,
      });
    } catch (error) {
      console.error("Error in autodl command:", error);

      let errorMsg = "❌ Error: Failed to download video. Please check:\n";
      if (error.message.includes("ENOTFOUND")) {
        errorMsg += "- Invalid or unreachable URL\n";
      } else if (error.message.includes("timeout")) {
        errorMsg += "- Request timed out (video too large)\n";
      } else if (error.response && error.response.data) {
        errorMsg += `- ${error.response.data.message || "API error"}\n`;
      } else {
        errorMsg += `- ${error.message}\n`;
      }

      errorMsg += "\nSupported: YouTube, TikTok, Instagram, Twitter, Facebook, Reddit, Pinterest, Likee";

      message.reply(errorMsg);
    } finally {
      // Cleanup temporary files
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupError) {
          console.error("Failed to cleanup video file:", cleanupError);
        }
      }

      if (thumbnailPath && fs.existsSync(thumbnailPath)) {
        try {
          fs.unlinkSync(thumbnailPath);
        } catch (cleanupError) {
          console.error("Failed to cleanup thumbnail:", cleanupError);
        }
      }
    }
  },
};
