const DEFAULTS = {
  INCLUDE_HIDDEN_BACKLINKS: process.env.INCLUDE_HIDDEN_BACKLINKS !== 'false',
  INCLUDE_DEV_PLAINTEXT_SEED: process.env.INCLUDE_DEV_PLAINTEXT_SEED === 'true',
  OBFUSCATION_LEVEL: process.env.OBFUSCATION_LEVEL || 'low',
  ENABLE_2FA_PLACEHOLDER: process.env.ENABLE_2FA_PLACEHOLDER !== 'false',
  DEFAULT_BCRYPT_COST: parseInt(process.env.DEFAULT_BCRYPT_COST || '12', 10),
  SESSION_SECRET: process.env.SESSION_SECRET || 'change-me-dev-secret',
  PORT: parseInt(process.env.PORT || '3000', 10)
};

module.exports = DEFAULTS;
