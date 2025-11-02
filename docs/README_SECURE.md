# Secure Environment Setup

The backend loads sensitive values from a file named `.env.secure` before evaluating runtime defaults. The loader lives in `src/obfuscation/runtime.js` and accepts Base64-wrapped secrets using the `ENC(...)` convention.

## File location

Place `.env.secure` *outside* the public web root and repository tree. For local development this can live in the project root, but for production mount it from an encrypted volume or secret manager.

```
/opt/nofdoet/.env.secure   # mounted secret
/var/www/nofdoet/current   # deployed application (no secret files)
```

## File format

Each non-comment line must contain `KEY=VALUE`. To hide the raw value, wrap it in `ENC()` and Base64-encode the plaintext.

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

Paste the Base64 output inside `ENC(...)`.

## Rotation checklist

1. Rotate the secret in your vault or infrastructure store.
2. Update the corresponding line in `.env.secure`.
3. Restart the Node.js service – the loader rehydrates values at boot.
4. Verify integrity by calling `/admin/login` with a valid credential.

The checksum gate in `src/server.js` ensures tampering with critical server files is detected on startup, so update `.env.secure` without modifying those files.
