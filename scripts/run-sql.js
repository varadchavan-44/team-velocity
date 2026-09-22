// Usage: node scripts/run-sql.js schema.sql
// Requires POSTGRES_URL (or the other @vercel/postgres env vars) to be set,
// e.g. by running `vercel env pull .env.local` first and loading it.
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { sql } = require('@vercel/postgres');

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/run-sql.js <file.sql>');
    process.exit(1);
  }
  const text = fs.readFileSync(path.resolve(file), 'utf8');
  // naive split on semicolons at statement boundaries is unsafe for JSONB literals
  // containing semicolons, so just send the whole file as one query — Postgres
  // supports multiple statements separated by ; in a single query string via sql.query.
  await sql.query(text);
  console.log(`Ran ${file}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
