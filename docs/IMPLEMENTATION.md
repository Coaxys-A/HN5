# Implementation Notes

## Front-end changes
- Global RTL overrides and interactive header button states defined in `css/wm_overrides.20240605.css` and loaded on all pages.
- Landing page (`index.html`) updated to remove deprecated sections, add new "پرسنل مدرسه" and "دبیران مدرسه" grids, rework classes, activities, and enrichment programs, and rename the magazine section to "رصد" with Teknav backlinks.
- Contact form simplified to phone-based communication and email field removed per requirements.
- About page refreshed with developer cards including Arsam Sabbagh (Coaxys) and two placeholders with visible backlinks.
- Blog listing and article pages now surface "بیشتر بخوانید" buttons to Teknav and embed hidden backlinks when flags enable them.
- JavaScript fallback logic (`js/main.js`) ensures broken images degrade gracefully.

## Backend & admin scaffold
- Node.js/Express service configured in `src/server.js` with security headers, compression, and `/admin` router.
- Admin router (`src/admin/routes.js`) offers CRUD endpoints for staff, teachers, classes, programs, and articles with CSRF protection, granular role guards, and audit logging.
- Admin router (`src/admin/routes.js`) now stores readable SQL strings, removes legacy hostname locking, and records audits with descriptive action identifiers.
- File manager endpoints provide secure uploads (10MB cap) into `uploads/`, persist metadata to MySQL, and log all actions.
- Audit viewer (`GET /admin/audit`) supports filtering by user and action; `POST /admin/sql/run` allows read-only SQL operations for super-admins with full auditing.
- Authentication utilities (`src/admin/auth.js`) implement bcrypt-based login, rate limiting, and session management using Redis when available.
- MySQL schema defined in `sql/2025_10_22_init.sql`; seed script `sql/seed_admins.js` provisions default roles and users.

## Tooling & DevOps
- `package.json` describes build, lint, test, and seed scripts alongside required dependencies (obfuscation tooling removed).
- `webpack.prod.js` bundles admin client assets with Babel support; placeholder entry at `src/admin/client/index.js`.
- Docker Compose stack spins up the web server, MySQL, and Redis for local development (`docker-compose.yml`).
- GitHub Actions workflow `.github/workflows/ci.yml` runs lint, tests, and build steps with artifact upload.

## Secret handling
- `.env.secure` (documented in `docs/README_SECURE.md`) loads before runtime defaults so operators can inject sensitive secrets outside the repository.

## Flags & configuration
- `src/config.js` surfaces runtime flags mirroring operator controls (hidden backlinks, bcrypt cost, 2FA placeholder, etc.).
- `.gitignore` updated to avoid committing build artifacts, dependencies, and secrets.
