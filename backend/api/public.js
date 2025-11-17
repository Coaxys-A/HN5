const express = require('express');
const { getPool } = require('../db');

const router = express.Router();

const PUBLIC_STATUSES = ['visible', 'incoming', 'coming_soon', 'preparing'];

function normalizeStatus(value) {
  if (!value) return 'visible';
  return PUBLIC_STATUSES.includes(value) ? value : 'visible';
}

function buildStatusPayload(rows) {
  const normalized = rows.map((row) => ({ ...row, status: normalizeStatus(row.status) }));
  const grouped = PUBLIC_STATUSES.reduce((acc, status) => ({ ...acc, [status]: [] }), {});
  normalized.forEach((row) => {
    grouped[row.status].push(row);
  });
  return {
    items: normalized,
    byStatus: grouped,
    metadata: {
      counts: PUBLIC_STATUSES.reduce(
        (acc, status) => ({
          ...acc,
          [status]: grouped[status].length,
        }),
        {},
      ),
    },
  };
}

router.get('/programs', async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT title, description, visible, status FROM programs WHERE status <> 'hidden' AND visible = 1 ORDER BY created_at DESC",
  );
  res.json(buildStatusPayload(rows));
});

router.get('/articles', async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT slug, title, excerpt, read_more_url, published_at, status FROM articles WHERE status <> 'hidden' ORDER BY published_at DESC, created_at DESC LIMIT 10",
  );
  res.json(buildStatusPayload(rows));
});

module.exports = router;
