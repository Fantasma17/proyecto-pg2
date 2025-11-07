import { Router } from 'express';
import { body } from 'express-validator';
import {
  createChatSession,
  getChatSessions,
  getChatSessionById,
  sendMessage,
  endChatSession,
  chat
} from '../controllers/chatController';
import { authenticate } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Nueva ruta que expone POST /api/chat
router.post('/', chat);

// Crear sesión de chat
router.post(
  '/',
  authenticate,
  [
    body('patientId').notEmpty().withMessage('El ID del paciente es requerido'),
    body('sessionType').isIn(['ai_chatbot', 'psychologist_chat']).withMessage('Tipo de sesión inválido'),
    handleValidationErrors
  ],
  createChatSession
);

// Obtener sesiones de un paciente
router.get('/patient/:patientId', authenticate, getChatSessions);

// Obtener sesión por ID
router.get('/:id', authenticate, getChatSessionById);

// Enviar mensaje
router.post(
  '/message',
  authenticate,
  [
    body('sessionId').notEmpty().withMessage('El ID de la sesión es requerido'),
    body('content').notEmpty().withMessage('El contenido del mensaje es requerido'),
    body('senderType').isIn(['patient', 'psychologist', 'ai']).withMessage('Tipo de remitente inválido'),
    handleValidationErrors
  ],
  sendMessage
);

// Finalizar sesión
router.put('/:id/end', authenticate, endChatSession);

export default router;