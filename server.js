const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const next = require('next');
const adminRouter = require('./backend/admin/routes');
const publicApi = require('./backend/api/public');
const config = require('./backend/config');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: __dirname });
const handle = nextApp.getRequestHandler();

async function createServer() {
  await nextApp.prepare();
  const server = express();

  server.use(helmet({ contentSecurityPolicy: false }));
  server.use(compression());
  server.disable('x-powered-by');
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.use('/admin', adminRouter);
  server.use('/api', publicApi);

  server.get('/healthz', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  server.all('*', (req, res) => handle(req, res));

  server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error(err);
    res.status(500).json({ error: 'internal_server_error' });
  });

  server.listen(config.PORT, () => {
    console.log(`Server ready on port ${config.PORT}`);
  });

  return server;
}

if (require.main === module) {
  createServer().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
}

module.exports = createServer;
