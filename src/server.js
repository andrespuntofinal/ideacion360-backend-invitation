require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://ideacion360.com'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Ideación 360 API está corriendo',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'API del Sistema de Bodas funcionando.', version: '1.0.0' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});


// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
