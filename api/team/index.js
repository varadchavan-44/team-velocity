const { sql } = require('../lib/db');
const { verifyRequest } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { category } = req.query;
    const result = category
      ? await sql`SELECT * FROM team_members WHERE category = ${category} ORDER BY sort_order ASC, id ASC`
      : await sql`SELECT * FROM team_members ORDER BY category ASC, sort_order ASC, id ASC`;
    return res.status(200).json(result.rows);
  }

  if (req.method === 'POST') {
    if (!verifyRequest(req)) return res.status(401).json({ error: 'Unauthorized' });

    const {
      name,
      role,
      category = 'council',
      photo_url = null,
      instagram_url = null,
      linkedin_url = null,
      sort_order = 0,
    } = req.body || {};

    if (!name || !role) return res.status(400).json({ error: 'name and role are required' });
    if (!['council', 'advisory'].includes(category)) {
      return res.status(400).json({ error: "category must be 'council' or 'advisory'" });
    }

    const result = await sql`
      INSERT INTO team_members (name, role, category, photo_url, instagram_url, linkedin_url, sort_order)
      VALUES (${name}, ${role}, ${category}, ${photo_url}, ${instagram_url}, ${linkedin_url}, ${sort_order})
      RETURNING *`;
    return res.status(201).json(result.rows[0]);
  }

  res.status(405).json({ error: 'Method not allowed' });
};
