/* eslint-disable */
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
const { _0x4473, _0x2f7f } = require('../obfuscation/runtime');
const {
  login,
  logout,
  ensureAuthenticated,
  recordAudit,
  requireRole
} = require('./auth');

const router = express.Router();
const csrfProtection = csrf({ cookie: false });

const uploadsDir = path.resolve(__dirname, _0x4473('Li4vLi4vdXBsb2Fkcw=='));
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

const allowContentAccess = requireRole([
  _0x4473('YWJzb2x1dGVfZGV2ZWxvcGVy'),
  _0x4473('ZGV2ZWxvcGVyX3RlYW0='),
  _0x4473('c2Nob29sX3RlYW0=')
]);
const allowDeveloperTeam = requireRole([
  _0x4473('YWJzb2x1dGVfZGV2ZWxvcGVy'),
  _0x4473('ZGV2ZWxvcGVyX3RlYW0=')
]);
const allowSuperAdmin = requireRole([_0x4473('YWJzb2x1dGVfZGV2ZWxvcGVy')]);

const _0x39fa = {
  success: _0x4473('c3VjY2Vzcw=='),
  error: _0x4473('ZXJyb3I='),
  disabled: _0x4473('ZGlzYWJsZWQ='),
  login: _0x4473('bG9naW4='),
  logout: _0x4473('bG9nb3V0'),
  uploadSuccess: _0x4473('dXBsb2FkX3N1Y2Nlc3M='),
  deleted: _0x4473('ZGVsZXRlZA=='),
  updated: _0x4473('dXBkYXRlZA=='),
  created: _0x4473('Y3JlYXRlZA=='),
  fileRequired: _0x4473('ZmlsZV9yZXF1aXJlZA=='),
  statementNotAllowed: _0x4473('c3RhdGVtZW50X25vdF9hbGxvd2Vk'),
  queryFailed: _0x4473('cXVlcnlfZmFpbGVk')
};

const _0x53d7 = {
  auditSelect: _0x4473('U0VMRUNUIGlkLCB0cywgdXNlcl9pZCwgSU5FVDZfTlRPQShpcCkgQVMgaXAsIGFjdGlvbiwgZGV0YWlscyBGUk9NIGF1ZGl0X2xvZ3M='),
  staffSelect: _0x4473('U0VMRUNUICogRlJPTSBzdGFmZiBPUkRFUiBCWSBzb3J0X29yZGVyLCBpZCBERVND'),
  staffInsert: _0x4473('SU5TRVJUIElOVE8gc3RhZmYgKG5hbWUsIHRpdGxlLCBiaW9fc2hvcnQsIGJpb19sb25nLCBwaG90b19wYXRoLCBzb2NpYWwsIHNvcnRfb3JkZXIpIFZBTFVFUyAoPywgPywgPywgPywgPywgPywgPyk='),
  staffUpdate: _0x4473('VVBEQVRFIHN0YWZmIFNFVCBuYW1lPT8sIHRpdGxlPT8sIGJpb19zaG9ydD0/LCBiaW9fbG9uZz0/LCBwaG90b19wYXRoPT8sIHNvY2lhbD0/LCBzb3J0X29yZGVyPT8gV0hFUkUgaWQ9Pw=='),
  teacherSelect: _0x4473('U0VMRUNUICogRlJPTSB0ZWFjaGVycyBPUkRFUiBCWSBzb3J0X29yZGVyLCBpZCBERVND'),
  teacherInsert: _0x4473('SU5TRVJUIElOVE8gdGVhY2hlcnMgKG5hbWUsIHN1YmplY3QsIGJpbywgcGhvdG9fcGF0aCwgc29ydF9vcmRlciwgYWN0aXZlKSBWQUxVRVMgKD8sID8sID8sID8sID8sID8p'),
  teacherUpdate: _0x4473('VVBEQVRFIHRlYWNoZXJzIFNFVCBuYW1lPT8sIHN1YmplY3Q9PywgYmlvPT8sIHBob3RvX3BhdGg9Pywgc29ydF9vcmRlcj0/LCBhY3RpdmU9PyBXSEVSRSBpZD0/'),
  classSelect: _0x4473('U0VMRUNUICogRlJPTSBjbGFzc2VzIE9SREVSIEJZIGNyZWF0ZWRfYXQgREVTQw=='),
  classInsert: _0x4473('SU5TRVJUIElOVE8gY2xhc3NlcyAodGl0bGUsIHNsdWcsIHNjaGVkdWxlLCBkZXNjcmlwdGlvbiwgY2FwYWNpdHksIGFjdGl2ZSkgVkFMVUVTICg/LCA/LCA/LCA/LCA/LCA/KQ=='),
  classUpdate: _0x4473('VVBEQVRFIGNsYXNzZXMgU0VUIHRpdGxlPT8sIHNsdWc9Pywgc2NoZWR1bGU9PywgZGVzY3JpcHRpb249PywgY2FwYWNpdHk9PywgYWN0aXZlPT8gV0hFUkUgaWQ9Pw=='),
  programSelect: _0x4473('U0VMRUNUICogRlJPTSBwcm9ncmFtcyBPUkRFUiBCWSBjcmVhdGVkX2F0IERFU0M='),
  programInsert: _0x4473('SU5TRVJUIElOVE8gcHJvZ3JhbXMgKHRpdGxlLCBkZXNjcmlwdGlvbiwgdmlzaWJsZSkgVkFMVUVTICg/LCA/LCA/KQ=='),
  programUpdate: _0x4473('VVBEQVRFIHByb2dyYW1zIFNFVCB0aXRsZT0/LCBkZXNjcmlwdGlvbj0/LCB2aXNpYmxlPT8gV0hFUkUgaWQ9Pw=='),
  articleSelect: _0x4473('U0VMRUNUICogRlJPTSBhcnRpY2xlcyBPUkRFUiBCWSBwdWJsaXNoZWRfYXQgREVTQywgY3JlYXRlZF9hdCBERVND'),
  articleInsert: _0x4473('SU5TRVJUIElOVE8gYXJ0aWNsZXMgKHNsdWcsIHRpdGxlLCBleGNlcnB0LCBjb250ZW50LCByZWFkX21vcmVfdXJsLCBhdXRob3JfaWQsIHB1Ymxpc2hlZF9hdCwgdGFncykgVkFMVUVTICg/LCA/LCA/LCA/LCA/LCA/LCA/LCA/KQ=='),
  articleUpdate: _0x4473('VVBEQVRFIGFydGljbGVzIFNFVCBzbHVnPT8sIHRpdGxlPT8sIGV4Y2VycHQ9PywgY29udGVudD0/LCByZWFkX21vcmVfdXJsPT8sIHB1Ymxpc2hlZF9hdD0/LCB0YWdzPT8gV0hFUkUgaWQ9Pw=='),
  fileSelect: _0x4473('U0VMRUNUIGlkLCBmaWxlbmFtZSwgcGF0aCwgbWltZSwgc2l6ZSwgY3JlYXRlZF9hdCBGUk9NIGZpbGVzIE9SREVSIEJZIGNyZWF0ZWRfYXQgREVTQw=='),
  fileInsert: _0x4473('SU5TRVJUIElOVE8gZmlsZXMgKGZpbGVuYW1lLCBwYXRoLCBtaW1lLCBzaXplLCB1cGxvYWRlZF9ieSkgVkFMVUVTICg/LCA/LCA/LCA/LCA/KQ==')
};

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  let handled = false;
  _0x2f7f([
    () => {
      if (!errors.isEmpty()) {
        handled = true;
        res.status(422).json({ errors: errors.array() });
      }
    },
    () => {
      if (!handled) {
        next();
      }
    }
  ]);
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
    name: _0x4473('bm9mZG9ldC5zaWQ='),
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }
  };
  _0x2f7f([
    () => {
      if (process.env.REDIS_URL) {
        const client = new Redis(process.env.REDIS_URL);
        options.store = new RedisStore({ client, prefix: _0x4473('bm9mZG9ldDo=') });
      }
    }
  ]);
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
    await recordAudit(user.id, req.ip, _0x39fa.login, { user: user.username });
    res.json({ [_0x39fa.success]: true, user });
  } catch (error) {
    res.status(400).json({ [_0x39fa.error]: error.message });
  }
});

router.post('/logout', ensureAuthenticated, async (req, res) => {
  await recordAudit(req.session.user.id, req.ip, _0x39fa.logout, {});
  await logout(req);
  res.json({ [_0x39fa.success]: true });
});

router.post('/2fa/verify', ensureAuthenticated, csrfProtection, (req, res) => {
  if (!config.ENABLE_2FA_PLACEHOLDER) {
    return res.status(404).json({ [_0x39fa.error]: _0x39fa.disabled });
  }
  return res.json({ [_0x39fa.success]: true, placeholder: true });
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
    let sql = _0x53d7.auditSelect;
    if (conditions.length) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    sql += ` ${_0x4473('T1JERVIgQlkgdHMgREVTQyBMSU1JVCA/')}`;
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
  const [rows] = await pool.query(_0x53d7.staffSelect);
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
        _0x53d7.staffUpdate,
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
      await recordAudit(req.session.user.id, req.ip, _0x4473('c3RhZmYudXBkYXRl'), { id });
    } else {
      const [result] = await pool.query(
        _0x53d7.staffInsert,
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
      await recordAudit(req.session.user.id, req.ip, _0x4473('c3RhZmYuY3JlYXRl'), { id: result.insertId });
    }
    res.json({ [_0x39fa.success]: true });
  }
);

router.get('/teachers', ensureAuthenticated, allowContentAccess, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query(_0x53d7.teacherSelect);
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
        _0x53d7.teacherUpdate,
        [name, subject, bio, photoPath, sortOrder, active, id]
      );
      await recordAudit(req.session.user.id, req.ip, _0x4473('dGVhY2hlcnMudXBkYXRl'), { id });
    } else {
      const [result] = await pool.query(
        _0x53d7.teacherInsert,
        [name, subject, bio, photoPath, sortOrder, active]
      );
      await recordAudit(req.session.user.id, req.ip, _0x4473('dGVhY2hlcnMuY3JlYXRl'), { id: result.insertId });
    }
    res.json({ [_0x39fa.success]: true });
  }
);

router.get('/classes', ensureAuthenticated, allowContentAccess, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query(_0x53d7.classSelect);
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
        _0x53d7.classUpdate,
        [title, slugValue, schedule, description, capacity, active, payload.id]
      );
      await recordAudit(req.session.user.id, req.ip, _0x4473('Y2xhc3Nlcy51cGRhdGU='), { id: payload.id });
    } else {
      const slugValue = slugSanitized || uuid();
      const [result] = await pool.query(
        _0x53d7.classInsert,
        [title, slugValue, schedule, description, capacity, active]
      );
      await recordAudit(req.session.user.id, req.ip, _0x4473('Y2xhc3Nlcy5jcmVhdGU='), { id: result.insertId });
    }
    res.json({ [_0x39fa.success]: true });
  }
);

router.get('/programs', ensureAuthenticated, allowContentAccess, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query(_0x53d7.programSelect);
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
        _0x53d7.programUpdate,
        [title, description, visible, payload.id]
      );
      await recordAudit(req.session.user.id, req.ip, _0x4473('cHJvZ3JhbXMudXBkYXRl'), { id: payload.id });
    } else {
      const [result] = await pool.query(
        _0x53d7.programInsert,
        [title, description, visible]
      );
      await recordAudit(req.session.user.id, req.ip, _0x4473('cHJvZ3JhbXMuY3JlYXRl'), { id: result.insertId });
    }
    res.json({ [_0x39fa.success]: true });
  }
);

router.get('/articles', ensureAuthenticated, allowContentAccess, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query(_0x53d7.articleSelect);
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
        _0x53d7.articleUpdate,
        [slugValue, title, excerpt, content, readMoreUrl, publishedAt, JSON.stringify(tags), payload.id]
      );
      await recordAudit(req.session.user.id, req.ip, _0x4473('YXJ0aWNsZXMudXBkYXRl'), { id: payload.id });
    } else {
      const slugValue = slug || uuid();
      const [result] = await pool.query(
        _0x53d7.articleInsert,
        [slugValue, title, excerpt, content, readMoreUrl, req.session.user.id, publishedAt, JSON.stringify(tags)]
      );
      await recordAudit(req.session.user.id, req.ip, _0x4473('YXJ0aWNsZXMuY3JlYXRl'), { id: result.insertId });
    }
    res.json({ [_0x39fa.success]: true });
  }
);

router.get('/files', ensureAuthenticated, allowContentAccess, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query(_0x53d7.fileSelect);
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
      return res.status(400).json({ [_0x39fa.error]: _0x39fa.fileRequired });
    }
    // Placeholder for AV scanning hook.
    const pool = getPool();
    const originalName = sanitizePlainText(req.file.originalname) || req.file.originalname;
    const relativePath = path.relative(path.resolve(__dirname, '..', '..'), req.file.path).replace(/\\/g, '/');
    const [result] = await pool.query(
      _0x53d7.fileInsert,
      [originalName, relativePath, req.file.mimetype, req.file.size, req.session.user.id]
    );
    await recordAudit(req.session.user.id, req.ip, _0x4473('ZmlsZXMudXBsb2Fk'), { id: result.insertId, filename: originalName });
    res.json({
      [_0x39fa.success]: true,
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
      return res.status(400).json({ [_0x39fa.error]: _0x39fa.statementNotAllowed });
    }
    try {
      const pool = getPool();
      const [rows] = await pool.query(statement);
      await recordAudit(req.session.user.id, req.ip, _0x4473('c3FsLnJ1bg=='), { statement: firstToken });
      res.json({ rows });
    } catch (error) {
      res.status(400).json({ [_0x39fa.error]: _0x39fa.queryFailed, message: error.message });
    }
  }
);

module.exports = router;
