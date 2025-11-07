import { Router } from 'express';
import {
  getAllUsers,
  getCurrentUser,
  getUserById,
  getPatientsByPsychologist,
  getAllPsychologists,
  getMyPatients,
  assignPsychologist,
  updateProfile,
  deleteUser,
  changePassword,
  createAdmin,
  createPsychologist
} from '../controllers/userController';
import { protect, authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public endpoint to create admin once (remove or protect after use)
router.post('/admin/create', createAdmin);

// Crear psicólogo (solo admin)
router.post(
  '/psychologists',
  authenticate,
  authorize('admin'),
  createPsychologist
);

// Ruta de depuración (solo en development) — permite crear psicólogo sin autenticación
if (process.env.NODE_ENV !== 'production') {
  router.post('/psychologists/debug', createPsychologist);
}

// Authenticated routes
router.get('/', protect, getAllUsers);
router.get('/me', protect, getCurrentUser);
router.get('/:id', protect, getUserById);
router.get('/psychologist/:psychologistId/patients', protect, getPatientsByPsychologist);
router.get('/psychologists/all', protect, getAllPsychologists);
router.get('/my/patients', protect, getMyPatients);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.put('/assign-psychologist', protect, assignPsychologist);
router.delete('/:id', protect, deleteUser);

export default router;