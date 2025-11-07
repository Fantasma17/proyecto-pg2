import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export interface EmotionResult {
  happy: number;
  sad: number;
  angry: number;
  neutral: number;
  fear: number;
  surprise: number;
}

class EmotionDetectionService {
  private detector: faceLandmarksDetection.FaceLandmarksDetector | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Cargar el modelo de detección facial
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      
      // Configuración con tipo literal explícito
      const detectorConfig = {
        runtime: 'tfjs' as 'tfjs',
        refineLandmarks: true,
      };

      this.detector = await faceLandmarksDetection.createDetector(
        model,
        detectorConfig
      );

      this.isInitialized = true;
      console.log('✅ Modelo de detección emocional cargado');
    } catch (error) {
      console.error('❌ Error cargando modelo:', error);
      throw error;
    }
  }

  async detectEmotion(videoElement: HTMLVideoElement): Promise<EmotionResult | null> {
    if (!this.isInitialized || !this.detector) {
      await this.initialize();
    }

    try {
      const faces = await this.detector!.estimateFaces(videoElement);

      if (faces.length === 0) {
        return null;
      }

      // Analizar expresiones faciales basadas en landmarks
      const face = faces[0];
      const emotions = this.analyzeFacialExpression(face.keypoints);

      return emotions;
    } catch (error) {
      console.error('Error detectando emoción:', error);
      return null;
    }
  }

  private analyzeFacialExpression(keypoints: faceLandmarksDetection.Keypoint[]): EmotionResult {
    // Análisis simplificado basado en puntos clave faciales
    // En producción, usarías un modelo entrenado específicamente para emociones
    
    // Puntos clave importantes:
    // - Boca: keypoints 61, 291, 0, 17
    // - Ojos: keypoints 33, 133, 362, 263
    // - Cejas: keypoints 70, 63, 105, 66, 107, 336, 296, 334, 293, 300

    const mouthPoints = [
      keypoints[61] || keypoints[0], 
      keypoints[291] || keypoints[0], 
      keypoints[0], 
      keypoints[17] || keypoints[0]
    ];
    const eyePoints = [
      keypoints[33] || keypoints[0], 
      keypoints[133] || keypoints[0], 
      keypoints[362] || keypoints[0], 
      keypoints[263] || keypoints[0]
    ];
    const eyebrowPoints = [
      keypoints[70] || keypoints[0], 
      keypoints[63] || keypoints[0], 
      keypoints[105] || keypoints[0], 
      keypoints[66] || keypoints[0]
    ];

    // Calcular distancias para determinar expresiones
    const mouthOpenness = this.calculateDistance(mouthPoints[0], mouthPoints[1]);
    const eyeOpenness = this.calculateDistance(eyePoints[0], eyePoints[1]);
    const eyebrowHeight = eyebrowPoints[0].y || 0;

    // Algoritmo simplificado de clasificación
    let emotions: EmotionResult = {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 50,
      fear: 0,
      surprise: 0
    };

    // Felicidad: boca abierta hacia arriba
    if (mouthOpenness > 15) {
      emotions.happy = Math.min(mouthOpenness * 3, 100);
      emotions.neutral = Math.max(0, 50 - emotions.happy);
    }

    // Tristeza: boca hacia abajo, cejas bajas
    if (mouthOpenness < 5 && eyebrowHeight > 100) {
      emotions.sad = 60;
      emotions.neutral = 20;
    }

    // Sorpresa: ojos muy abiertos, boca abierta
    if (eyeOpenness > 20 && mouthOpenness > 20) {
      emotions.surprise = 70;
      emotions.neutral = 10;
    }

    // Enojo: cejas juntas y bajas
    if (eyebrowHeight < 80) {
      emotions.angry = 50;
      emotions.neutral = 20;
    }

    // Normalizar valores
    const total = Object.values(emotions).reduce((a, b) => a + b, 0);
    if (total > 0) {
      Object.keys(emotions).forEach(key => {
        emotions[key as keyof EmotionResult] = Math.round((emotions[key as keyof EmotionResult] / total) * 100);
      });
    }

    return emotions;
  }

  private calculateDistance(point1: faceLandmarksDetection.Keypoint, point2: faceLandmarksDetection.Keypoint): number {
    const dx = (point1.x || 0) - (point2.x || 0);
    const dy = (point1.y || 0) - (point2.y || 0);
    return Math.sqrt(dx * dx + dy * dy);
  }

  getDominantEmotion(emotions: EmotionResult): string {
    return Object.entries(emotions).reduce((a, b) => 
      emotions[a[0] as keyof EmotionResult] > emotions[b[0] as keyof EmotionResult] ? a : b
    )[0];
  }
}

export const emotionDetectionService = new EmotionDetectionService();