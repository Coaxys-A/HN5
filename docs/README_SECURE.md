# Secure Environment Setup

The backend loads sensitive values from a file named `.env.secure` before evaluating runtime defaults. The loader now resides in `src/config.js` and reads plain `KEY=VALUE` pairs. Base64 wrapping is optional and only needed if you prefer encoding.

## File location

Place `.env.secure` *outside* the public web root and repository tree. For local development this can live in the project root, but for production mount it from an encrypted volume or secret manager.

```
/opt/nofdoet/.env.secure   # mounted secret
/var/www/nofdoet/current   # deployed application (no secret files)
```

## File format

Each non-comment line must contain `KEY=VALUE`. Values may be stored as plain text or wrapped in `ENC()` if you want to Base64-encode them for operational consistency.

```
# Example .env.secure
SESSION_SECRET=ENC(c2VjdXJlLXNlc3Npb24tc2VjcmV0)
MYSQL_DSN=ENC(bXlzcWw6Ly91c2VyOnBhc3NAaG9zdDoxMjM0L25vZmRvZXQ=)
PANEL_DOMAIN_SIGNATURE=panel.nofdoet.ir
ALLOW_DEBUG_HOSTS=localhost,127.0.0.1
```

## Encoding helper

Use OpenSSL or any Base64 tool to wrap secrets:

```
# encode without trailing newline
echo -n 'super-secret-value' | openssl base64
```

Paste the Base64 output inside `ENC(...)` if you choose to encode the value; otherwise store the plaintext directly.

## Rotation checklist

1. Rotate the secret in your vault or infrastructure store.
2. Update the corresponding line in `.env.secure`.
3. Restart the Node.js service – the loader rehydrates values at boot.
4. Verify integrity by calling `/admin/login` with a valid credential.

After updating `.env.secure`, restart the Node.js service so the refreshed variables are loaded on boot.
