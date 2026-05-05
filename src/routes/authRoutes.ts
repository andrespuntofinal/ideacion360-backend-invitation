import express, { Request, Response } from 'express';
import { auth } from '../config/firebase';
import User from '../models/User';

const router = express.Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify Firebase token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    if (!email) {
      res.status(400).json({ success: false, message: 'Email no disponible en el token' });
      return;
    }

    // Find or create user in MongoDB
    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email,
        role: 'user-boda',
        nombre: name || email.split('@')[0],
        estado: 'activo'
      });
      await user.save();
      
      // Set custom claim for new user
      await auth.setCustomUserClaims(uid, { role: 'user-boda' });
    }

    if (user.estado === 'inactivo') {
      res.status(403).json({ success: false, message: 'Su cuenta se encuentra inactiva. Por favor contacte al soporte.' });
      return;
    }

    // Ensure custom claim matches db (optional sync step)
    if (decodedToken.role !== user.role) {
      await auth.setCustomUserClaims(uid, { role: user.role });
    }

    res.status(200).json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        nombre: user.nombre,
        role: user.role,
        estado: user.estado
      }
    });

  } catch (error) {
    console.error('Error in /login endpoint:', error);
    res.status(401).json({ success: false, message: 'Invalid token or authentication error' });
  }
});

export default router;
