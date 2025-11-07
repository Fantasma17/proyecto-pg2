import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export interface EmotionScore {
  emotion: string;
  percentage: number;
  icon: string;
  color: string;
}

let detector: faceLandmarksDetection.FaceLandmarksDetector | null = null;

export const initializeEmotionDetector = async () => {
  try {
    await tf.ready();
    await tf.setBackend('webgl');
    
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig = {
      runtime: 'mediapipe',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      refineLandmarks: true,
    };
    
    detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    console.log('✓ Emotion detector initialized successfully');
    return detector;
  } catch (error) {
    console.error('Error initializing emotion detector:', error);
    throw error;
  }
};

const calculateEmotion = (landmarks: any): EmotionScore[] => {
  if (!landmarks || landmarks.length === 0) {
    return getDefaultEmotions();
  }

  const keypoints = landmarks[0].keypoints;
  
  // Analyze facial features
  const leftEyeY = (keypoints[33].y + keypoints[133].y) / 2;
  const rightEyeY = (keypoints[263].y + keypoints[362].y) / 2;
  const mouthTopY = keypoints[13].y;
  const mouthBottomY = keypoints[14].y;
  const leftMouthCorner = keypoints[61];
  const rightMouthCorner = keypoints[291];
  const mouthCenter = keypoints[13];
  
  // Calculate metrics
  const eyeOpenness = Math.abs(leftEyeY - rightEyeY);
  const mouthOpenness = Math.abs(mouthBottomY - mouthTopY);
  const smileIntensity = (leftMouthCorner.y + rightMouthCorner.y) / 2 - mouthCenter.y;
  
  // Calculate eyebrow position (stress indicator)
  const leftBrowY = keypoints[70].y;
  const rightBrowY = keypoints[300].y;
  const browTension = Math.abs(leftBrowY - leftEyeY) + Math.abs(rightBrowY - rightEyeY);
  
  // Emotion scoring
  let happyScore = 0;
  let neutralScore = 30;
  let sadScore = 0;
  let anxiousScore = 0;
  
  // Happy detection (smile)
  if (smileIntensity > 2) {
    happyScore += 40;
    neutralScore -= 20;
  }
  if (mouthOpenness > 5 && smileIntensity > 0) {
    happyScore += 20;
  }
  
  // Sad detection (mouth corners down)
  if (smileIntensity < -2) {
    sadScore += 40;
    neutralScore -= 15;
  }
  
  // Anxious detection (tension in eyebrows, wider eyes)
  if (browTension < 20) {
    anxiousScore += 30;
    neutralScore -= 10;
  }
  if (eyeOpenness > 15) {
    anxiousScore += 20;
  }
  
  // Normalize scores
  const total = happyScore + neutralScore + sadScore + anxiousScore;
  if (total > 0) {
    happyScore = Math.round((happyScore / total) * 100);
    neutralScore = Math.round((neutralScore / total) * 100);
    sadScore = Math.round((sadScore / total) * 100);
    anxiousScore = Math.round((anxiousScore / total) * 100);
  }
  
  return [
    { emotion: "Feliz", percentage: happyScore, icon: "Smile", color: "success" },
    { emotion: "Neutral", percentage: neutralScore, icon: "Meh", color: "muted" },
    { emotion: "Triste", percentage: sadScore, icon: "Frown", color: "warning" },
    { emotion: "Ansioso", percentage: anxiousScore, icon: "Frown", color: "destructive" }
  ].sort((a, b) => b.percentage - a.percentage);
};

const getDefaultEmotions = (): EmotionScore[] => {
  return [
    { emotion: "Neutral", percentage: 100, icon: "Meh", color: "muted" },
    { emotion: "Feliz", percentage: 0, icon: "Smile", color: "success" },
    { emotion: "Triste", percentage: 0, icon: "Frown", color: "warning" },
    { emotion: "Ansioso", percentage: 0, icon: "Frown", color: "destructive" }
  ];
};

export const analyzeEmotionFromVideo = async (
  videoElement: HTMLVideoElement
): Promise<EmotionScore[]> => {
  try {
    if (!detector) {
      console.warn('Detector not initialized');
      return getDefaultEmotions();
    }

    const faces = await detector.estimateFaces(videoElement);
    
    if (!faces || faces.length === 0) {
      console.log('No face detected');
      return getDefaultEmotions();
    }

    return calculateEmotion(faces);
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    return getDefaultEmotions();
  }
};

export const cleanupDetector = () => {
  if (detector) {
    detector = null;
  }
};
