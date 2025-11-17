# Security Checklist

## Application hardening
- Express stack (`server.js` + `backend/admin/routes.js`) applies Helmet, disables `x-powered-by`, and enforces gzip/JSON body parsing ahead of any router logic.
- Sessions rely on `express-session` cookies with HttpOnly + SameSite=Strict plus Redis persistence whenever `REDIS_URL` is provided.
- Login, audit, and CRUD endpoints use CSRF tokens from `csurf`, input validation via `express-validator`, and sanitization helpers (`sanitizePlainText`, `sanitizeRichText`).
- Rate limiting in `backend/admin/auth.js` applies both IP+username (5 attempts/15 min) and username-only locks to stop brute force attempts.
- MySQL queries are parameterized; the raw SQL runner rejects non-read operations and everything is logged to `audit_logs`.
- File uploads are capped at 10MB and flow through `scanUploadedFile()` so an antivirus connector can be wired in without changing endpoint code.
- Content entities (classes, programs, articles) now expose an explicit `status` column (`visible`, `incoming`, `coming_soon`, `preparing`, `hidden`) to ensure unpublished material never leaks through the public API.
- `.env.secure` is loaded before `.env`, with production boot failing if `MYSQL_DSN` or `SESSION_SECRET` are unsafe defaults.

## Authentication & authorization
- Password hashing uses bcrypt with the operator-defined `DEFAULT_BCRYPT_COST`.
- Session payloads store `{ id, username, display_name, role }`, and `requireRole()` checks human-readable role names (`absolute_developer`, `school_team`, `developer_team`).
- Optional TOTP 2FA (enabled via `ENABLE_2FA=true`) is enforced for `absolute_developer` once enrolled. `/admin/2fa/setup` provisions a QR code backed by `speakeasy` secrets stored in `user_totp_secrets`, and `/admin/2fa/verify` activates the secret. Login rejects invalid/missing tokens with `two_factor_required` / `invalid_two_factor` codes.
- Seed script refuses to run in production without `DEV_ADMIN_PASS`, guaranteeing deliberate credential rotation; dev-mode passwords are prefixed with “DEVELOPMENT ONLY”.

## Operational practices
- `backend/db.js` validates connectivity at startup (`ensureDatabaseConnection()`) and exposes the same check for `/healthz` responses.
- `.github/workflows/ci.yml` builds/lints with Node 22 to match the shared-host runtime.
- `docs/DEPLOYMENT_SHARED_HOSTING.md` captures the exact cPanel steps (environment variables, build commands, startup file) so production runs mirror the validated configuration.
