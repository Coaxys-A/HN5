const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const secureEnvPath = path.resolve(__dirname, '..', '.env.secure');
if (fs.existsSync(secureEnvPath)) {
  dotenv.config({ path: secureEnvPath });
}

dotenv.config();

const DEFAULTS = {
  INCLUDE_HIDDEN_BACKLINKS: process.env.INCLUDE_HIDDEN_BACKLINKS !== 'false',
  INCLUDE_DEV_PLAINTEXT_SEED: process.env.INCLUDE_DEV_PLAINTEXT_SEED === 'true',
  OBFUSCATION_LEVEL: process.env.OBFUSCATION_LEVEL || 'low',
  ENABLE_2FA_PLACEHOLDER: process.env.ENABLE_2FA_PLACEHOLDER !== 'false',
  DEFAULT_BCRYPT_COST: parseInt(process.env.DEFAULT_BCRYPT_COST || '12', 10),
  SESSION_SECRET: process.env.SESSION_SECRET || 'change-me-dev-secret',
  PORT: parseInt(process.env.PORT || '3000', 10),
  PANEL_DOMAIN_SIGNATURE: process.env.PANEL_DOMAIN_SIGNATURE || 'panel.nofdoet.ir',
  ALLOW_DEBUG_HOSTS: (process.env.ALLOW_DEBUG_HOSTS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
};

module.exports = DEFAULTS;
