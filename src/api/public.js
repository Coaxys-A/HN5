const express = require('express');
const { getPool } = require('../db');

const router = express.Router();

router.get('/programs', async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT title, description, visible FROM programs WHERE visible = 1 ORDER BY created_at DESC');
  res.json(rows);
});

router.get('/articles', async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT slug, title, excerpt, read_more_url, published_at FROM articles ORDER BY published_at DESC LIMIT 10');
  res.json(rows);
});

module.exports = router;
