const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const db = new sqlite3.Database('./unko_e_eats.db');

app.use(express.json());
app.use(express.static('public')); // Put your HTML/CSS/JS files here

// Route to get the menu (Dynamic Web App requirement)
app.get('/api/menu', (req, res) => {
  db.all("SELECT * FROM menu", [], (err, rows) => {
    res.json(rows);
  });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
