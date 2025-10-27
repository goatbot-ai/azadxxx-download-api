const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

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
        const r = res.data.result || res.data.data;
        return {
          title: r.title || r.desc || r.caption || "Unknown Title 🎬",
          video:
            r.video ||
            r.url ||
            (r.data && r.data[0] && r.data[0].url) ||
            null
        };
      }
    } catch (err) {
      console.log(`❌ Failed: ${api.split("/")[2]}`);
    }
  }
  return null;
}

app.get("/", (req, res) => {
  res.send("🚀AutoDownloader API is running perfectly!");
});

app.get("/api/download", async (req, res) => {
  const url = req.query.url;
  if (!url)
    return res.json({ status: false, message: "Please provide a video URL!" });

  const result = await trySources(url);

  if (!result || !result.video) {
    return res.json({
      status: false,
      message: "All sources failed 😢 Try again later."
    });
  }

  res.json({
    status: true,
    creator: "Azad 💥",
    result: result
  });
});

app.listen(PORT, () =>
  console.log(`🎬 AutoDownloader API running on port ${PORT}`)
);
