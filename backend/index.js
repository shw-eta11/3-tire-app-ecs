const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ 1. CORS must come first
app.use(cors({
  origin: 'http://lb-1619194084.ap-south-1.elb.amazonaws.com' // frontend ALB
}));

// ✅ 2. Parse JSON
app.use(express.json());

// ✅ 3. Database setup
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Wait for DB to be ready
const waitForDB = () => {
  db.query('SELECT 1', (err) => {
    if (err) {
      console.log('Waiting for database...');
      setTimeout(waitForDB, 5000);
    } else {
      console.log('Connected to MySQL');
      runInitSQL();
    }
  });
};
waitForDB();

const runInitSQL = () => {
  const sqlPath = path.join(__dirname, 'db', 'init.sql');
  const initSQL = fs.readFileSync(sqlPath, 'utf8');

  db.query(initSQL, (err) => {
    if (err) {
      console.error('Init SQL failed:', err);
    } else {
      console.log('Init SQL executed successfully');
    }
  });
};

// Test initial connection
db.getConnection((err, connection) => {
  if (err) console.error('DB connection failed:', err);
  else {
    console.log('Connected to MySQL');
    connection.release();
  }
});

// ✅ 4. Routes
app.get('/api/message', (req, res) => {
  db.query('SELECT message FROM messages ORDER BY RAND() LIMIT 1', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: results.length ? results[0].message : 'No messages found' });
  });
});

app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/message', (req, res) => {
  const { message, category } = req.body;
  if (!message || !category) return res.status(400).json({ error: 'Message and category required' });

  db.query('INSERT INTO messages (message, category) VALUES (?, ?)', [message, category], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: results.insertId, message, category });
  });
});

app.get('/api/health', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) return res.status(500).json({ status: 'fail', database: 'unreachable', error: err });
    res.json({ status: 'ok', database: 'reachable' });
  });
});

// ✅ 5. Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
