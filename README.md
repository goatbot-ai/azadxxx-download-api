# YouTube API Server

A production-ready serverless API for YouTube search and video information, optimized for Render and Vercel deployment.

## Features

- **Audio Streaming**: Search YouTube and stream audio directly
- **Video Metadata**: Get video information including title, duration, thumbnail, author, and streaming URLs
- **CORS Enabled**: Works with any frontend application
- **Health Monitoring**: Built-in health check endpoint
- **Production Ready**: Optimized for serverless and cloud deployments

## API Endpoints

### 1. Home Page
```
GET /
```
Beautiful landing page with API documentation and live examples.

### 2. Search and Stream Audio
```
GET /api/sing?query={search_term}
```

**Parameters:**
- `query` (required) - Search term for YouTube

**Response:**
- Direct audio stream (Content-Type: audio/webm or audio/mp4)

**Example:**
```
https://yourproject.vercel.app/api/sing?query=faded
```

### 3. Get Video Metadata
```
GET /api/ytb?url={youtube_url}
```

**Parameters:**
- `url` (required) - YouTube video URL

**Response:**
```json
{
  "title": "Video Title",
  "duration": "180",
  "thumbnail": "https://...",
  "author": "Channel Name",
  "audio": "https://...",
  "video": "https://..."
}
```

**Example:**
```
https://yourproject.vercel.app/api/ytb?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### 4. Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "production",
  "service": "youtube-api-server",
  "version": "1.0.0"
}
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Deployment

### 🚀 Deploy to Render (Recommended)

**Quick Deploy:**
1. Push code to GitHub
2. Connect repository to Render
3. Render auto-detects `render.yaml`
4. Click "Deploy"

For detailed instructions, see [RENDER-DEPLOYMENT.md](./RENDER-DEPLOYMENT.md)

**Benefits:**
- Free SSL certificate
- Auto-deploy on git push
- Built-in health checks
- Easy environment variable management

### ☁️ Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push this project to GitHub
2. Import the repository in Vercel dashboard
3. Deploy automatically

### Option 3: Drag and Drop
1. Compress the project folder (excluding `node_modules`)
2. Visit [vercel.com/new](https://vercel.com/new)
3. Drag and drop the folder

## Project Structure

```
api/
  sing.js      - Search and stream audio endpoint
  ytb.js       - Video metadata endpoint
  health.js    - Health check endpoint
  index.js     - Home page / landing page
package.json   - Dependencies and scripts
server.js      - Production server (for Render)
test-server.js - Local development server
render.yaml    - Render deployment configuration
vercel.json    - Vercel deployment configuration
.env.example   - Environment variables template
```

## Dependencies

- `yt-search` - YouTube video search
- `@distube/ytdl-core` - YouTube video/audio streaming (optimized fork)
- `axios` - HTTP client for API requests

## Environment Variables

See `.env.example` for configuration options:

```bash
NODE_ENV=production
PORT=10000
YOUTUBE_API_KEY=optional_key_here
```

## Tech Stack

- **Runtime**: Node.js 18+
- **Deployment**: Render / Vercel
- **Architecture**: Serverless / Web Service

## License

ISC
