import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/database';
import authRouter from './routes/auth';
import eventsRouter from './routes/events';

// ─── Database ─────────────────────────────────────────────────────────────────
connectDB();

// ─── App ─────────────────────────────────────────────────────────────────────
const app: Application = express();

// ─── Middlewares ─────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://ideacion360.com',
    'https://ideacion360.web.app',
    'https://ideacion360.firebaseapp.com'
  ],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🚀 Ideación 360 API está corriendo',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Root ────────────────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'API del Sistema de Bodas funcionando.', version: '1.0.0' });
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

// ─── Start Server ────────────────────────────────────────────────────────────
// Cloud Run inyecta PORT como variable de entorno. 
// Usamos '0.0.0.0' para aceptar conexiones externas dentro del contenedor.
const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Servidor de Antigravity listo en el puerto: ${PORT}`);
  console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
