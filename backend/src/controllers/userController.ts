import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// Obtener todos los usuarios (solo admin)
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios'
    });
  }
};

// Obtener perfil del usuario actual
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario'
    });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario'
    });
  }
};

// Obtener pacientes por psicólogo
export const getPatientsByPsychologist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { psychologistId } = req.params;

    const patients = await User.find({
      role: 'paciente',
      psychologistId: psychologistId
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    console.error('Error getting patients by psychologist:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los pacientes'
    });
  }
};

// Obtener todos los psicólogos (solo admin)
export const getAllPsychologists = async (_req: Request, res: Response): Promise<void> => {
  try {
    const psychologists = await User.find({ role: 'psicologo' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: psychologists.length,
      data: psychologists
    });
  } catch (error) {
    console.error('Error getting psychologists:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los psicólogos'
    });
  }
};

// Obtener todos los pacientes de un psicólogo (el psicólogo actual)
export const getMyPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const psychologistId = (req as any).user.id;

    const patients = await User.find({
      role: 'paciente',
      psychologistId: psychologistId
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los pacientes'
    });
  }
};

// Asignar psicólogo a un paciente (solo admin)
export const assignPsychologist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, psychologistId } = req.body;

    // Verificar que el psicólogo existe
    const psychologist = await User.findOne({
      _id: psychologistId,
      role: 'psicologo'
    });

    if (!psychologist) {
      res.status(404).json({
        success: false,
        message: 'Psicólogo no encontrado'
      });
      return;
    }

    // Actualizar el paciente
    const patient = await User.findOneAndUpdate(
      { _id: patientId, role: 'paciente' },
      { psychologistId: psychologistId },
      { new: true }
    ).select('-password');

    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Psicólogo asignado exitosamente',
      data: patient
    });
  } catch (error) {
    console.error('Error assigning psychologist:', error);
    res.status(500).json({
      success: false,
      message: 'Error al asignar el psicólogo'
    });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, phone, age } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, age },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil'
    });
  }
};

// Eliminar un usuario (solo admin)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario'
    });
  }
};

// Cambiar contraseña
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
      return;
    }

    // Hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar la contraseña'
    });
  }
};

// Añadir función para crear admin si no existe
export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    // Preferir variable de entorno, fallback a body (útil para pruebas)
    const password = (req.body && req.body.password) || process.env.ADMIN_PASSWORD;
    const email = (req.body && req.body.email) || process.env.ADMIN_EMAIL || 'admin@local';
    const name = (req.body && req.body.name) || process.env.ADMIN_NAME || 'Admin';
    const force = req.body && (req.body.force === true || req.body.force === 'true');

    if (!password) {
      res.status(400).json({
        success: false,
        message:
          'Contraseña de admin no proporcionada. Define ADMIN_PASSWORD en las variables de entorno o envía { "password": "tuPass" } en el body.'
      });
      return;
    }

    // Verificar si ya existe un admin por email o por role
    const existingByEmail = await User.findOne({ email: email.toLowerCase() });
    const existingByRole = await User.findOne({ role: 'admin' });

    // Si existe por email o por role
    if (existingByEmail || existingByRole) {
      // Si se solicita forzar, actualizar contraseña del usuario encontrado (preferir el que tenga el email)
      if (force) {
        const target = existingByEmail || existingByRole!;
        const salt = await bcrypt.genSalt(10);
        target.password = await bcrypt.hash(password, salt);
        await target.save();

        const safe = target.toObject();
        delete (safe as any).password;

        res.json({
          success: true,
          message: 'Contraseña de administrador actualizada (force=true).',
          data: safe
        });
        return;
      }

      // Si no se fuerza, devolver información
      res.status(400).json({
        success: false,
        message:
          'Ya existe un administrador. Si quieres actualizar su contraseña envía { "force": true, "password": "nueva" } en el body.'
      });
      return;
    }

    // No existe admin: crearlo
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const adminUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: 'admin'
    });

    // No devolver la contraseña
    const adminSafe = adminUser.toObject();
    delete (adminSafe as any).password;

    res.json({
      success: true,
      message: 'Administrador creado correctamente',
      data: adminSafe
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el administrador'
    });
  }
};

// Crear psicólogo (solo admin)
export const createPsychologist = async (req: Request, res: Response): Promise<void> => {
  try {
    // Log de depuración: mostrar si la petición llega y algo del body/authorization
    console.log('[createPsychologist] request received', {
      env: process.env.NODE_ENV,
      authHeader: !!req.headers.authorization,
      body: req.body
    });
    
    let { name, email, password, phone } = req.body;
    
    if (!name) {
      res.status(400).json({
        success: false,
        message: 'name es requerido'
      });
      return;
    }
    
    // Helper: generar contraseña aleatoria
    const generatePassword = (len = 10) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let out = '';
      for (let i = 0; i < len; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
      return out;
    };

    // Helper: generar email base a partir del nombre
    // Usar primer nombre + primer apellido para el email (ej: rubem.cermeno)
    const slugFromName = (n: string) => {
      const cleaned = n
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quitar tildes
        .replace(/[^a-zA-Z0-9\s]/g, '')  // quitar simbolos
        .trim()
        .toLowerCase();
      const parts = cleaned.split(/\s+/).filter(Boolean);
      const first = parts[0] || 'user';
      // buscar primer apellido (segunda palabra). Si no hay, usar primera palabra sola.
      const surname = parts[1] || '';
      const base = surname ? `${first}.${surname}` : first;
      // limitar longitud del slug a 32 caracteres por seguridad
      return base.slice(0, 32);
    };

    // Si no se proporcionó email, generarlo
    let emailLower = email ? String(email).toLowerCase().trim() : '';
    if (!emailLower) {
      const base = slugFromName(name) || `user${Date.now().toString().slice(-4)}`;
      // Asegurar unicidad (añadir sufijo numérico si ya existe)
      let candidateLocal = base;
      let counter = 0;
      // comprobar y aumentar sufijo hasta encontrar uno libre
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const candidate = `${candidateLocal}${counter === 0 ? '' : String(counter)}@metapsis.com`;
        // eslint-disable-next-line no-await-in-loop
        const exists = await User.findOne({ email: candidate });
        if (!exists) {
          emailLower = candidate;
          break;
        }
        counter += 1;
      }
    }

    // Verificar si ya existe usuario con ese email
    const existing = await User.findOne({ email: emailLower });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con ese email'
      });
      return;
    }

    // Si no se envió password, generarla
    const plainPassword = password || generatePassword(10);

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(plainPassword, salt);

    const psychologist = await User.create({
      name,
      email: emailLower,
      password: hashed,
      phone,
      role: 'psicologo'
    });

    const safe = psychologist.toObject();
    delete (safe as any).password;

    // Devolver la contraseña generada en la respuesta (solo una vez)
    res.status(201).json({
      success: true,
      message: 'Psicólogo creado correctamente',
      data: safe,
      generatedPassword: plainPassword
    });
  } catch (error) {
    console.error('Error creating psychologist:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el psicólogo'
    });
  }
};