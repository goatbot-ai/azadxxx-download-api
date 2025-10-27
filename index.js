const express = require("express");
const axios = require("axios");
const ytdl = require("ytdl-core"); // YouTube
const tiktok = require("tiktok-scraper"); // TikTok
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/download", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ operator: "Azad 💥", error: "❌ URL parameter is required" });

  try {
    let result = { video: "", title: "", platform: "" };

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const info = await ytdl.getInfo(url);
      result.video = info.formats.filter(f => f.hasVideo && f.hasAudio)[0].url;
      result.title = info.videoDetails.title;
      result.platform = "YouTube";
    } else if (url.includes("tiktok.com")) {
      const data = await tiktok.getVideoMeta(url);
      result.video = data.collector[0].videoUrl;
      result.title = data.collector[0].text || "TikTok Video";
      result.platform = "TikTok";
    } else {
      // অন্যান্য platform এর জন্য placeholder
      result.video = url;
      result.title = "Unknown Title";
      result.platform = "Unknown";
    }

    res.json({ status: true, result });
  } catch (err) {
    console.error(err.message);
    res.json({ operator: "Azad 💥", error: "❌ Failed to fetch video" });
  }
});

app.listen(PORT, () => console.log(`🚀 Download API running on port ${PORT}`));
