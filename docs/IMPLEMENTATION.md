# Implementation Notes

## Front-end
- Public site now lives under the Next.js pages router (`pages/`), sharing RTL global styles via `styles/global.css` and layout components in `components/`.
- Static assets migrated into `public/` so cPanel/Next can serve fonts, uploads, and hero imagery without Apache rules.
- Shared Teknav backlinks & hidden-link toggles read from `lib/settings.js`, which in turn respects `INCLUDE_HIDDEN_BACKLINKS` / `NEXT_PUBLIC_INCLUDE_HIDDEN_BACKLINKS`.
- Mock data modules (`data/*.js`) backfill teachers, courses, activities, and blog content until the admin API is wired directly into the pages.

## Backend & admin stack
- Express server bootstraps Next inside `server.js`, then mounts `backend/admin/routes.js` and `backend/api/public.js` before delegating everything else to Next.
- Environment handling lives in `backend/config.js` and enforces `.env.secure` precedence plus production guards for `MYSQL_DSN` + `SESSION_SECRET`.
- Database pool (`backend/db.js`) exposes `ensureDatabaseConnection()` so both the startup path and `/healthz` can report readiness.
- Admin router manages CRUD for staff, teachers, classes, programs, articles, and files. Validators + sanitizers normalize payloads, and `scanUploadedFile()` is the hook for antivirus scanners.
- Content tables now include a `status` column with shared helpers to keep “incoming/coming soon/preparing” flows consistent between admin, API, and public site.
- TOTP 2FA is implemented with `speakeasy`/`qrcode`; setup + verification endpoints live under `/admin/2fa/*` and secrets persist in `user_totp_secrets`.
- Public API groups programs/articles by status so the Next.js front-end can render “in preparation” vs “visible” cards without extra queries.

## Tooling & DevOps
- `.github/workflows/ci.yml` runs lint/tests/build on Node 22, mirroring the shared-host runtime.
- `.env.example` documents all required flags, including `DEV_ADMIN_PASS`, `REDIS_URL`, and `ENABLE_2FA`.
- `docs/DEPLOYMENT_SHARED_HOSTING.md` (new) provides copy/paste instructions for cPanel (application root, startup file, env vars, build steps).
- `sql/2025_10_22_init.sql` gained the `status` columns plus `user_totp_secrets`; `sql/seed_admins.js` now enforces explicit passwords in production and prints “DEVELOPMENT ONLY” hints locally.
