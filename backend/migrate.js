const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function runMigrations() {
  const dir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(dir)) {
    console.log('No migrations directory found');
    return;
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    const p = path.join(dir, file);
    const sql = fs.readFileSync(p, 'utf8').trim();
    if (!sql) continue;
    try {
      console.log('Applying migration:', file);
      await pool.query(sql);
      console.log('Applied:', file);
    } catch (err) {
      console.error('Migration failed:', file, err.message || err);
      throw err;
    }
  }
}

module.exports = { runMigrations };
