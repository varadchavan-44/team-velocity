const { put } = require('@vercel/blob');
const { verifyRequest } = require('./lib/auth');

// Raw binary body, not JSON — Vercel must not try to parse it.
module.exports.config = { api: { bodyParser: false } };

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!verifyRequest(req)) return res.status(401).json({ error: 'Unauthorized' });

  const contentType = req.headers['content-type'] || '';
  if (!ALLOWED_TYPES.includes(contentType)) {
    return res.status(400).json({ error: 'Only jpeg, png, webp, gif images are allowed' });
  }

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > MAX_BYTES) {
    return res.status(413).json({ error: 'Image too large (5MB max)' });
  }

  const rawName = String(req.headers['x-filename'] || 'photo');
  const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_');

  try {
    const blob = await put(`team-photos/${Date.now()}-${safeName}`, req, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    });
    res.status(200).json({ url: blob.url });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
};
