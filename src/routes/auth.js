const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || '12345';

  if (username === adminUser && password === adminPass) {
    return res.json({
      success: true,
      message: 'Login exitoso',
      token: 'ideacion360-admin-token',
      user: {
        id: 'admin-001',
        username: adminUser,
        role: 'admin',
        name: 'Administrador',
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Credenciales inválidas',
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Sesión cerrada' });
});

module.exports = router;
