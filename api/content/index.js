const { sql } = require('../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const result = await sql`SELECT key, data FROM homepage_content`;
  const out = {};
  for (const row of result.rows) out[row.key] = row.data;
  res.status(200).json(out);
};
