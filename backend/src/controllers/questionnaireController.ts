import { Request, Response } from 'express';
import Questionnaire from '../models/Questionnaire';

// Crear cuestionario
export const createQuestionnaire = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, questionnaireType, title, description, assignedBy } = req.body;

    const questionnaire = await Questionnaire.create({
      patientId,
      questionnaireType,
      title,
      description,
      assignedBy,
      status: 'pending',
      responses: []
    });

    res.status(201).json({
      message: 'Cuestionario creado exitosamente',
      questionnaire
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear cuestionario', error: error.message });
  }
};

// Obtener cuestionarios de un paciente
export const getQuestionnairesByPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const { status } = req.query;

    const filter: any = { patientId };
    if (status) filter.status = status;

    const questionnaires = await Questionnaire.find(filter)
      .populate('patientId', 'firstName lastName')
      .populate('assignedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: questionnaires.length,
      questionnaires
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener cuestionarios', error: error.message });
  }
};

// Obtener cuestionario por ID
export const getQuestionnaireById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findById(id)
      .populate('patientId', 'firstName lastName email')
      .populate('assignedBy', 'firstName lastName');

    if (!questionnaire) {
      res.status(404).json({ message: 'Cuestionario no encontrado' });
      return;
    }

    res.status(200).json({ questionnaire });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener cuestionario', error: error.message });
  }
};

// Actualizar respuestas del cuestionario
export const updateQuestionnaireResponses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { responses } = req.body;

    const questionnaire = await Questionnaire.findById(id);
    if (!questionnaire) {
      res.status(404).json({ message: 'Cuestionario no encontrado' });
      return;
    }

    questionnaire.responses = responses;
    questionnaire.status = 'in_progress';
    if (!questionnaire.startedAt) {
      questionnaire.startedAt = new Date();
    }

    await questionnaire.save();

    res.status(200).json({
      message: 'Respuestas actualizadas exitosamente',
      questionnaire
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al actualizar respuestas', error: error.message });
  }
};

// Completar cuestionario
export const completeQuestionnaire = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { responses, score } = req.body;

    const questionnaire = await Questionnaire.findByIdAndUpdate(
      id,
      {
        responses,
        score,
        status: 'completed',
        completedAt: new Date()
      },
      { new: true }
    );

    if (!questionnaire) {
      res.status(404).json({ message: 'Cuestionario no encontrado' });
      return;
    }

    res.status(200).json({
      message: 'Cuestionario completado exitosamente',
      questionnaire
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al completar cuestionario', error: error.message });
  }
};

// Eliminar cuestionario
export const deleteQuestionnaire = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findByIdAndDelete(id);
    if (!questionnaire) {
      res.status(404).json({ message: 'Cuestionario no encontrado' });
      return;
    }

    res.status(200).json({ message: 'Cuestionario eliminado exitosamente' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al eliminar cuestionario', error: error.message });
  }
};