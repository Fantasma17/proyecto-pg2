import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Registrar usuario
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, firstName, lastName, phone, dateOfBirth, gender } = req.body;
    const emailLower = email?.toLowerCase();

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      res.status(400).json({ message: 'El email ya está registrado' });
      return;
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      email: emailLower,
      password: hashedPassword,
      role: role || 'patient',
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender
    });

    // Generar token (asegurar tipos correctos)
    const secret: string = process.env.JWT_SECRET ?? 'your-secret-key';
    const expiresIn: string = process.env.JWT_EXPIRE ?? '7d';
    // Castear para satisfacer las firmas de TypeScript
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      secret as unknown as jwt.Secret,
      { expiresIn } as jwt.SignOptions
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
      return;
    }

    // Normalizar email y log de intento
    const emailLower = String(email).toLowerCase().trim();
    console.log(`[auth] Login attempt for: ${emailLower} from IP: ${req.ip}`);

    const user = await User.findOne({ email: emailLower });
    if (!user) {
      console.warn(`[auth] Login failed - user not found: ${emailLower}`);
      const detail = process.env.DEBUG_AUTH === 'true' ? 'usuario no encontrado' : undefined;
      res.status(401).json({ success: false, message: 'Credenciales inválidas', detail });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[auth] Login failed - incorrect password for: ${emailLower}`);
      const detail = process.env.DEBUG_AUTH === 'true' ? 'contraseña incorrecta' : undefined;
      res.status(401).json({ success: false, message: 'Credenciales inválidas', detail });
      return;
    }

    // Generar token (userId + role)
    const secret = process.env.JWT_SECRET ?? 'secret';
    const expiresIn = process.env.JWT_EXPIRE ?? '7d';
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      secret as unknown as jwt.Secret,
      { expiresIn } as jwt.SignOptions
    );

    const userSafe = user.toObject();
    delete (userSafe as any).password;

    // Log exitoso
    console.log(`[auth] Login success for: ${emailLower}`);

    res.json({ success: true, token, data: userSafe });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Endpoint de depuración (solo en development): lista administradores sin password
export const debugAdmins = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'production') {
      res.status(404).json({ success: false, message: 'Not found' });
      return;
    }

    const admins = await User.find({ role: 'admin' }).select('-password -__v');
    res.json({ success: true, count: admins.length, data: admins });
  } catch (error: any) {
    console.error('Error debugAdmins:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || (req as any).userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Permitir llamadas desde el frontend (fallback a http://localhost:8081)
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:8081');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

// Actualizar perfil
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || (req as any).userId;
    const updates = req.body;

    // No permitir actualizar email, password o role directamente
    delete updates.email;
    delete updates.password;
    delete updates.role;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Permitir llamadas desde el frontend (fallback a http://localhost:8081)
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:8081');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};