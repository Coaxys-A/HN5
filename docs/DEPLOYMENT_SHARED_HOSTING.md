# Shared Hosting Deployment (cPanel Node App)

1. **Upload code**
   - Zip the repository (including `.next`, `public`, `backend`, `pages`, `server.js`).
   - In cPanel, create an application directory such as `/home/<USER>/apps/nofdoet` and upload/unzip the project there.

2. **Create the Node.js App**
   - Open **cPanel → Setup Node.js App**.
   - Runtime: **Node.js 22.x**.
   - Application root: `/home/<USER>/apps/nofdoet` (or your chosen path).
   - Application startup file: `server.js`.
   - Passenger log file: optional but recommended (e.g., `logs/nofdoet.log`).

3. **Environment variables**
   - Add the following keys via the panel UI (values should match production secrets):
     - `NODE_ENV=production`
     - `MYSQL_DSN=mysql://USER:PASS@HOST:3306/nofdoet`
     - `SESSION_SECRET=<long random string>`
     - `DEFAULT_BCRYPT_COST=12`
     - `DEV_ADMIN_PASS=<only for seeding>`
     - `ENABLE_2FA=true` (optional)
     - `INCLUDE_HIDDEN_BACKLINKS=true|false`
     - `PANEL_DOMAIN_SIGNATURE=panel.nofdoet.ir`
     - `ALLOW_DEBUG_HOSTS=domain1,domain2`
     - `REDIS_URL=redis://...` (if Redis is available)

4. **Install dependencies & build**
   - Use the **Run JS Script** button or SSH-equivalent command box to execute:
     1. `npm install`
     2. `npm run build` (this compiles the Next.js pages and prepares the app for production)
   - If you need to seed admins, run `npm run seed:dev` after ensuring `DEV_ADMIN_PASS` is set.

5. **Start / restart the app**
   - Click **Restart App** in the Node.js App panel. Passenger will execute `node server.js`, which:
     - Runs a database health check.
     - Serves the Next.js frontend.
     - Exposes `/admin` and `/api` routes on the same port.

6. **Proxy the public domain**
   - Point `nofdoet.ir` (and any subdomains) to the hosting provider.
   - If the host requires Apache in front, configure `.htaccess` to route all traffic to the Node app; otherwise, map the domain directly in cPanel.

7. **Post-deploy checks**
   - Visit `/healthz` to confirm `{ status: 'ok', database: 'ok' }`.
   - Log in to `/admin`, confirm 2FA enrollment (if enabled), and run a read-only SQL query via the SQL runner to ensure permissions are intact.
   - Review logs for “DEVELOPMENT ONLY” password messages and rotate credentials immediately in production.
