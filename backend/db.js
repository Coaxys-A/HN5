const mysql = require('mysql2/promise');
const config = require('./config');

let pool;

function createPool() {
  const instance = mysql.createPool({
    uri: config.MYSQL_DSN,
    waitForConnections: true,
    connectionLimit: config.DB_CONNECTION_LIMIT,
    enableKeepAlive: true,
  });
  instance.on('error', (err) => {
    console.error('MySQL pool error', err);
  });
  return instance;
}

function getPool() {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

async function ensureDatabaseConnection() {
  const connection = await getPool().getConnection();
  try {
    await connection.query('SELECT 1');
  } finally {
    connection.release();
  }
}

module.exports = {
  getPool,
  ensureDatabaseConnection,
};
