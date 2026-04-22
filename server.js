const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

const db = new sqlite3.Database('./unko_e_eats.db');

// Create the tables (Your Project Plan: "Design the tables")
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, name TEXT, price REAL, category TEXT)");
  
  db.get("SELECT count(*) as count FROM menu", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO menu (name, price, category) VALUES (?, ?, ?)");
      // Plates
      stmt.run('Chicken Katsu Plate', 12.00, 'plate');
      stmt.run('Barbeque Chicken Plate', 12.00, 'plate');
      stmt.run('Kalbi Plate', 14.00, 'plate');
      stmt.run('Loco Moco', 12.00, 'plate');
      // Bowls
      stmt.run('Poke Bowl', 8.00, 'bowl');
      stmt.run('Garlic Shrimp Bowl', 10.00, 'bowl');
      // Sides
      stmt.run('Mac Salad', 4.00, 'sides');
      stmt.run('Kimchi Cucumber', 4.00, 'sides');
      stmt.run('Furikake Fries', 6.00, 'sides');
      // Drinks & Catering
      stmt.run('Juice', 3.00, 'drinks');
      stmt.run('Catering Tray', 100.00, 'catering');
      
      stmt.finalize();
      console.log("Full menu populated."); [cite: 1276]
    }
  });
});

app.use(express.static('public'));
app.use(express.json());

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
