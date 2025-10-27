module.exports = {
  extractVideoUrl: (text) => {
    const regex = /(https?:\/\/(?:www\.)?(tiktok\.com|instagram\.com|facebook\.com|fb\.watch|youtube\.com|youtu\.be|twitter\.com|x\.com)\/[^\s]+)/i;
    const match = text.match(regex);
    return match ? match[1] : null;
  },

  detectPlatform: (url) => {
    const match = url.match(/(?:www\.)?(tiktok\.com|instagram\.com|facebook\.com|fb\.watch|youtube\.com|youtu\.be|twitter\.com|x\.com)/i);
    return match ? match[1].replace("www.", "") : "Unknown";
  }
};
