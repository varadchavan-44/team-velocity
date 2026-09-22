const bcrypt = require('bcryptjs');
const { signSession, setSessionCookie } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Password required' });

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return res.status(500).json({ error: 'Server not configured (ADMIN_PASSWORD_HASH missing)' });

  const ok = await bcrypt.compare(password, hash);
  if (!ok) return res.status(401).json({ error: 'Wrong password' });

  const token = signSession();
  setSessionCookie(res, token);
  res.status(200).json({ ok: true });
};
