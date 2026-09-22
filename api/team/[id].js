const { sql } = require('../lib/db');
const { verifyRequest } = require('../lib/auth');

module.exports = async (req, res) => {
  const { id } = req.query;
  if (!/^\d+$/.test(String(id))) return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM team_members WHERE id = ${id}`;
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(result.rows[0]);
  }

  if (!verifyRequest(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'PUT') {
    const { name, role, category, photo_url, instagram_url, linkedin_url, sort_order } = req.body || {};
    if (category && !['council', 'advisory'].includes(category)) {
      return res.status(400).json({ error: "category must be 'council' or 'advisory'" });
    }

    const result = await sql`
      UPDATE team_members SET
        name = COALESCE(${name}, name),
        role = COALESCE(${role}, role),
        category = COALESCE(${category}, category),
        photo_url = COALESCE(${photo_url}, photo_url),
        instagram_url = COALESCE(${instagram_url}, instagram_url),
        linkedin_url = COALESCE(${linkedin_url}, linkedin_url),
        sort_order = COALESCE(${sort_order}, sort_order)
      WHERE id = ${id}
      RETURNING *`;
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(result.rows[0]);
  }

  if (req.method === 'DELETE') {
    const result = await sql`DELETE FROM team_members WHERE id = ${id} RETURNING id`;
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
};
