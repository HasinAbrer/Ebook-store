const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      // Our JWT currently doesn't include email; treat username as email when email is absent
      email: decoded.email || decoded.username,
      role: decoded.role
    };
    next();
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
