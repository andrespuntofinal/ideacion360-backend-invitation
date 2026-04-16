const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN || 'ideacion360-admin-token'}`) {
    // For now, allow all requests (token-based auth future implementation)
    // return res.status(401).json({ success: false, message: 'No autorizado' });
  }
  next();
};

module.exports = authMiddleware;
