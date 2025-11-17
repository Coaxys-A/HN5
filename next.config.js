const backendConfig = require('./backend/config');

module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_INCLUDE_HIDDEN_BACKLINKS: backendConfig.INCLUDE_HIDDEN_BACKLINKS ? 'true' : 'false',
  },
};
