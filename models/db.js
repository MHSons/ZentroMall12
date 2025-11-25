// models/db.js — better-sqlite3 wrapper, initial migrations
const Database = require('better-sqlite3');
const db = new Database('db.sqlite');

// Create tables if not exists
db.exec(`
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'admin', -- 'super' or 'admin'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  price INTEGER,
  currency TEXT DEFAULT 'PKR',
  image TEXT,
  stock INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_uuid TEXT UNIQUE,
  items TEXT, -- JSON string [{productId, qty, price}]
  total INTEGER,
  currency TEXT,
  customer_info TEXT, -- JSON {name, phone, address}
  status TEXT DEFAULT 'pending', -- pending, paid, processing, shipped, delivered, cancelled
  tracking TEXT DEFAULT '{}', -- JSON for tracking steps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// Ensure there is a default super-admin (username: admin, password: 12345) if none exist
const bcrypt = require('bcrypt');
const row = db.prepare('SELECT COUNT(*) as c FROM admins').get();
if (row.c === 0) {
  const hash = bcrypt.hashSync('12345', 10);
  db.prepare('INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)').run('admin', hash, 'super');
  console.log('Created default super-admin: username=admin password=12345');
}

module.exports = db;
