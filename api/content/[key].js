const { sql } = require('../lib/db');
const { verifyRequest } = require('../lib/auth');

const ALLOWED_KEYS = ['hero', 'update', 'partner'];

module.exports = async (req, res) => {
  const { key } = req.query;
  if (!ALLOWED_KEYS.includes(key)) return res.status(400).json({ error: 'Unknown content key' });

  if (req.method === 'GET') {
    const result = await sql`SELECT data FROM homepage_content WHERE key = ${key}`;
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(result.rows[0].data);
  }

  if (req.method === 'PUT') {
    if (!verifyRequest(req)) return res.status(401).json({ error: 'Unauthorized' });
    const data = req.body || {};
    const result = await sql`
      INSERT INTO homepage_content (key, data, updated_at)
      VALUES (${key}, ${JSON.stringify(data)}::jsonb, now())
      ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
      RETURNING key, data`;
    return res.status(200).json(result.rows[0]);
  }

  res.status(405).json({ error: 'Method not allowed' });
};
