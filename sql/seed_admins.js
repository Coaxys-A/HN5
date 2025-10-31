#!/usr/bin/env node
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const BCRYPT_COST = parseInt(process.env.BCRYPT_COST || '12', 10);

async function seed() {
  const dsn = process.env.MYSQL_DSN || 'mysql://nofdoet:nofdoetpass@localhost:3306/nofdoet';
  const pool = mysql.createPool({ uri: dsn, waitForConnections: true, connectionLimit: 5 });
  const conn = await pool.getConnection();
  try {
    await conn.query("INSERT IGNORE INTO roles (name, permissions) VALUES ('absolute_developer', JSON_ARRAY()), ('school_team', JSON_ARRAY()), ('developer_team', JSON_ARRAY())");
    const [rows] = await conn.query('SELECT id, name FROM roles');
    const roles = Object.fromEntries(rows.map(r => [r.name, r.id]));

    const devPass = process.env.DEV_ADMIN_PASS;
    let adminPassword;
    if (devPass) {
      adminPassword = devPass;
      console.log('Using DEV_ADMIN_PASS from environment (do not commit this).');
    } else {
      adminPassword = crypto.randomBytes(12).toString('base64').replace(/[^a-zA-Z0-9]/g, 'A').slice(0, 20);
      console.log('Generated development admin password (store securely):', adminPassword);
    }

    const adminHash = await bcrypt.hash(adminPassword, BCRYPT_COST);
    await conn.query(
      'INSERT INTO users (username, display_name, password_hash, role_id) VALUES (?, ?, ?, ?)\n       ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), role_id = VALUES(role_id)',
      ['Coaxys', 'آرسام صباغ', adminHash, roles['absolute_developer']]
    );

    async function createUser(username, displayName, roleKey) {
      const password = crypto.randomBytes(10).toString('base64').replace(/[^a-zA-Z0-9]/g, 'B').slice(0, 16);
      const hash = await bcrypt.hash(password, BCRYPT_COST);
      await conn.query(
        'INSERT INTO users (username, display_name, password_hash, role_id) VALUES (?, ?, ?, ?)\n         ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), role_id = VALUES(role_id)',
        [username, displayName, hash, roles[roleKey]]
      );
      console.log(`${username} password (development only, rotate immediately):`, password);
    }

    await createUser('school_team_1', 'School Team User', 'school_team');
    await createUser('dev_team_1', 'Developer Team User', 'developer_team');
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
