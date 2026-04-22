const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

const db = new sqlite3.Database('./unko_e_eats.db');

// --- DATABASE INITIALIZATION ---
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, name TEXT, price REAL, category TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS inquiries (id INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT, details TEXT, type TEXT, submittedAt TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY, name TEXT, rating INTEGER, comments TEXT, createdAt TEXT)");

  db.get("SELECT count(*) as count FROM menu", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO menu (name, price, category) VALUES (?, ?, ?)");
      stmt.run('Chicken Katsu Plate', 12.00, 'plate');
      stmt.run('Barbeque Chicken Plate', 12.00, 'plate');
      stmt.run('Kalbi Plate', 14.00, 'plate');
      stmt.run('Loco Moco', 12.00, 'plate');
      stmt.run('Poke Bowl', 8.00, 'bowl');
      stmt.run('Garlic Shrimp Bowl', 10.00, 'bowl');
      stmt.run('Mac Salad', 4.00, 'sides');
      stmt.run('Kimchi Cucumber', 4.00, 'sides');
      stmt.run('Furikake Fries', 6.00, 'sides');
      stmt.run('Juice', 3.00, 'drinks');
      stmt.run('Catering Tray', 100.00, 'catering');
      stmt.finalize();
    }
  });
});

app.use(express.static('public'));
app.use(express.json());

// --- SECURITY MIDDLEWARE ---
function checkPassword(req, res, next) {
  // Grabs the credentials from the browser's login pop-up
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  // Set your custom username and password here!
  if (username === 'admin' && password === 'kapolei123') {
    return next(); // Credentials match, let them through
  }

  // If wrong or missing, trigger the browser's built-in login prompt
  res.set('WWW-Authenticate', 'Basic realm="Unko E Admin"');
  res.status(401).send('Access denied. Proper credentials required.');
}

// --- API ROUTES ---

// 1. Get Menu (Retrieval logic)
app.get('/api/menu', (req, res) => {
  db.all("SELECT * FROM menu", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. Submit Contact Inquiry (Storage logic)
app.post('/api/contact', (req, res) => {
  const { name, email, phone, details, type } = req.body;

  // --- SERVER-SIDE VALIDATION ---
  if (!name || !email || !details || name.trim() === '' || email.trim() === '' || details.trim() === '') {
    return res.status(400).json({ error: 'Validation failed: Name, Email, and Description are required.' });
  }

  const sql = "INSERT INTO inquiries (name, email, phone, details, type, submittedAt) VALUES (?, ?, ?, ?, ?, ?)";
  const params = [name, email, phone, details, type, new Date().toISOString()];
  
  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// 3. Submit Feedback (Storage logic)
app.post('/api/feedback', (req, res) => {
  const { name, rating, comments } = req.body;

  // --- SERVER-SIDE VALIDATION ---
  if (!rating || !comments || comments.trim() === '') {
    return res.status(400).json({ error: 'Validation failed: Rating and Comments are required.' });
  }

  const sql = "INSERT INTO feedback (name, rating, comments, createdAt) VALUES (?, ?, ?, ?)";
  const params = [name, rating, comments, new Date().toISOString()];
  
  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

// --- ADMIN INTERFACE ---
// 1. Secure Route to serve the HTML Dashboard
app.get('/admin', checkPassword, (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});

// 2. Secure Route to serve the actual Database JSON
app.get('/api/admin/view', checkPassword, (req, res) => {
  db.all("SELECT * FROM inquiries", [], (err, inquiries) => {
    db.all("SELECT * FROM feedback", [], (err, feedback) => {
      res.json({
        catering_inquiries: inquiries,
        customer_feedback: feedback
      });
    });
  });
});
