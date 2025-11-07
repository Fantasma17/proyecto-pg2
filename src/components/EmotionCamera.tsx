import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

type Props = {
  onEmotionChange?: (emotion: string) => void;
  width?: number;
  height?: number;
};

// Si el backend está en otro origen, define en el frontend .env: VITE_API_URL=http://localhost:5000
// Cargaremos los modelos desde `${VITE_API_URL}/models`. Si no está definido, usamos '/models'.
const MODEL_URL =
  (import.meta.env.VITE_API_URL
    ? `${(import.meta.env.VITE_API_URL as string).replace(/\/$/, '')}/models`
    : '/models');

const EmotionCameraInner: React.FC<Props> = ({ onEmotionChange, width = 320, height = 240 }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [running, setRunning] = useState(false);
  const [emotion, setEmotion] = useState<string>('neutral');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // cleanup al desmontar
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
    } catch (err) {
      console.error('Error cargando modelos face-api:', err);
      throw err;
    }
  };

  const startCamera = async () => {
    if (running) return;
    try {
      await loadModels();
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width, height }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setRunning(true);

      // Start detection loop
      intervalRef.current = window.setInterval(async () => {
        if (!videoRef.current) return;
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detections && detections.length > 0 && detections[0].expressions) {
          const expr = detections[0].expressions;
          let best = 'neutral';
          let bestVal = 0;
          for (const [k, v] of Object.entries(expr)) {
            if ((v as number) > bestVal) {
              best = k;
              bestVal = v as number;
            }
          }
          setEmotion(best);
          onEmotionChange && onEmotionChange(best);
        } else {
          setEmotion('neutral');
          onEmotionChange && onEmotionChange('neutral');
        }
      }, 700);
    } catch (err) {
      console.error('No se pudo iniciar cámara / detectar:', err);
      setRunning(false);
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const stream = videoRef.current?.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
    setRunning(false);
    setEmotion('neutral');
    onEmotionChange && onEmotionChange('neutral');
  };

  const toggle = () => {
    if (running) stopCamera();
    else startCamera();
  };

  return (
    <div style={{ width }}>
      <div style={{ border: '1px solid #e6e6e6', padding: 8, borderRadius: 8, textAlign: 'center' }}>
        <video
          ref={videoRef}
          width={width}
          height={height}
          style={{ background: '#000', display: 'block', margin: '0 auto', borderRadius: 6 }}
          muted
        />
        <div style={{ marginTop: 8 }}>
          <button onClick={toggle} style={{ padding: '6px 10px' }}>
            {running ? 'Detener Cámara' : 'Activar Cámara'}
          </button>
        </div>
        <div style={{ marginTop: 6, fontSize: 13 }}>Emoción: <strong>{emotion}</strong></div>
      </div>
    </div>
  );
};

// Export por defecto y export nombrado (compatibilidad con import { EmotionCamera } ...)
export const EmotionCamera = EmotionCameraInner;
export default EmotionCameraInner;
