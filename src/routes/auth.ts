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

import Event from '../models/Event';
import { sendOTPEmail } from '../services/emailService';

// POST /api/auth/client/request-otp
router.post('/client/request-otp', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as { email: string };
    
    if (!email) {
      res.status(400).json({ success: false, message: 'El correo electrónico es requerido' });
      return;
    }

    const event = await Event.findOne({ 'contact.email': email });
    
    if (!event) {
      res.status(404).json({ success: false, message: 'Usuario no registrado' });
      return;
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    event.contact = {
      ...event.contact,
      OTPcode: otpCode,
      OTPexpiration: otpExpiration
    };
    
    await event.save();

    // Send email
    const coupleNames = event.wedding?.coupleNames || 'los novios';
    await sendOTPEmail(email, coupleNames, otpCode);

    res.json({ success: true, message: 'Código OTP enviado al correo electrónico' });
  } catch (error) {
    console.error('Error request OTP:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// POST /api/auth/client/verify-otp
router.post('/client/verify-otp', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body as { email: string; otp: string };

    const event = await Event.findOne({ 'contact.email': email });
    
    if (!event || !event.contact) {
      res.status(404).json({ success: false, message: 'Usuario no registrado' });
      return;
    }

    if (!event.contact.OTPcode || event.contact.OTPcode !== otp) {
      res.status(400).json({ success: false, message: 'Código ingresado no es correcto' });
      return;
    }

    if (!event.contact.OTPexpiration || event.contact.OTPexpiration < new Date()) {
      res.status(400).json({ success: false, message: 'El código OTP ha expirado' });
      return;
    }

    // Clear OTP after successful use
    event.contact.OTPcode = undefined;
    event.contact.OTPexpiration = undefined;
    await event.save();

    res.json({
      success: true,
      message: 'Verificación exitosa',
      token: `ideacion360-client-token-${event.eventId}`,
      user: {
        id: event.eventId,
        username: email,
        role: 'client',
        name: event.contact.name || email,
      },
      eventId: event.eventId,
    });
  } catch (error) {
    console.error('Error verify OTP:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;
