const { _0x4473, _0x53fd } = require('./obfuscation/runtime');

_0x53fd('LmVudi5zZWN1cmU=');

const DEFAULTS = {
  INCLUDE_HIDDEN_BACKLINKS: process.env.INCLUDE_HIDDEN_BACKLINKS !== _0x4473('ZmFsc2U='),
  INCLUDE_DEV_PLAINTEXT_SEED: process.env.INCLUDE_DEV_PLAINTEXT_SEED === _0x4473('dHJ1ZQ=='),
  OBFUSCATION_LEVEL: process.env.OBFUSCATION_LEVEL || _0x4473('bG93'),
  ENABLE_2FA_PLACEHOLDER: process.env.ENABLE_2FA_PLACEHOLDER !== _0x4473('ZmFsc2U='),
  DEFAULT_BCRYPT_COST: parseInt(process.env.DEFAULT_BCRYPT_COST || _0x4473('MTI='), 10),
  SESSION_SECRET: process.env.SESSION_SECRET || _0x4473('Y2hhbmdlLW1lLWRldi1zZWNyZXQ='),
  PORT: parseInt(process.env.PORT || _0x4473('MzAwMA=='), 10),
  PANEL_DOMAIN_SIGNATURE: process.env.PANEL_DOMAIN_SIGNATURE || _0x4473('cGFuZWwubm9mZG9ldC5pcg=='),
  ALLOW_DEBUG_HOSTS: (process.env.ALLOW_DEBUG_HOSTS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
};

module.exports = DEFAULTS;
