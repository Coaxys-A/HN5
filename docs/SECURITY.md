# Security Checklist

## Application hardening
- HTTP security headers enforced via Helmet (CSP, HSTS in production, XSS protections).
- Sessions stored via `express-session` with Secure, HttpOnly, SameSite=Strict cookies and Redis backing when configured.
- Login attempts rate-limited (5 attempts per 15 minutes per IP) with account lock after repeated failures.
- CSRF protection applied to state-changing admin routes using `csurf` tokens.
- All SQL interactions use parameterized queries to mitigate injection risks, and the admin raw SQL runner limits execution to read-only statements with CSRF + role verification.
- Audit logging records user actions, IP addresses (INET6), and payload metadata.
- Admin payloads validated with `express-validator`, sanitized via `sanitize-html`, and file uploads constrained to 10MB with an antivirus hook placeholder for future integration.
- Runtime protections rely on standard Express hardening (helmet, compression) while keeping the admin router unrestricted by domain locks; integrity monitoring can be added later if required.
- Sensitive environment variables load from `.env.secure`, keeping secrets outside the repository without additional obfuscation.

## Authentication
- Password hashes generated with bcrypt using cost defined by `DEFAULT_BCRYPT_COST`.
- Optional 2FA placeholder toggled through environment (`ENABLE_2FA_PLACEHOLDER`).
- Seed script avoids storing plaintext passwords unless explicitly allowed via flag.

## Operational practices
- Docker Compose provides isolated MySQL and Redis services for local testing.
- `.gitignore` prevents committing secrets, `admin-secrets.txt`, node modules, and build output.
- CI workflow runs lint/test/build to detect regressions before deployment.
- `docs/IMPLEMENTATION.md` documents configuration flags so operators can disable backlinks or adjust security posture prior to release.
