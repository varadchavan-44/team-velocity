const { verifyRequest } = require('../lib/auth');

module.exports = async (req, res) => {
  res.status(200).json({ authenticated: verifyRequest(req) });
};
