const pool = require('../db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

async function createUser({ username, email, password_hash, role }) {
  const now = new Date();
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
    [username, email, password_hash, role, now]
  );
  return { id: result.insertId };
}

module.exports = { findByEmail, findById, createUser };
