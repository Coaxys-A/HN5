#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { _0x4473, _0x2f7f } = require('./src/obfuscation/runtime');

const args = process.argv.slice(2);
const options = { deep: false, domain: '', seed: `${Date.now()}` };

args.forEach(arg => {
  if (arg === '--deep') {
    options.deep = true;
  } else if (arg.startsWith('--domain=')) {
    options.domain = arg.split('=')[1];
  } else if (arg.startsWith('--seed=')) {
    options.seed = arg.split('=')[1];
  }
});

if (!options.domain) {
  options.domain = process.env.PANEL_DOMAIN_SIGNATURE || _0x4473('cGFuZWwubm9mZG9ldC5pcg==');
}

const outputDir = path.resolve(__dirname, _0x4473('ZGlzdC1vYmY='));

const manifest = {
  domain: options.domain,
  seed: options.seed,
  generatedAt: new Date().toISOString(),
  signature: crypto.createHash('sha256').update(`${options.domain}:${options.seed}`).digest('hex')
};

_0x2f7f([
  () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  },
  () => {
    const payload = JSON.stringify(manifest, null, options.deep ? 0 : 2);
    fs.writeFileSync(path.join(outputDir, _0x4473('bWFuaWZlc3QuanNvbg==')), payload, 'utf8');
  }
]);

console.log(`${_0x4473('W29iZnVzY2F0ZV0gTWFuaWZlc3QgZ2VuZXJhdGVkIGluIA==')}${outputDir}`);
