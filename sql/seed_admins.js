#!/usr/bin/env node
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const config = require('../backend/config');

const BCRYPT_COST = parseInt(process.env.BCRYPT_COST || String(config.DEFAULT_BCRYPT_COST), 10);
const IS_PRODUCTION = config.IS_PRODUCTION;

async function createOrUpdateUser(conn, roles, username, displayName, roleKey, password) {
  const hash = await bcrypt.hash(password, BCRYPT_COST);
  await conn.query(
    `INSERT INTO users (username, display_name, password_hash, role_id)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), role_id = VALUES(role_id), password_hash = VALUES(password_hash)`,
    [username, displayName, hash, roles[roleKey]],
  );
}

function generatePassword() {
  return crypto.randomBytes(16).toString('base64').replace(/[^a-zA-Z0-9]/g, 'A').slice(0, 24);
}

function resolveAdminPassword() {
  if (process.env.DEV_ADMIN_PASS && process.env.DEV_ADMIN_PASS.trim()) {
    return { password: process.env.DEV_ADMIN_PASS.trim(), fromEnv: true };
  }
  if (IS_PRODUCTION) {
    throw new Error('DEV_ADMIN_PASS must be set explicitly when NODE_ENV=production.');
  }
  return { password: generatePassword(), fromEnv: false };
}

async function seed() {
  const pool = mysql.createPool({ uri: config.MYSQL_DSN, waitForConnections: true, connectionLimit: 5 });
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "INSERT IGNORE INTO roles (name, permissions) VALUES ('absolute_developer', JSON_ARRAY()), ('school_team', JSON_ARRAY()), ('developer_team', JSON_ARRAY())",
    );
    const [rows] = await conn.query('SELECT id, name FROM roles');
    const roles = Object.fromEntries(rows.map((role) => [role.name, role.id]));

    const adminPassword = resolveAdminPassword();
    await createOrUpdateUser(conn, roles, 'Coaxys', 'آرسام صباغ', 'absolute_developer', adminPassword.password);
    console.log(
      `${adminPassword.fromEnv ? 'Using DEV_ADMIN_PASS for' : 'Generated DEVELOPMENT ONLY password for'} Coaxys: ${adminPassword.password}`,
    );

    const schoolPassword = generatePassword();
    await createOrUpdateUser(conn, roles, 'school_team_1', 'School Team User', 'school_team', schoolPassword);
    console.log('DEVELOPMENT ONLY password for school_team_1:', schoolPassword);

    const developerPassword = generatePassword();
    await createOrUpdateUser(conn, roles, 'dev_team_1', 'Developer Team User', 'developer_team', developerPassword);
    console.log('DEVELOPMENT ONLY password for dev_team_1:', developerPassword);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
