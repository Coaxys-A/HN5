const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { getPool } = require('../db');

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS user_totp_secrets (
    user_id BIGINT PRIMARY KEY,
    secret VARCHAR(255) NOT NULL DEFAULT '',
    pending_secret VARCHAR(255) NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_totp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

let ensured = false;

async function ensureTable() {
  if (ensured) return;
  const pool = getPool();
  await pool.query(CREATE_TABLE_SQL);
  ensured = true;
}

async function getRecord(userId) {
  await ensureTable();
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT user_id, secret, pending_secret, verified_at FROM user_totp_secrets WHERE user_id = ?',
    [userId],
  );
  return rows[0];
}

async function hasVerifiedTotp(userId) {
  const record = await getRecord(userId);
  return Boolean(record && record.secret && record.verified_at);
}

function verifyToken(secret, token) {
  if (!secret || !token) return false;
  return speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });
}

async function verifyExistingTotpToken(userId, token) {
  const record = await getRecord(userId);
  if (!record || !record.secret || !record.verified_at) return false;
  return verifyToken(record.secret, token);
}

async function createSetupSecret(user) {
  await ensureTable();
  const pool = getPool();
  const secret = speakeasy.generateSecret({
    length: 20,
    name: `HN5 (${user.display_name || user.username})`,
  });
  await pool.query(
    `INSERT INTO user_totp_secrets (user_id, secret, pending_secret, verified_at)
     VALUES (?, '', ?, NULL)
     ON DUPLICATE KEY UPDATE pending_secret = VALUES(pending_secret), verified_at = NULL`,
    [user.id, secret.base32],
  );
  const qrCode = await QRCode.toDataURL(secret.otpauth_url);
  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
    qrCode,
  };
}

async function verifySetupToken(userId, token) {
  const record = await getRecord(userId);
  if (!record || !record.pending_secret) return false;
  if (!verifyToken(record.pending_secret, token)) return false;
  const pool = getPool();
  await pool.query(
    `INSERT INTO user_totp_secrets (user_id, secret, pending_secret, verified_at)
     VALUES (?, ?, NULL, NOW())
     ON DUPLICATE KEY UPDATE secret = VALUES(secret), pending_secret = NULL, verified_at = NOW()`,
    [userId, record.pending_secret],
  );
  return true;
}

module.exports = {
  hasVerifiedTotp,
  verifyExistingTotpToken,
  createSetupSecret,
  verifySetupToken,
};
