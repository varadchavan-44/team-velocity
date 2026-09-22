# Backend setup

What you now have: `/api` serverless functions (run on Vercel automatically,
no extra hosting account), Postgres for data, Vercel Blob for photo storage,
and `/admin.html` as the management panel. `team.html` and `index.html` now
pull their content from the API instead of having it hardcoded.

## 1. Push this to GitHub and import to Vercel (if not already)

If the repo is already connected to Vercel (it is — `team-velocity-brown.vercel.app`),
just `git push` these changes and Vercel will redeploy automatically. The
`/api` folder is auto-detected as serverless functions; nothing else to configure.

## 2. Add Postgres

In the Vercel dashboard → your project → **Storage** tab → **Create Database** →
**Postgres**. Once created, click **Connect** to this project — this
auto-injects `POSTGRES_URL` (and related vars) as environment variables. No
manual copy-pasting needed.

## 3. Add Blob storage

Same **Storage** tab → **Create** → **Blob**. Connect it to this project —
this auto-injects `BLOB_READ_WRITE_TOKEN`.

## 4. Set the two auth-related env vars

In **Settings → Environment Variables**, add:

- `JWT_SECRET` — any long random string. Generate one:
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `ADMIN_PASSWORD_HASH` — a bcrypt hash of the password you want to log into
  `/admin.html` with. Generate it (needs Node + `npm install` run locally once):
  ```
  npm install
  npm run hash-password -- "your-chosen-password"
  ```
  Paste the printed hash as the env var value. **Never put the plain password
  itself in an env var or in git.**

Redeploy after adding these (Vercel does this automatically on env var changes
in most cases; if not, trigger a redeploy from the dashboard).

## 5. Create the database tables and seed existing data

Easiest path — no local setup needed:
1. Vercel dashboard → Storage → your Postgres database → **Query** tab.
2. Paste the contents of `schema.sql`, run it.
3. Paste the contents of `seed.sql`, run it. This inserts the 18 team members
   and the 3 homepage content blocks that are currently hardcoded on the
   live site, so nothing regresses when you deploy.

(Alternative: `vercel env pull .env.local` locally, then `npm run seed` —
same result, just via the CLI.)

## 6. Use it

- Public site: unchanged URLs, now reading from the DB.
- Admin: go to `/admin.html`, log in with the password you hashed in step 4.
  - **Team roster tab**: add/edit/delete members, upload a photo per member
    (jpeg/png/webp/gif, 5MB max), set Instagram/LinkedIn links, choose
    "Current council" vs "Advisory", set a sort order.
  - **Homepage content tab**: edit the hero text, the "what's moving now"
    update block, and the partner-tease copy. Saves are live immediately —
    no redeploy needed, since it's read from the DB on every page load.

## Notes / things worth knowing

- **Auth is a single shared password**, as you asked for — good enough for a
  small club, but anyone with the password has full edit access. If you ever
  want per-person logins, that's a bigger change (real user table + per-user
  hashed passwords) — say the word if you want it later.
- **The session cookie lasts 7 days.** Log out on shared/lab computers.
- **Past councils (2024-25, 2023, 2021-22) on team.html were left static** —
  you didn't ask for those to be editable and they're historical/frozen
  anyway. Say if you want those editable too; same pattern applies.
- **The car page, partner page, and sponsor logo strip were left untouched**
  — not selected in your requirements. Same pattern (a content-form + a
  data-content hook) extends to any of them if you want it later.
- Image uploads go to Vercel Blob under `team-photos/`, publicly readable at
  a CDN URL. Deleting a member does **not** delete the underlying blob file —
  it just clears the DB reference. Not a big deal at your scale (Blob free
  tier is 5GB), but worth knowing if this matters later.
