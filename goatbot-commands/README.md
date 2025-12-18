# GoatBot V2 Commands - Multi-Platform Media Integration
**Author:** Toshiro Editz

## 📦 Installation

### Step 1: Deploy Your API to Render or Vercel
1. Deploy the main Social Media Downloader API to Render or Vercel
2. Get your deployment URL (e.g., `https://yourproject.onrender.com` or `https://yourproject.vercel.app`)

### Step 2: Update API URLs
Edit command files and replace API URLs with your actual deployment URL:

**In `sing.js` (line 34):**
```javascript
const API_URL = `https://YOUR-API-URL.com/api/sing?query=${encodeURIComponent(query)}`;
```

**In `ytb.js` (line 36):**
```javascript
const API_URL = `https://YOUR-API-URL.com/api/ytb?url=${encodeURIComponent(url)}`;
```

**In `autodl.js` (line 47):**
```javascript
const API_URL = `https://YOUR-API-URL.com/download?url=${encodeURIComponent(url)}`;
```

### Step 3: Install Dependencies
Make sure your GoatBot V2 has these dependencies in `package.json`:
```bash
npm install axios fs-extra
```

### Step 4: Copy Commands to GoatBot
Copy all command files to your GoatBot V2 commands folder:
```
YourGoatBot/
  scripts/
    cmds/
      sing.js    ← Copy here
      ytb.js     ← Copy here
      autodl.js  ← Copy here (NEW!)
```

### Step 5: Restart Your Bot
Restart GoatBot V2 to load the new commands.

---

## 🎵 Commands Usage

### 1. AutoDL Command (NEW!)
Download videos from 8 different social media platforms automatically!

**Syntax:**
```
autodl <video URL>
```

**Supported Platforms:**
- ✅ YouTube (with audio extraction)
- ✅ TikTok (no watermark mode)
- ✅ Instagram Reels/Posts
- ✅ Twitter/X Videos
- ✅ Facebook Videos
- ✅ Reddit Videos
- ✅ Pinterest Videos
- ✅ Likee Videos

**Examples:**
```
autodl https://www.youtube.com/watch?v=dQw4w9WgXcQ
autodl https://www.tiktok.com/@user/video/123456789
autodl https://www.instagram.com/p/ABC123/
autodl https://twitter.com/user/status/123456789
autodl https://www.facebook.com/video.php?v=123
autodl https://www.reddit.com/r/videos/comments/xyz/
autodl https://www.pinterest.com/pin/123456789/
autodl https://www.likee.com/user/123456789
```

**Features:**
- 🎬 Auto-detects platform from URL
- 📥 Downloads video automatically
- 🖼️ Sends thumbnail preview
- 📝 Shows video title & metadata
- ⚡ Fast multi-platform support
- 👤 Shows original author/channel

---

### 3. Sing Command
Search and play audio from YouTube.

**Syntax:**
```
sing <song name>
```

**Examples:**
```
sing faded
sing shape of you
sing despacito
sing bohemian rhapsody
```

**Features:**
- 🔍 Searches YouTube automatically
- 🎵 Downloads and sends audio file
- ⚡ Fast response with caching
- 👤 Shows requester info

---

### 4. YTB Command
Get detailed YouTube video information.

**Syntax:**
```
ytb <YouTube URL>
```

**Examples:**
```
ytb https://www.youtube.com/watch?v=dQw4w9WgXcQ
ytb https://youtu.be/abc123
```

**Features:**
- 📹 Full video information
- 🖼️ Thumbnail preview
- ⏱️ Duration in MM:SS format
- 🔗 Direct audio & video URLs
- 👤 Channel author name

**Response Includes:**
- Video title
- Author/channel name
- Duration
- Thumbnail image
- Direct download links for audio & video

---

## ⚙️ Configuration

### Cooldowns
- **sing**: 10 seconds (to prevent spam)
- **ytb**: 5 seconds

### Permissions
- **Role**: 0 (all users can use)

To restrict to admins only, change `role: 0` to `role: 1` or `role: 2` in the config section.

---

## 🔧 Troubleshooting

**Command not working?**
1. ✅ Check if API URL is updated with your Vercel URL
2. ✅ Ensure axios and fs-extra are installed
3. ✅ Verify your Vercel API is deployed and working
4. ✅ Check GoatBot logs for error messages
5. ✅ Make sure cache folder has write permissions

**Audio not downloading?**
- Check your Vercel API endpoint: `/api/sing?query=test`
- Ensure sufficient storage space
- Verify internet connection is stable

**Video info not showing?**
- Verify the YouTube URL is valid
- Check your Vercel API endpoint: `/api/ytb?url=VIDEO_URL`
- Some videos may be age-restricted or region-locked

---

## 📝 Notes

- Commands use your Vercel serverless API (no API keys needed!)
- Audio files are temporarily cached and deleted after sending
- Thumbnail images are downloaded and deleted after sending
- Both commands have error handling and user-friendly messages

---

## 👨‍💻 Credits
**Command Author:** Toshiro Editz  
**Framework:** GoatBot V2 by NTKhang  
**API:** YouTube Search & Streaming (yt-search, ytdl-core)

---

## 📄 License
Free to use and modify. Credit appreciated!
