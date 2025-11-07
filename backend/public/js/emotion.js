(async () => {
  const video = document.getElementById('video');
  const emotionSpan = document.getElementById('emotion');

  // Ruta donde colocarás los modelos: public/models
  const MODEL_URL = '/models';

  // Cargar modelos necesarios
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

  // Iniciar cámara
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
  } catch (err) {
    console.error('No se pudo acceder a la cámara:', err);
    emotionSpan.textContent = 'cámara no disponible';
    return;
  }

  window.currentEmotion = 'neutral';

  video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.appendChild(canvas);
    const displaySize = { width: video.width || 320, height: video.height || 240 };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
      if (detections && detections.length > 0) {
        const expr = detections[0].expressions;
        // Encontrar la expresión con mayor probabilidad
        let best = 'neutral';
        let bestVal = 0;
        for (const [k, v] of Object.entries(expr)) {
          if (v > bestVal) { best = k; bestVal = v; }
        }
        emotionSpan.textContent = best + ' (' + (bestVal * 100).toFixed(0) + '%)';
        window.currentEmotion = best;
      } else {
        emotionSpan.textContent = 'no detectado';
        window.currentEmotion = 'neutral';
      }
    }, 800);
  });
})();
