import { Request, Response } from 'express';
import ChatSession from '../models/ChatSession';

// Nota: No instanciamos el cliente de OpenAI en el scope global para evitar errores si la variable de entorno falta.
// Usamos fetch de forma perezosa dentro del handler.
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

// Crear nueva sesión de chat
export const createChatSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, psychologistId, sessionType } = req.body;

    const session = await ChatSession.create({
      patientId,
      psychologistId,
      sessionType,
      status: 'active',
      messages: []
    });

    res.status(201).json({
      message: 'Sesión de chat creada exitosamente',
      session
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear sesión', error: error.message });
  }
};

// Obtener sesiones de chat de un paciente
export const getChatSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;

    const sessions = await ChatSession.find({ patientId })
      .populate('patientId', 'firstName lastName email')
      .populate('psychologistId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: sessions.length,
      sessions
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener sesiones', error: error.message });
  }
};

// Obtener una sesión específica
export const getChatSessionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const session = await ChatSession.findById(id)
      .populate('patientId', 'firstName lastName email')
      .populate('psychologistId', 'firstName lastName');

    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    res.status(200).json({ session });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener sesión', error: error.message });
  }
};

// Enviar mensaje (con IA si es chatbot)
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, senderId, senderType, content } = req.body;

    const session = await ChatSession.findById(sessionId);
    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    // Agregar mensaje del usuario
    const userMessage = {
      senderId,
      senderType,
      content,
      timestamp: new Date(),
      isRead: false
    };

    session.messages.push(userMessage);
    await session.save();

    // Si es chatbot AI, generar respuesta
    if (session.sessionType === 'ai_chatbot') {
      try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          console.warn('OPENAI_API_KEY no configurada — la IA no responderá.');
          res.status(200).json({
            message: 'Mensaje enviado, pero la IA no está configurada en el servidor.',
            userMessage
          });
          return;
        }

        const model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
        const openaiBody = {
          model,
          messages: [
            {
              role: 'system',
              content:
                'Eres un asistente de salud mental empático y profesional. Proporciona apoyo emocional y orientación, pero recuerda que no eres un sustituto de un profesional de la salud mental. Sé comprensivo, escucha activamente y ofrece recursos cuando sea apropiado.'
            },
            ...session.messages.slice(-10).map((msg: any) => ({
              role: msg.senderType === 'ai' ? 'assistant' : 'user',
              content: msg.content
            }))
          ],
          max_tokens: Number(process.env.OPENAI_MAX_TOKENS || 1000)
        };

        const openaiRes = await fetch(OPENAI_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify(openaiBody)
        });

        if (!openaiRes.ok) {
          const errText = await openaiRes.text();
          console.error('OpenAI error:', errText);
          throw new Error(errText || 'OpenAI API error');
        }

        const completion = await openaiRes.json();
        const aiResponse =
          completion?.choices?.[0]?.message?.content ||
          completion?.choices?.[0]?.text ||
          'Lo siento, no pude generar una respuesta.';

        // Agregar respuesta de la IA
        const aiMessage = {
          senderType: 'ai' as const,
          content: aiResponse,
          timestamp: new Date(),
          isRead: false
        };

        session.messages.push(aiMessage);
        await session.save();

        res.status(200).json({
          message: 'Mensaje enviado exitosamente',
          userMessage,
          aiMessage
        });
      } catch (aiError: any) {
        console.error('Error con OpenAI:', aiError);
        res.status(200).json({
          message: 'Mensaje enviado, pero hubo un error con la IA',
          userMessage,
          aiError: aiError.message
        });
      }
    } else {
      res.status(200).json({
        message: 'Mensaje enviado exitosamente',
        userMessage
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error al enviar mensaje', error: error.message });
  }
};

// Finalizar sesión
export const endChatSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { summary } = req.body;

    const session = await ChatSession.findByIdAndUpdate(
      id,
      {
        status: 'completed',
        endTime: new Date(),
        summary
      },
      { new: true }
    );

    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    res.status(200).json({
      message: 'Sesión finalizada exitosamente',
      session
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al finalizar sesión', error: error.message });
  }
};

// Nuevo controlador que llama al API de OpenAI Chat Completions. Usa fetch (Node 18+) y envía la emoción en el prompt para contextualizar la respuesta.
export const chat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, emotion } = req.body;
    if (!message) {
      res.status(400).json({ success: false, message: 'message es requerido' });
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
    if (!apiKey) {
      // Respuesta clara cuando la clave no está configurada
      res.status(503).json({
        success: false,
        message:
          'OPENAI_API_KEY no está configurada en el servidor. ' +
          'Define la variable de entorno OPENAI_API_KEY en backend/.env y reinicia el servidor.'
      });
      return;
    }

    // Incluir emoción en el system prompt para que el asistente responda con empatía
    const systemPrompt = `Eres un asistente empático. El usuario podría estar en un estado emocional: ${emotion || 'neutral'}. Responde teniendo en cuenta esa emoción.`;

    const body = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: Number(process.env.OPENAI_MAX_TOKENS || 800)
    };

    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error:', errText);
      res.status(500).json({ success: false, message: 'Error en OpenAI', detail: errText });
      return;
    }

    const data = await response.json();
    const assistant = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';

    res.json({ success: true, data: assistant });
  } catch (error) {
    console.error('Error en chat controller:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};