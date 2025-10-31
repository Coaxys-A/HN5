const mysql = require('mysql2/promise');

let pool;

function getPool() {
  if (pool) return pool;
  const uri = process.env.MYSQL_DSN || 'mysql://nofdoet:nofdoetpass@localhost:3306/nofdoet';
  pool = mysql.createPool({ uri, waitForConnections: true, connectionLimit: 10 });
  return pool;
}

module.exports = {
  getPool
};
