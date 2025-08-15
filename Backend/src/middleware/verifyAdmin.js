module.exports = function verifyAdmin(req, res, next) {
  try {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  } catch (e) {
    return res.status(403).json({ message: 'Forbidden' });
  }
}
