const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./unko_e_eats.db');

db.serialize(() => {
  // Menu Table: Replaces static HTML for "efficient management"
  db.run("CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, name TEXT, price REAL, category TEXT)");
  
  // Feedback Table: Replaces client-side persistence
  db.run("CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY, user_name TEXT, rating INTEGER, comments TEXT)");
  
  // Insert one item to test
  db.run("INSERT INTO menu (name, price, category) VALUES ('Chicken Katsu Plate', 12.00, 'plate')");
});
