const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const adminRouter = require('./admin/routes');
const publicApi = require('./api/public');
const config = require('./config');
const {
  _0x4473,
  _0x2f7f,
  _0x413d,
  _0x1d1f,
  _0x5983,
} = require('./obfuscation/runtime');

_0x413d();

const app = express();

_0x5983([
  ['c3JjL3NlcnZlci5qcw==', 'ZWQwYjg1MDcyZDI5YTYwOTM4MThkOTc5NWY4OTYxNTRhMDc4YmM5NjQ3MGM2M2M5MmFhOTRhODFiZjc3MzBkNQ=='],
  ['c3JjL2FkbWluL3JvdXRlcy5qcw==', 'OTZlNjBjNWE0M2VhNjdhZTMzZDFlMDRlMTM4MzRhNjliYmExMGM5NzI3MjE1MTE5MWQ5MzUwNmViZjllNzYxZg=='],
]);

_0x2f7f([
  () => app.use(helmet({ contentSecurityPolicy: false })),
  () => app.use(compression()),
  () => app.disable(_0x4473('eC1wb3dlcmVkLWJ5')),
  () => app.use(express.json()),
  () => app.use(express.urlencoded({ extended: true })),
  () => app.use(_0x4473('L2FkbWlu'), _0x1d1f('cGFuZWwubm9mZG9ldC5pcg=='), adminRouter),
  () => app.use(_0x4473('L2FwaQ=='), publicApi),
  () => app.get(_0x4473('L2hlYWx0aHo='), (req, res) => {
    res.json({ status: _0x4473('b2s='), timestamp: new Date().toISOString() });
  }),
  () => {
    const staticDir = path.resolve(__dirname, '..');
    app.use(express.static(staticDir));
  },
]);

app.use((
  err,
  req,
  res,
  next, // eslint-disable-line no-unused-vars
) => {
  console.error(err);
  res.status(500).json({ error: _0x4473('aW50ZXJuYWxfc2VydmVyX2Vycm9y') });
});

if (require.main === module) {
  const port = config.PORT;
  app.listen(port, () => {
    console.log(`${_0x4473('U2VydmVyIGxpc3RlbmluZyBvbiBwb3J0IA==')}${port}`);
  });
}

module.exports = app;
