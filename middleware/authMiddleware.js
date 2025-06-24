const jwt = require('jsonwebtoken');

// ✅ Auth for All Logged-In Users
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id and role
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(400).json({ error: 'Invalid token.' });
  }
};

// ✅ Admin Only
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can perform this action.' });
  }
  next();
};

module.exports = {
  authenticateUser,
  requireAdmin
};
