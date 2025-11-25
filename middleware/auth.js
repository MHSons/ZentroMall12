const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireSuper(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'No user' });
  if (req.user.role !== 'super') return res.status(403).json({ error: 'Requires super-admin' });
  next();
}

module.exports = { requireAuth, requireSuper };
