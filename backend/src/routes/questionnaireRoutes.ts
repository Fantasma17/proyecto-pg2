import { Router } from 'express';
import { body } from 'express-validator';
import {
  createQuestionnaire,
  getQuestionnairesByPatient,
  getQuestionnaireById,
  updateQuestionnaireResponses,
  completeQuestionnaire,
  deleteQuestionnaire
} from '../controllers/questionnaireController';
import { authenticate, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Crear cuestionario (psicólogo o admin)
router.post(
  '/',
  authenticate,
  authorize('psychologist', 'admin'),
  [
    body('patientId').notEmpty().withMessage('El ID del paciente es requerido'),
    body('questionnaireType').isIn(['initial_assessment', 'phq9', 'gad7', 'custom']).withMessage('Tipo de cuestionario inválido'),
    body('title').notEmpty().withMessage('El título es requerido'),
    handleValidationErrors
  ],
  createQuestionnaire
);

// Obtener cuestionarios de un paciente
router.get('/patient/:patientId', authenticate, getQuestionnairesByPatient);

// Obtener cuestionario por ID
router.get('/:id', authenticate, getQuestionnaireById);

// Actualizar respuestas
router.put('/:id/responses', authenticate, updateQuestionnaireResponses);

// Completar cuestionario
router.put('/:id/complete', authenticate, completeQuestionnaire);

// Eliminar cuestionario (psicólogo o admin)
router.delete('/:id', authenticate, authorize('psychologist', 'admin'), deleteQuestionnaire);

export default router;