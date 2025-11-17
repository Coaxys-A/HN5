const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const secureEnvPath = path.resolve(__dirname, '..', '.env.secure');
if (fs.existsSync(secureEnvPath)) {
  dotenv.config({ path: secureEnvPath });
}

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

function parseBoolean(value, defaultValue = false) {
  if (value === undefined) return defaultValue;
  if (typeof value === 'boolean') return value;
  return value !== 'false' && value !== '0' && value !== '';
}

function parseNumber(value, defaultValue) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

const DEV_DEFAULT_DSN = 'mysql://nofdoet:nofdoetpass@localhost:3306/nofdoet';
if (IS_PRODUCTION && !process.env.MYSQL_DSN) {
  throw new Error('MYSQL_DSN must be provided in production environments.');
}

const sessionSecret = process.env.SESSION_SECRET || 'change-me-dev-secret';
if (IS_PRODUCTION && (!process.env.SESSION_SECRET || sessionSecret === 'change-me-dev-secret')) {
  throw new Error('SESSION_SECRET must be configured with a secure value in production.');
}

const config = {
  NODE_ENV,
  IS_PRODUCTION,
  PORT: parseNumber(process.env.PORT, 3000),
  MYSQL_DSN: process.env.MYSQL_DSN || DEV_DEFAULT_DSN,
  DB_CONNECTION_LIMIT: parseNumber(process.env.DB_CONNECTION_LIMIT, 10),
  SESSION_SECRET: sessionSecret,
  DEFAULT_BCRYPT_COST: parseNumber(process.env.DEFAULT_BCRYPT_COST, 12),
  INCLUDE_HIDDEN_BACKLINKS: parseBoolean(process.env.INCLUDE_HIDDEN_BACKLINKS, true),
  INCLUDE_DEV_PLAINTEXT_SEED: parseBoolean(process.env.INCLUDE_DEV_PLAINTEXT_SEED, false),
  ENABLE_2FA: parseBoolean(process.env.ENABLE_2FA, false),
  OBFUSCATION_LEVEL: process.env.OBFUSCATION_LEVEL || 'none',
  PANEL_DOMAIN_SIGNATURE: process.env.PANEL_DOMAIN_SIGNATURE || 'panel.nofdoet.ir',
  ALLOW_DEBUG_HOSTS: (process.env.ALLOW_DEBUG_HOSTS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
};

module.exports = config;
