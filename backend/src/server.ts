import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import User from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

// Crear aplicación Express
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// Configurar CORS: permitir FRONTEND_URL (puede ser lista separada por comas) y por defecto http://localhost:8081
const envOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(s => s.trim()) : [];
const defaultAllowed = ['http://localhost:8081'];
const allowedOrigins = Array.from(new Set([...envOrigins, ...defaultAllowed]));

app.use(cors({
  origin: (origin, callback) => {
    // permitir peticiones sin origin (curl, servidores) o si el origin está en la lista
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS: origen no permitido'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Preflight handler
app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS: origen no permitido'));
  },
  credentials: true
}));

// Ruta raíz
app.get('/', (_req: Request, res: Response) => {
  res.send('API running');
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Servir archivos estáticos (cliente del chatbot / demo de cámara)
app.use(express.static('public'));

// Página de chat
app.get('/chat.html', (_req: Request, res: Response) => {
  res.sendFile('chat.html', { root: __dirname + '/../public' });
});

// Manejo de rutas no encontradas
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Crear admin inicial si no existe (usa variables de entorno ADMIN_EMAIL / ADMIN_PASSWORD)
const createInitialAdmin = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@local').toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (!adminPass) {
      console.log('ADMIN_PASSWORD no definido — omitiendo creación automática de admin.');
      return;
    }

    // Buscar por email o por role
    const existingByEmail = await User.findOne({ email: adminEmail });
    const existingByRole = await User.findOne({ role: 'admin' });

    if (existingByEmail || existingByRole) {
      console.log('Administrador ya existe. No se crea uno nuevo.');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(adminPass, salt);

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashed,
      role: 'admin'
    });

    const safe = admin.toObject();
    delete (safe as any).password;
    console.log('Administrador creado automáticamente:', safe);
  } catch (err) {
    console.error('Error al crear admin inicial:', err);
  }
};

// Iniciar servidor
(async () => {
  try {
    // Conectar a MongoDB
    await connectDB();

    await createInitialAdmin();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log('Orígenes permitidos CORS:', allowedOrigins);
    });
  } catch (err) {
    console.error('Error iniciando servidor:', err);
    process.exit(1);
  }
})();