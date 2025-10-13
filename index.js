const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("🚀 gemini API is running!");
});

// Example GET API
app.get("/api/gemini", (req, res) => {
  res.json({ message: "🚀 Gemini API proxy is running!" });
});

// Example POST API
app.post("/api", (req, res) => {
  res.json({
    received: req.body,
    info: "This is what you sent to the API"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ gemini API running on http://localhost:${PORT}`);
});
