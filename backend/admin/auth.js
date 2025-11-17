const bcrypt = require('bcrypt');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { getPool } = require('../db');
const config = require('../config');
const { hasVerifiedTotp, verifyExistingTotpToken } = require('./totp');

const loginLimiter = new RateLimiterMemory({ points: 5, duration: 900 });
const blockLimiter = new RateLimiterMemory({ points: 10, duration: 900 });

const QUERIES = {
  userByUsername:
    'SELECT users.*, roles.name AS role_name FROM users JOIN roles ON roles.id = users.role_id WHERE username = ?',
  insertAudit: 'INSERT INTO audit_logs (user_id, ip, action, details) VALUES (?, INET6_ATON(?), ?, ?)',
};

const ERROR_CODES = {
  tooManyAttempts: 'too_many_attempts',
  accountLocked: 'account_locked',
  invalidCredentials: 'invalid_credentials',
  authenticationRequired: 'authentication_required',
  forbidden: 'forbidden',
  twoFactorRequired: 'two_factor_required',
  invalidTwoFactor: 'invalid_two_factor',
};

async function fetchUserByUsername(username) {
  const pool = getPool();
  const [rows] = await pool.query(QUERIES.userByUsername, [username]);
  return rows[0];
}

async function registerLoginAttempt(ip, username) {
  const key = `${ip}:${username}`;
  await loginLimiter.consume(key).catch(() => {
    throw new Error(ERROR_CODES.tooManyAttempts);
  });
  await blockLimiter.consume(username).catch(() => {
    throw new Error(ERROR_CODES.accountLocked);
  });
}

async function resetAttempts(username, ip) {
  await loginLimiter.delete(`${ip}:${username}`);
  await blockLimiter.delete(username);
}

async function login(credentials, req) {
  const { username, password, twoFactorToken } = credentials;
  const { ip } = req;
  await registerLoginAttempt(ip, username);
  const user = await fetchUserByUsername(username);
  if (!user) {
    throw new Error(ERROR_CODES.invalidCredentials);
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error(ERROR_CODES.invalidCredentials);
  }

  const requiresTwoFactor = config.ENABLE_2FA && user.role_name === 'absolute_developer';
  let twoFactorEnrolled = false;
  if (requiresTwoFactor) {
    twoFactorEnrolled = await hasVerifiedTotp(user.id);
    if (twoFactorEnrolled) {
      if (!twoFactorToken) {
        throw new Error(ERROR_CODES.twoFactorRequired);
      }
      const validToken = await verifyExistingTotpToken(user.id, twoFactorToken);
      if (!validToken) {
        throw new Error(ERROR_CODES.invalidTwoFactor);
      }
    }
  }

  await resetAttempts(username, ip);
  const sessionUser = {
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    role_id: user.role_id,
    role: user.role_name,
  };
  req.session.user = sessionUser;
  return {
    user: sessionUser,
    security: {
      twoFactorEnforced: Boolean(requiresTwoFactor && twoFactorEnrolled),
      twoFactorEnrollmentRequired: Boolean(requiresTwoFactor && !twoFactorEnrolled),
    },
  };
}

function logout(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
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
  return res.status(401).json({ error: ERROR_CODES.authenticationRequired });
}

function requireRole(roles) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: ERROR_CODES.authenticationRequired });
    }
    if (!allowedRoles.includes(req.session.user.role)) {
      return res.status(403).json({ error: ERROR_CODES.forbidden });
    }
    return next();
  };
}

async function recordAudit(userId, ip, action, details) {
  const pool = getPool();
  await pool.query(QUERIES.insertAudit, [
    userId || null,
    ip || null,
    action,
    JSON.stringify(details || {}),
  ]);
}

module.exports = {
  login,
  logout,
  ensureAuthenticated,
  requireRole,
  recordAudit,
  config,
  ERROR_CODES,
};
