require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const ytdl = require('ytdl-core'); // YouTube
const { getVideoMeta } = require('tiktok-scraper-ts'); // TikTok
const igdl = require('instagram-url-direct'); // Instagram

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// -----------------------
function detectPlatform(url) {
  url = url.toLowerCase();
  if(url.includes("facebook.com") || url.includes("fb.watch")) return "facebook";
  if(url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if(url.includes("tiktok.com")) return "tiktok";
  if(url.includes("instagram.com") || url.includes("instagr.am")) return "instagram";
  if(url.includes("likee.com") || url.includes("likee.video")) return "likee";
  if(url.includes("capcut.com")) return "capcut";
  if(url.includes("spotify.com")) return "spotify";
  if(url.includes("terabox.com")) return "terabox";
  if(url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if(url.includes("drive.google.com")) return "drive";
  if(url.includes("soundcloud.com")) return "soundcloud";
  if(url.includes("ndown.app")) return "ndown";
  if(url.includes("pinterest.com") || url.includes("pin.it")) return "pinterest";
  return "unknown";
}

// -----------------------
app.get('/api/auto', async (req,res)=>{
  const url = req.query.url;
  if(!url) return res.json({error:"No URL provided"});

  const platform = detectPlatform(url);

  try{
    let result = {};

    switch(platform){
      case "tiktok":
        const tiktok = await getVideoMeta(url);
        result = {
          title: tiktok.collector[0].text || "TikTok Video",
          platform: "TikTok",
          url: tiktok.collector[0].videoUrl
        };
        break;

      case "youtube":
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, {quality:"highest"});
        result = {
          title: info.videoDetails.title,
          platform: "YouTube",
          url: format.url
        };
        break;

      case "instagram":
        const ig = await igdl(url);
        result = {
          title: "Instagram Media",
          platform: "Instagram",
          url: ig[0].url
        };
        break;

      case "facebook":
      case "likee":
      case "capcut":
      case "spotify":
      case "terabox":
      case "twitter":
      case "drive":
      case "soundcloud":
      case "ndown":
      case "pinterest":
        result = {error:`${platform} download not implemented yet`};
        break;

      default:
        result = {error:"Platform not supported"};
    }

    return res.json(result);

  } catch(err){
    return res.json({error:err.message});
  }
});

// -----------------------
app.listen(PORT,()=>console.log(`AutoDownloader API running on port ${PORT}`));
