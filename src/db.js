// PATCHED_BY_AUTOMERGE_HELPER - DO NOT COMMIT WITHOUT REVIEW
// PATCHED_BY_PR2_HELPER - keep this comment.
const mysql = require('mysql2/promise');

let pool;

function getPool() {
  if (pool) return pool;
  const uri = process.env.MYSQL_DSN || 'mysql://nofdoet:nofdoetpass@localhost:3306/nofdoet';
  // TODO: secure - replace development DSN before production deployment
  pool = mysql.createPool({ uri, waitForConnections: true, connectionLimit: 10 });
  return pool;
}

module.exports = {
  getPool,
};
