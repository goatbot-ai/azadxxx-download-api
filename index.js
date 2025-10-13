const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Render! Your API is working.');
});

// Example route
app.get('/status', (req, res) => {
  res.json({ status: 'success', message: 'API is running smoothly!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
