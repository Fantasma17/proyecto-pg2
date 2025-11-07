import api from '../axios';

export interface QuestionnaireData {
  step1?: any;
  step2?: any;
  step3?: any;
  step4?: any;
  step5?: any;
}

export interface ChatMessageData {
  message: string;
  sender: 'PACIENTE' | 'BOT';
  emotionAnalysis?: any;
}

export interface EmotionAnalysisData {
  emotions: {
    happy: number;
    sad: number;
    angry: number;
    neutral: number;
    fear: number;
    surprise: number;
  };
  dominantEmotion: string;
  notes?: string;
}

export const patientService = {
  // Cuestionario
  saveQuestionnaire: async (data: QuestionnaireData) => {
    const response = await api.post('/patient/questionnaire', data);
    return response.data;
  },

  getQuestionnaire: async () => {
    const response = await api.get('/patient/questionnaire');
    return response.data;
  },

  // Chat
  saveChatMessage: async (data: ChatMessageData) => {
    const response = await api.post('/patient/chat', data);
    return response.data;
  },

  getChatHistory: async () => {
    const response = await api.get('/patient/chat');
    return response.data;
  },

  // Análisis Emocional
  saveEmotionAnalysis: async (data: EmotionAnalysisData) => {
    const response = await api.post('/patient/emotion-analysis', data);
    return response.data;
  },

  getEmotionAnalysis: async () => {
    const response = await api.get('/patient/emotion-analysis');
    return response.data;
  },

  // Perfil
  getProfile: async () => {
    const response = await api.get('/patient/profile');
    return response.data;
  }
};