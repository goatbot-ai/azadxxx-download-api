import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { downloadYT } from "./utils/download.js";

dotenv.config();
const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tmpDir = path.join(__dirname, "tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

app.use("/tmp", express.static(tmpDir));

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "✅ YouTube Downloader API by Azad",
    author: "Azad",
    base_url: process.env.BASE_URL,
    usage: "/yt?url=<youtube_url>&type=mp3|mp4"
  });
});

app.get("/yt", async (req, res) => {
  const url = req.query.url;
  const type = req.query.type || "mp3";
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!url) return res.json({ status: false, error: "❌ Missing URL" });
  if (!apiKey) return res.json({ status: false, error: "❌ API key missing in .env" });

  try {
    const result = await downloadYT(url, type, tmpDir, process.env.BASE_URL);
    res.json({
      status: true,
      format: type,
      download_url: result
    });
  } catch (err) {
    console.error("Download Error:", err.message);
    res.json({ status: false, error: "Failed to process download" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
