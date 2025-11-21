require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const SpotifyDL = require('spotidownloader');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// -----------------------
// YouTube Search
app.get('/ytsearch', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "Search query is required" });

  const url = `https://me0xn4hy3i.execute-api.us-east-1.amazonaws.com/staging/api/resolve/resolveYoutubeSearch?search=${encodeURIComponent(query)}`;
  try {
    const response = await axios.get(url, { headers: { accept: "*/*" } });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// YouTube Mp3 Downloader
app.get('/ytmp3dl', async (req, res) => {
  const youtubeUrl = req.query.url;
  if (!youtubeUrl) return res.status(400).json({ error: "YouTube URL is required" });

  try {
    const apiKey = "30de256ad09118bd6b60a13de631ae2cea6e5f9d";
    const downloadUrl = `https://p.oceansaver.in/ajax/download.php?copyright=0&format=mp3&url=${encodeURIComponent(youtubeUrl)}&api=${apiKey}`;
    const { data: downloadData } = await axios.get(downloadUrl);

    if (downloadData.success) {
      const { id } = downloadData;
      const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
      const { data: progressData } = await axios.get(progressUrl);
      res.json(progressData);
    } else {
      res.status(400).json({ error: "Failed to initiate download" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// TikTok Downloader
app.get('/tikdl', async (req, res) => {
  const tiktokUrl = req.query.url;
  if (!tiktokUrl) return res.status(400).json({ error: "TikTok URL is required" });

  try {
    const postUrl = "https://ssstik.io/abc?url=dl";
    const data = new URLSearchParams({ id: tiktokUrl, locale: "en", tt: "YVJLR1Fi" }).toString();
    const { data: html } = await axios.post(postUrl, data, { headers: { "content-type": "application/x-www-form-urlencoded" } });

    const extractMatch = (regex, fallback="Unknown") => html.match(regex)?.[1] ?? fallback;

    res.json({
      author: extractMatch(/<h2>(.*?)<\/h2>/),
      profilePic: extractMatch(/<img class="result_author" src="(.*?)"/, "No profile picture"),
      description: extractMatch(/<p class="maintext">(.*?)<\/p>/, "No description"),
      likes: extractMatch(/<div>\s*(\d+)\s*<\/div>/, "0"),
      comments: extractMatch(/<div class="d-flex flex-1 align-items-center justify-content-center">\s*<svg[^>]*><\/svg>\s*<div>\s*(\d+)\s*<\/div>/, "0"),
      downloadLink: extractMatch(/href="(https:\/\/tikcdn\.io\/ssstik\/[^\"]+)"/, "No download link"),
      mp3DownloadLink: extractMatch(/<a href="(https:\/\/tikcdn\.io\/ssstik\/[^\"]+)"[^>]*class="pure-button[^>]*download_link music[^>]*">/, "No MP3 link")
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// Spotify Downloader
app.get('/spotifydl', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Spotify URL required" });

  try {
    const track = await SpotifyDL.get(url);
    if (track.error) return res.json({ error: track.error });

    res.json({
      trackInfo: track,
      downloadLink: track.download
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// Universal Downloader
app.get('/unidl', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: "Video URL required" });

  try {
    const postUrl = "https://universaldownloader.com/wp-json/aio-dl/video-data/";
    const body = `url=${encodeURIComponent(videoUrl)}`;
    const headers = { "content-type": "application/x-www-form-urlencoded" };

    const { data } = await axios.post(postUrl, body, { headers });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
app.listen(PORT, ()=>console.log(`Autodownloader API running on port ${PORT}`));
