const bcrypt = require('bcrypt');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { getPool } = require('../db');
const config = require('../config');

const loginLimiter = new RateLimiterMemory({ points: 5, duration: 900 });
const blockLimiter = new RateLimiterMemory({ points: 10, duration: 900 });

async function fetchUserByUsername(username) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT users.*, roles.name AS role_name FROM users JOIN roles ON roles.id = users.role_id WHERE username = ?', [username]);
  return rows[0];
}

async function registerLoginAttempt(ip, username) {
  const key = `${ip}:${username}`;
  await loginLimiter.consume(key).catch(() => {
    throw new Error('too_many_attempts');
  });
  await blockLimiter.consume(username).catch(() => {
    throw new Error('account_locked');
  });
}

async function resetAttempts(username, ip) {
  await loginLimiter.delete(`${ip}:${username}`);
  await blockLimiter.delete(username);
}

async function login({ username, password }, req) {
  const ip = req.ip;
  await registerLoginAttempt(ip, username);
  const user = await fetchUserByUsername(username);
  if (!user) {
    throw new Error('invalid_credentials');
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error('invalid_credentials');
  }
  await resetAttempts(username, ip);
  req.session.user = {
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    role_id: user.role_id,
    role: user.role_name
  };
  return req.session.user;
}

function logout(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    res.locals.currentUser = req.session.user;
    return next();
  }
  return res.status(401).json({ error: 'authentication_required' });
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: 'authentication_required' });
    }
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!allowed.includes(req.session.user.role)) {
      return res.status(403).json({ error: 'forbidden' });
    }
    return next();
  };
}

async function recordAudit(userId, ip, action, details) {
  const pool = getPool();
  await pool.query(
    'INSERT INTO audit_logs (user_id, ip, action, details) VALUES (?, INET6_ATON(?), ?, ?)',
    [userId || null, ip || null, action, JSON.stringify(details || {})]
  );
}

module.exports = {
  login,
  logout,
  ensureAuthenticated,
  requireRole,
  recordAudit,
  config
};
