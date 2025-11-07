// src/lib/chatbot.service.ts
import api from './axios';

export interface ChatMessage {
  id: string;
  sender: 'PACIENTE' | 'BOT';
  message: string;
  timestamp: Date;
  emotionAnalysis?: any;
}

class ChatbotService {
  async sendMessage(message: string, currentEmotion?: any): Promise<string> {
    try {
      // Aquí puedes integrar OpenAI, Gemini, o tu propia IA
      // Por ahora, usaré respuestas terapéuticas predefinidas inteligentes
      
      const response = await this.generateTherapeuticResponse(message, currentEmotion);
      
      // Guardar en backend
      await api.post('/patient/chat', {
        message: response,
        sender: 'BOT',
        emotionAnalysis: currentEmotion
      });

      return response;
    } catch (error) {
      console.error('Error en chatbot:', error);
      return 'Lo siento, estoy teniendo dificultades técnicas. ¿Podrías repetir eso?';
    }
  }

  private async generateTherapeuticResponse(message: string, emotion?: any): Promise<string> {
    const lowerMessage = message.toLowerCase();

    // Respuestas basadas en emociones detectadas
    if (emotion) {
      const dominantEmotion = this.getDominantEmotion(emotion);
      
      if (dominantEmotion === 'sad' && emotion.sad > 60) {
        return 'Noto que podrías estar sintiéndote triste. Es completamente válido sentirse así. ¿Quieres contarme qué está pasando?';
      }
      
      if (dominantEmotion === 'angry' && emotion.angry > 60) {
        return 'Percibo que hay algo que te está molestando. La frustración es una emoción natural. ¿Te gustaría hablar sobre lo que te está afectando?';
      }
      
      if (dominantEmotion === 'happy' && emotion.happy > 70) {
        return '¡Me alegra ver que te sientes bien! Cuéntame, ¿qué ha hecho que te sientas así de positivo hoy?';
      }
    }

    // Respuestas basadas en palabras clave
    if (lowerMessage.includes('ansiedad') || lowerMessage.includes('ansioso') || lowerMessage.includes('nervioso')) {
      return 'La ansiedad puede ser abrumadora. Recuerda que es una respuesta natural de tu cuerpo. ¿Has intentado técnicas de respiración profunda? Inhala por 4 segundos, mantén por 4, exhala por 4.';
    }

    if (lowerMessage.includes('triste') || lowerMessage.includes('deprimido') || lowerMessage.includes('mal')) {
      return 'Lamento que te sientas así. Es importante reconocer estos sentimientos. ¿Hay algo específico que haya desencadenado esta tristeza?';
    }

    if (lowerMessage.includes('estres') || lowerMessage.includes('estresado') || lowerMessage.includes('presión')) {
      return 'El estrés es muy común en estos tiempos. ¿Qué aspectos de tu vida sientes que están generando más presión? Identificarlos es el primer paso.';
    }

    if (lowerMessage.includes('gracias') || lowerMessage.includes('ayuda')) {
      return 'Estoy aquí para ti siempre que lo necesites. Tu bienestar es lo más importante. ¿Hay algo más en lo que pueda apoyarte hoy?';
    }

    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
      return '¡Hola! Me alegra verte por aquí. ¿Cómo te sientes hoy? Estoy aquí para escucharte y apoyarte.';
    }

    // Respuesta por defecto empática
    const defaultResponses = [
      'Entiendo. ¿Podrías contarme un poco más sobre eso?',
      'Gracias por compartir eso conmigo. ¿Cómo te hace sentir?',
      'Es importante que expreses lo que sientes. ¿Qué más te gustaría compartir?',
      'Te escucho. ¿Hay algo específico que te esté preocupando en este momento?'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  private getDominantEmotion(emotions: any): string {
    return Object.entries(emotions).reduce((a: any, b: any) => 
      emotions[a[0]] > emotions[b[0]] ? a : b
    )[0];
  }
}

export const chatbotService = new ChatbotService();