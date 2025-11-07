import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile, debugAdmins } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Registro
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('firstName').notEmpty().withMessage('El nombre es requerido'),
    body('lastName').notEmpty().withMessage('El apellido es requerido'),
    body('role').optional().isIn(['patient', 'psychologist', 'admin']).withMessage('Rol inválido'),
    handleValidationErrors
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    handleValidationErrors
  ],
  login
);

// Obtener perfil (requiere autenticación)
router.get('/profile', authenticate, getProfile);

// Actualizar perfil (requiere autenticación)
router.put('/profile', authenticate, updateProfile);

// Ruta temporal de depuración: lista admins (solo en desarrollo)
router.get('/debug/admins', debugAdmins);

export default router;