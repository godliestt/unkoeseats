const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

const db = new sqlite3.Database('./unko_e_eats.db');

// Create the tables (Your Project Plan: "Design the tables")
db.serialize(() => {
  // Menu Table
  db.run("CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, name TEXT, price REAL, category TEXT)");
  
  // Inquiries Table (For your Contact Form)
  db.run("CREATE TABLE IF NOT EXISTS inquiries (id INTEGER PRIMARY KEY, name TEXT, email TEXT, details TEXT, type TEXT)");
  
  // Feedback Table (For your Feedback Form)
  db.run("CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY, name TEXT, rating INTEGER, comments TEXT)");
});

app.use(express.static('public'));
app.use(express.json());

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
