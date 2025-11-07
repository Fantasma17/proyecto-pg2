import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import chatRoutes from './chatRoutes';
import questionnaireRoutes from './questionnaireRoutes';

const router = Router();

// Rutas principales
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/chats', chatRoutes);
router.use('/questionnaires', questionnaireRoutes);

export default router;