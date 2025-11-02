/* eslint-disable */
const bcrypt = require('bcrypt');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { getPool } = require('../db');
const config = require('../config');
const { _0x4473, _0x2f7f } = require('../obfuscation/runtime');

const loginLimiter = new RateLimiterMemory({ points: 5, duration: 900 });
const blockLimiter = new RateLimiterMemory({ points: 10, duration: 900 });

const _0x3f0e = {
  queryUser: _0x4473('U0VMRUNUIHVzZXJzLiosIHJvbGVzLm5hbWUgQVMgcm9sZV9uYW1lIEZST00gdXNlcnMgSk9JTiByb2xlcyBPTiByb2xlcy5pZCA9IHVzZXJzLnJvbGVfaWQgV0hFUkUgdXNlcm5hbWUgPSA/'),
  tooMany: _0x4473('dG9vX21hbnlfYXR0ZW1wdHM='),
  accountLocked: _0x4473('YWNjb3VudF9sb2NrZWQ='),
  invalidCreds: _0x4473('aW52YWxpZF9jcmVkZW50aWFscw=='),
  authRequired: _0x4473('YXV0aGVudGljYXRpb25fcmVxdWlyZWQ='),
  forbidden: _0x4473('Zm9yYmlkZGVu'),
  auditInsert: _0x4473('SU5TRVJUIElOVE8gYXVkaXRfbG9ncyAodXNlcl9pZCwgaXAsIGFjdGlvbiwgZGV0YWlscykgVkFMVUVTICg/LCBJTkVUNl9BVE9OKD8pLCA/LCA/KQ=='),
  sessionKey: _0x4473('Y3VycmVudFVzZXI=')
};

async function fetchUserByUsername(username) {
  const pool = getPool();
  const [rows] = await pool.query(_0x3f0e.queryUser, [username]);
  return rows[0];
}

async function registerLoginAttempt(ip, username) {
  const key = `${ip}:${username}`;
  await loginLimiter.consume(key).catch(() => {
    throw new Error(_0x3f0e.tooMany);
  });
  await blockLimiter.consume(username).catch(() => {
    throw new Error(_0x3f0e.accountLocked);
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
    throw new Error(_0x3f0e.invalidCreds);
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error(_0x3f0e.invalidCreds);
  }
  await resetAttempts(username, ip);
  const sessionAssembler = [];
  _0x2f7f([
    () => {
      sessionAssembler.push({
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        role_id: user.role_id,
        role: user.role_name
      });
    },
    () => {
      req.session.user = sessionAssembler[0];
    }
  ]);
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
    res.locals[_0x3f0e.sessionKey] = req.session.user;
    return next();
  }
  return res.status(401).json({ error: _0x3f0e.authRequired });
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: _0x3f0e.authRequired });
    }
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!allowed.includes(req.session.user.role)) {
      return res.status(403).json({ error: _0x3f0e.forbidden });
    }
    return next();
  };
}

async function recordAudit(userId, ip, action, details) {
  const pool = getPool();
  await pool.query(
    _0x3f0e.auditInsert,
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
