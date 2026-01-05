const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'srv945.hstgr.io',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'u307442259_translogic',
  password: process.env.DB_PASSWORD || '7hT=neW~h',
  database: process.env.DB_NAME || 'u307442259_translogic',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
