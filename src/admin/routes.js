const express = require('express');
const csrf = require('csurf');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');
const multer = require('multer');
const sanitizeHtml = require('sanitize-html');
const { body, validationResult, query } = require('express-validator');
const { v4: uuid } = require('uuid');
const { getPool } = require('../db');
const config = require('../config');
const {
  login,
  logout,
  ensureAuthenticated,
  recordAudit,
  requireRole
} = require('./auth');

const router = express.Router();
const csrfProtection = csrf({ cookie: false });

const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const allowContentAccess = requireRole(['absolute_developer', 'developer_team', 'school_team']);
const allowDeveloperTeam = requireRole(['absolute_developer', 'developer_team']);
const allowSuperAdmin = requireRole(['absolute_developer']);

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
}

function sanitizeRichText(value) {
  if (!value) return '';
  return sanitizeHtml(value, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption', 'h1', 'h2', 'h3']),
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'loading'],
      '*': ['class']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {}
  });
}

function sanitizePlainText(value) {
  if (!value) return null;
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

function parseJson(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function createSessionMiddleware() {
  const options = {
    name: 'nofdoet.sid',
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }
  };
  if (process.env.REDIS_URL) {
    const client = new Redis(process.env.REDIS_URL);
    options.store = new RedisStore({ client, prefix: 'nofdoet:' });
  }
  return session(options);
}

router.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"]
    }
  },
  hsts: process.env.NODE_ENV === 'production'
}));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(createSessionMiddleware());

router.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ token: req.csrfToken() });
});

router.post('/login', csrfProtection, async (req, res) => {
  try {
    const user = await login(req.body, req);
    await recordAudit(user.id, req.ip, 'login', { user: user.username });
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/logout', ensureAuthenticated, async (req, res) => {
  await recordAudit(req.session.user.id, req.ip, 'logout', {});
  await logout(req);
  res.json({ success: true });
});

router.post('/2fa/verify', ensureAuthenticated, csrfProtection, (req, res) => {
  if (!config.ENABLE_2FA_PLACEHOLDER) {
    return res.status(404).json({ error: 'disabled' });
  }
  return res.json({ success: true, placeholder: true });
});

router.get('/session', ensureAuthenticated, (req, res) => {
  res.json({ user: req.session.user });
});

router.get(
  '/audit',
  ensureAuthenticated,
  allowDeveloperTeam,
  [
    query('limit').optional().isInt({ min: 1, max: 500 }).toInt(),
    query('user_id').optional().isInt({ min: 1 }).toInt(),
    query('action').optional({ checkFalsy: true }).trim().isLength({ max: 128 })
  ],
  handleValidation,
  async (req, res) => {
    const pool = getPool();
    const { limit = 100, user_id: userId, action } = req.query;
    const conditions = [];
    const params = [];
    if (userId) {
      conditions.push('user_id = ?');
      params.push(userId);
    }
    if (action) {
      conditions.push('action = ?');
      params.push(action);
    }
    let sql = 'SELECT id, ts, user_id, INET6_NTOA(ip) AS ip, action, details FROM audit_logs';
    if (conditions.length) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    sql += ' ORDER BY ts DESC LIMIT ?';
    params.push(limit);
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  }
);

const staffValidators = [
  body('id').optional().isInt({ min: 1 }).toInt(),
  body('name').trim().notEmpty().isLength({ max: 255 }),
  body('title').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body('bio_short').optional({ checkFalsy: true }).isLength({ max: 2000 }),
  body('bio_long').optional({ checkFalsy: true }).isString(),
  body('photo_path').optional({ checkFalsy: true }).trim().isLength({ max: 1024 }),
  body('social').optional().custom(value => {
    if (typeof value === 'string') {
      JSON.parse(value);
      return true;
    }
    if (Array.isArray(value)) return true;
    throw new Error('social must be an array or JSON string');
  }),
  body('sort_order').optional().isInt({ min: 0, max: 9999 }).toInt()
];

const teacherValidators = [
  body('id').optional().isInt({ min: 1 }).toInt(),
  body('name').trim().notEmpty().isLength({ max: 255 }),
  body('subject').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body('bio').optional({ checkFalsy: true }).isString(),
  body('photo_path').optional({ checkFalsy: true }).trim().isLength({ max: 1024 }),
  body('sort_order').optional().isInt({ min: 0, max: 9999 }).toInt(),
  body('active').optional().isBoolean().toBoolean()
];

const classValidators = [
  body('id').optional().isInt({ min: 1 }).toInt(),
  body('title').trim().notEmpty().isLength({ max: 255 }),
  body('slug').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body('schedule').optional().custom(value => {
    if (typeof value === 'string') {
      JSON.parse(value);
      return true;
    }
    if (typeof value === 'object') return true;
    throw new Error('schedule must be object or JSON');
  }),
  body('description').optional({ checkFalsy: true }).isString(),
  body('capacity').optional({ checkFalsy: true }).isInt({ min: 0, max: 9999 }).toInt(),
  body('active').optional().isBoolean().toBoolean()
];

const programValidators = [
  body('id').optional().isInt({ min: 1 }).toInt(),
  body('title').trim().notEmpty().isLength({ max: 255 }),
  body('description').optional({ checkFalsy: true }).isString(),
  body('visible').optional().isBoolean().toBoolean()
];

const articleValidators = [
  body('id').optional().isInt({ min: 1 }).toInt(),
  body('slug').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body('title').trim().notEmpty().isLength({ max: 512 }),
  body('excerpt').optional({ checkFalsy: true }).isString(),
  body('content').optional({ checkFalsy: true }).isString(),
  body('read_more_url').optional({ checkFalsy: true }).isURL({ protocols: ['http', 'https'], require_protocol: true }),
  body('published_at').optional({ checkFalsy: true }).isISO8601(),
  body('tags').optional().custom(value => {
    if (typeof value === 'string') {
      JSON.parse(value);
      return true;
    }
    if (Array.isArray(value)) return true;
    throw new Error('tags must be array or JSON');
  })
];

router.get('/staff', ensureAuthenticated, allowContentAccess, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM staff ORDER BY sort_order, id DESC');
  res.json(rows);
});

router.post(
  '/staff',
  ensureAuthenticated,
  allowContentAccess,
  csrfProtection,
  staffValidators,
  handleValidation,
  async (req, res) => {
    const pool = getPool();
    const payload = req.body;
    const id = payload.id || null;
    const socialRaw = parseJson(payload.social);
    const social = Array.isArray(socialRaw)
      ? socialRaw
        .filter(item => typeof item === 'string' && item.trim())
        .map(item => sanitizePlainText(item) || '')
        .filter(Boolean)
      : [];
    const bioShort = sanitizePlainText(payload.bio_short) || null;
    const bioLong = sanitizeRichText(payload.bio_long || '');
    const name = sanitizePlainText(payload.name);
    const title = sanitizePlainText(payload.title);
    const photoPath = sanitizePlainText(payload.photo_path);
    if (id) {
      await pool.query(
        'UPDATE staff SET name=?, title=?, bio_short=?, bio_long=?, photo_path=?, social=?, sort_order=? WHERE id=?',
        [
          name,
          title,
          bioShort,
          bioLong,
          photoPath,
          JSON.stringify(social),
          payload.sort_order || 0,
          id
        ]
      );
      await recordAudit(req.session.user.id, req.ip, 'staff.update', { id });
    } else {
      const [result] = await pool.query(
        'INSERT INTO staff (name, title, bio_short, bio_long, photo_path, social, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          name,
          title,
          bioShort,
          bioLong,
          photoPath,
          JSON.stringify(social),
          payload.sort_order || 0
        ]
      );
      await recordAudit(req.session.user.id, req.ip, 'staff.create', { id: result.insertId });
    }
    res.json({ success: true });
  }
);

router.get('/teachers', ensureAuthenticated, allowContentAccess, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM teachers ORDER BY sort_order, id DESC');
  res.json(rows);
});

router.post(
  '/teachers',
  ensureAuthenticated,
  allowContentAccess,
  csrfProtection,
  teacherValidators,
  handleValidation,
  async (req, res) => {
    const pool = getPool();
    const payload = req.body;
    const id = payload.id || null;
    const name = sanitizePlainText(payload.name);
    const subject = sanitizePlainText(payload.subject);
    const bio = sanitizeRichText(payload.bio || '');
    const photoPath = sanitizePlainText(payload.photo_path);
    const sortOrder = payload.sort_order || 0;
    const active = payload.active === undefined ? 1 : (payload.active ? 1 : 0);
    if (id) {
      await pool.query(
        'UPDATE teachers SET name=?, subject=?, bio=?, photo_path=?, sort_order=?, active=? WHERE id=?',
        [name, subject, bio, photoPath, sortOrder, active, id]
      );
      await recordAudit(req.session.user.id, req.ip, 'teachers.update', { id });
    } else {
      const [result] = await pool.query(
        'INSERT INTO teachers (name, subject, bio, photo_path, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)',
        [name, subject, bio, photoPath, sortOrder, active]
      );
      await recordAudit(req.session.user.id, req.ip, 'teachers.create', { id: result.insertId });
    }
    res.json({ success: true });
  }
);

router.get('/classes', ensureAuthenticated, allowContentAccess, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM classes ORDER BY created_at DESC');
  res.json(rows);
});

router.post(
  '/classes',
  ensureAuthenticated,
  allowContentAccess,
  csrfProtection,
  classValidators,
  handleValidation,
  async (req, res) => {
    const pool = getPool();
    const payload = req.body;
    const scheduleRaw = parseJson(payload.schedule);
    const schedule = scheduleRaw && typeof scheduleRaw === 'object' ? JSON.stringify(scheduleRaw) : null;
    const description = sanitizeRichText(payload.description || '');
    const title = sanitizePlainText(payload.title);
    const slugSanitized = sanitizePlainText(payload.slug);
    const capacity = typeof payload.capacity === 'number' ? payload.capacity : null;
    const active = payload.active === undefined ? 1 : (payload.active ? 1 : 0);
    if (payload.id) {
      const slugValue = slugSanitized || uuid();
      await pool.query(
        'UPDATE classes SET title=?, slug=?, schedule=?, description=?, capacity=?, active=? WHERE id=?',
        [title, slugValue, schedule, description, capacity, active, payload.id]
      );
      await recordAudit(req.session.user.id, req.ip, 'classes.update', { id: payload.id });
    } else {
      const slugValue = slugSanitized || uuid();
      const [result] = await pool.query(
        'INSERT INTO classes (title, slug, schedule, description, capacity, active) VALUES (?, ?, ?, ?, ?, ?)',
        [title, slugValue, schedule, description, capacity, active]
      );
      await recordAudit(req.session.user.id, req.ip, 'classes.create', { id: result.insertId });
    }
    res.json({ success: true });
  }
);

router.get('/programs', ensureAuthenticated, allowContentAccess, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM programs ORDER BY created_at DESC');
  res.json(rows);
});

router.post(
  '/programs',
  ensureAuthenticated,
  allowContentAccess,
  csrfProtection,
  programValidators,
  handleValidation,
  async (req, res) => {
    const pool = getPool();
    const payload = req.body;
    const title = sanitizePlainText(payload.title);
    const description = sanitizeRichText(payload.description || '');
    const visible = payload.visible === undefined ? 1 : (payload.visible ? 1 : 0);
    if (payload.id) {
      await pool.query(
        'UPDATE programs SET title=?, description=?, visible=? WHERE id=?',
        [title, description, visible, payload.id]
      );
      await recordAudit(req.session.user.id, req.ip, 'programs.update', { id: payload.id });
    } else {
      const [result] = await pool.query(
        'INSERT INTO programs (title, description, visible) VALUES (?, ?, ?)',
        [title, description, visible]
      );
      await recordAudit(req.session.user.id, req.ip, 'programs.create', { id: result.insertId });
    }
    res.json({ success: true });
  }
);

router.get('/articles', ensureAuthenticated, allowContentAccess, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM articles ORDER BY published_at DESC, created_at DESC');
  res.json(rows);
});

router.post(
  '/articles',
  ensureAuthenticated,
  allowContentAccess,
  csrfProtection,
  articleValidators,
  handleValidation,
  async (req, res) => {
    const pool = getPool();
    const payload = req.body;
    const slug = sanitizePlainText(payload.slug);
    const title = sanitizePlainText(payload.title);
    const excerpt = sanitizePlainText(payload.excerpt) || null;
    const content = sanitizeRichText(payload.content || '');
    const readMoreUrl = payload.read_more_url ? payload.read_more_url.trim() : null;
    const publishedAt = payload.published_at || null;
    const tagsRaw = parseJson(payload.tags);
    const tags = Array.isArray(tagsRaw)
      ? tagsRaw
        .filter(tag => typeof tag === 'string' && tag.trim())
        .map(tag => sanitizePlainText(tag) || '')
        .filter(Boolean)
      : [];
    if (payload.id) {
      const slugValue = slug || uuid();
      await pool.query(
        'UPDATE articles SET slug=?, title=?, excerpt=?, content=?, read_more_url=?, published_at=?, tags=? WHERE id=?',
        [slugValue, title, excerpt, content, readMoreUrl, publishedAt, JSON.stringify(tags), payload.id]
      );
      await recordAudit(req.session.user.id, req.ip, 'articles.update', { id: payload.id });
    } else {
      const slugValue = slug || uuid();
      const [result] = await pool.query(
        'INSERT INTO articles (slug, title, excerpt, content, read_more_url, author_id, published_at, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [slugValue, title, excerpt, content, readMoreUrl, req.session.user.id, publishedAt, JSON.stringify(tags)]
      );
      await recordAudit(req.session.user.id, req.ip, 'articles.create', { id: result.insertId });
    }
    res.json({ success: true });
  }
);

router.get('/files', ensureAuthenticated, allowContentAccess, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT id, filename, path, mime, size, created_at FROM files ORDER BY created_at DESC');
  res.json(rows);
});

router.post(
  '/files/upload',
  ensureAuthenticated,
  allowContentAccess,
  csrfProtection,
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'file_required' });
    }
    // Placeholder for AV scanning hook.
    const pool = getPool();
    const originalName = sanitizePlainText(req.file.originalname) || req.file.originalname;
    const relativePath = path.relative(path.resolve(__dirname, '..', '..'), req.file.path).replace(/\\/g, '/');
    const [result] = await pool.query(
      'INSERT INTO files (filename, path, mime, size, uploaded_by) VALUES (?, ?, ?, ?, ?)',
      [originalName, relativePath, req.file.mimetype, req.file.size, req.session.user.id]
    );
    await recordAudit(req.session.user.id, req.ip, 'files.upload', { id: result.insertId, filename: originalName });
    res.json({
      success: true,
      file: {
        id: result.insertId,
        filename: originalName,
        path: relativePath,
        mime: req.file.mimetype,
        size: req.file.size
      }
    });
  }
);

router.post(
  '/sql/run',
  ensureAuthenticated,
  allowSuperAdmin,
  csrfProtection,
  [body('statement').trim().isLength({ min: 1, max: 2000 })],
  handleValidation,
  async (req, res) => {
    const statement = req.body.statement.trim();
    const firstToken = statement.split(/\s+/)[0].toLowerCase();
    const allowed = ['select', 'show', 'describe', 'explain'];
    if (!allowed.includes(firstToken)) {
      return res.status(400).json({ error: 'statement_not_allowed' });
    }
    try {
      const pool = getPool();
      const [rows] = await pool.query(statement);
      await recordAudit(req.session.user.id, req.ip, 'sql.run', { statement: firstToken });
      res.json({ rows });
    } catch (error) {
      res.status(400).json({ error: 'query_failed', message: error.message });
    }
  }
);

module.exports = router;
