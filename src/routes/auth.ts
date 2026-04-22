import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response): void => {
  const { username, password } = req.body as { username: string; password: string };

  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || '12345';

  if (username === adminUser && password === adminPass) {
    res.json({
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
    return;
  }

  res.status(401).json({
    success: false,
    message: 'Credenciales inválidas',
  });
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response): void => {
  res.json({ success: true, message: 'Sesión cerrada' });
});

export default router;
