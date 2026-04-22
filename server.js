const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Connect to your new centralized database
const db = new sqlite3.Database('./unko_e_eats.db');

// Serve your front-end files from the public folder
app.use(express.static('public'));
app.use(express.json());

// Basic test route to see if the server is alive
app.get('/api/status', (req, res) => {
  res.json({ status: 'Unko Es Eats Backend is Operational' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
