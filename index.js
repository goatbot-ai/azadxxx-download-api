const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// Helper to get from multiple sources
async function trySources(url) {
  const sources = [
    `https://api.akuari.my.id/downloader/allinone?url=${encodeURIComponent(url)}`,
    `https://api.betabotz.org/api/download/all?url=${encodeURIComponent(url)}&apikey=BetaBotz`,
    `https://api.neoxr.eu/api/download?url=${encodeURIComponent(url)}&apikey=Neoxr`
  ];

  for (const api of sources) {
    try {
      const res = await axios.get(api);
      if (res.data && (res.data.result || res.data.data)) {
        return res.data.result || res.data.data;
      }
    } catch (err) {
      console.log("❌ Failed:", api.split("/")[2]);
    }
  }
  return null;
}

// Main Route
app.get("/api/download", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ status: false, message: "Please provide a URL!" });

  const result = await trySources(url);
  if (!result)
    return res.json({ status: false, message: "All sources failed 😢 Try again later." });

  res.json({
    status: true,
    creator: "Azad 💥",
    result
  });
});

app.listen(PORT, () => console.log(`🚀 Auto Downloader running on port ${PORT}`));
