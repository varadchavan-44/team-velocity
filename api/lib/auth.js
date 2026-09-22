const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const COOKIE_NAME = 'tv_admin';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function requireSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env var is not set');
  return secret;
}

function signSession() {
  return jwt.sign({ role: 'admin' }, requireSecret(), { expiresIn: MAX_AGE_SECONDS });
}

function verifyRequest(req) {
  const raw = req.headers.cookie || '';
  const cookies = cookie.parse(raw);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;
  try {
    jwt.verify(token, requireSecret());
    return true;
  } catch {
    return false;
  }
}

function setSessionCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: MAX_AGE_SECONDS,
    })
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE_NAME, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    })
  );
}

module.exports = { signSession, verifyRequest, setSessionCookie, clearSessionCookie, COOKIE_NAME };
