// File: index.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Gemini API route
app.get("/api/gemini", (req, res) => {
  res.json({ message: "🚀 Gemini API proxy is running!" });
});

// যদি POST request লাগে, উদাহরণ
app.post("/api/gemini", (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  // এখানে তুমি Gemini বা অন্য model থেকে response generate করতে পারো
  res.json({ reply: `You sent: ${prompt}` });
});

// PORT configuration for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Gemini API running on port ${PORT}`);
});
