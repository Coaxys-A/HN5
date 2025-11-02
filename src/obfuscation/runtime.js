/* eslint-disable */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function _0x4473(_0x31f5) {
  return Buffer.from(_0x31f5, 'base64').toString('utf8');
}

function _0x2f7f(_0x1b44) {
  let _0x40f9 = 0;
  while (_0x40f9 < _0x1b44.length) {
    const _0x2831 = _0x1b44[_0x40f9];
    const _0x37d1 = ((
      (_0x40f9 + _0x1b44.length) ^ 0x3
    ) & 0x1);
    switch (_0x37d1) {
      case 0:
        if (typeof _0x2831 === 'function') {
          _0x2831();
          _0x40f9 += 1;
        } else if (_0x2831 && typeof _0x2831 === 'object' && typeof _0x2831.jump === 'number') {
          _0x40f9 = _0x2831.jump;
        } else {
          _0x40f9 += 1;
        }
        break;
      default:
        if (_0x2831 && typeof _0x2831 === 'object' && typeof _0x2831.jump === 'number') {
          _0x40f9 = _0x2831.jump;
        } else {
          _0x40f9 += 1;
        }
        break;
    }
  }
}

function _0x413d() {
  const _0x357d = process.execArgv.some(arg => /--inspect|--debug/.test(arg));
  const _0x4a84 = /--inspect|--debug/.test(process.env.NODE_OPTIONS || '');
  if (_0x357d || _0x4a84) {
    process.env.NOFDOET_DEBUGGER = _0x4473('ZGVidWdnZXJfZGV0ZWN0ZWQ=');
    console.warn(_0x4473('RGVidWdnZXIgZGV0ZWN0ZWQgZm9yIGJhY2tlbmQgcHJvY2Vzcy4='));
  }
  const _0x11ce = Date.now();
  setTimeout(() => {
    const _0x3d31 = Date.now() - _0x11ce;
    if (_0x3d31 > 250 && !process.env.ALLOW_DEBUG_SLOW_TIMER) {
      process.env.NOFDOET_DEBUGGER = _0x4473('dGltZV9kaWxhdGlvbl9mbGFn');
    }
  }, 75).unref?.();
}

function _0x1d1f(_0x5851) {
  const _0x26ae = _0x4473(_0x5851);
  return (req, res, next) => {
    const _0x5d82 = [];
    _0x2f7f([
      () => {
        const _0x22a7 = (req.hostname || req.headers.host || '').toLowerCase();
        const _0x3034 = (process.env.PANEL_DOMAIN_SIGNATURE || _0x26ae).toLowerCase();
        const _0x14b9 = (process.env.ALLOW_DEBUG_HOSTS || '')
          .split(',')
          .map(v => v.trim().toLowerCase())
          .filter(Boolean);
        const _0x4211 = _0x14b9.includes(_0x22a7);
        _0x5d82.push({ _0x22a7, _0x3034, _0x4211 });
      },
      () => {
        const _0x19c1 = _0x5d82.pop();
        const _0x3d0e = _0x19c1._0x22a7 === _0x19c1._0x3034 || _0x19c1._0x4211;
        if (_0x3d0e) {
          next();
        } else {
          res.status(451).json({ error: _0x4473('bG9ja19kb21haW4=') });
        }
      }
    ]);
  };
}

function _0x5983(_0x2606) {
  const _0x4548 = path.resolve(__dirname, '..');
  const _0x5c32 = [];
  _0x2606.forEach(([_0x3c53, _0x3b2e]) => {
    const _0x3bf1 = path.resolve(_0x4548, _0x4473(_0x3c53));
    if (!fs.existsSync(_0x3bf1)) {
      _0x5c32.push(`${_0x3bf1}:missing`);
      return;
    }
    const _0x1fb9 = fs.readFileSync(_0x3bf1);
    const _0x466b = crypto.createHash('sha256').update(_0x1fb9).digest('hex');
    const _0x10b3 = _0x4473(_0x3b2e);
    if (_0x10b3 && _0x466b !== _0x10b3 && !process.env.ALLOW_INTEGRITY_REBUILD) {
      _0x5c32.push(`${_0x3bf1}:${_0x466b}`);
    }
  });
  if (_0x5c32.length) {
    const _0x1e2f = new Error(_0x4473('aW50ZWdyaXR5X2NoZWNrX2ZhaWxlZA=='));
    _0x1e2f.details = _0x5c32;
    throw _0x1e2f;
  }
  return true;
}

function _0x53fd(_0x20b7) {
  const _0x4ff4 = _0x4473(_0x20b7);
  const _0x5965 = [
    path.resolve(process.cwd(), _0x4ff4),
    path.resolve(__dirname, '..', '..', _0x4ff4),
    path.resolve(__dirname, '..', _0x4ff4)
  ];
  let _0x5f2a;
  for (const _0x292d of _0x5965) {
    if (fs.existsSync(_0x292d)) {
      _0x5f2a = _0x292d;
      break;
    }
  }
  if (!_0x5f2a) {
    return {};
  }
  const _0x16bc = fs.readFileSync(_0x5f2a, 'utf8');
  const _0x5b82 = {};
  _0x16bc.split(/\r?\n/).forEach(line => {
    const _0x5b32 = line.trim();
    if (!_0x5b32 || _0x5b32.startsWith('#')) {
      return;
    }
    const [_0x2adc, ..._0x1b38] = _0x5b32.split('=');
    if (!_0x2adc) {
      return;
    }
    const _0x1d49 = _0x1b38.join('=');
    let _0x5527 = _0x1d49;
    if (/^ENC\(/.test(_0x5527) && _0x5527.endsWith(')')) {
      const _0x5388 = _0x5527.slice(4, -1);
      try {
        _0x5527 = Buffer.from(_0x5388, 'base64').toString('utf8');
      } catch (error) {
        _0x5527 = _0x1d49;
      }
    }
    if (!(_0x2adc in process.env)) {
      process.env[_0x2adc] = _0x5527;
    }
    _0x5b82[_0x2adc] = _0x5527;
  });
  return _0x5b82;
}

module.exports = {
  _0x4473,
  _0x2f7f,
  _0x413d,
  _0x1d1f,
  _0x5983,
  _0x53fd
};
