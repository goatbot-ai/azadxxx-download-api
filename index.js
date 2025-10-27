const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/download", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.json({ operator: "Azad 💥", error: "❌ URL parameter is required" });

  try {
    // Dynamic API call to your main download API
    const apiRes = await axios.get(`https://azadxxx-download-api.onrender.com/api/auto?url=${encodeURIComponent(videoUrl)}`);
    if (!apiRes.data || !apiRes.data.result?.video) throw new Error("Media not found");

    const { video, title, platform } = apiRes.data.result;
    res.json({ status: true, result: { video, title, platform } });
  } catch (err) {
    res.json({ operator: "Azad 💥", error: "❌ Failed to fetch video" });
  }
});

app.listen(PORT, () => console.log(`✅ Download API running on port ${PORT}`));
