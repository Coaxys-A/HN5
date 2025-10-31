const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const adminRouter = require('./admin/routes');
const publicApi = require('./api/public');
const config = require('./config');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/admin', adminRouter);
app.use('/api', publicApi);

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const staticDir = path.resolve(__dirname, '..');
app.use(express.static(staticDir));

app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ error: 'internal_server_error' });
});

if (require.main === module) {
  const port = config.PORT;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
