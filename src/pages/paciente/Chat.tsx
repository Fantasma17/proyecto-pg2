import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, Brain, MessageCircle, ClipboardList, User, LogOut, Camera, Smile, Meh, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import metapsisLogo from "@/assets/metapsis-logo.png";
import { EmotionCamera } from "@/components/EmotionCamera";
import { initializeEmotionDetector, analyzeEmotionFromVideo, cleanupDetector, EmotionScore } from "@/utils/emotionDetection";
import "./Chat.css";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

const PatientChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "¡Hola! Soy tu asistente terapéutico. Estoy aquí para escucharte y apoyarte. ¿Cómo te sientes hoy?",
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectorReady, setIsDetectorReady] = useState(false);
  const [emotion, setEmotion] = useState<string>('neutral');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [emotionData, setEmotionData] = useState<EmotionScore[]>([
    { emotion: "Neutral", percentage: 100, icon: "Meh", color: "muted" },
    { emotion: "Feliz", percentage: 0, icon: "Smile", color: "success" },
    { emotion: "Triste", percentage: 0, icon: "Frown", color: "warning" },
    { emotion: "Ansioso", percentage: 0, icon: "Frown", color: "destructive" }
  ]);
  const analysisIntervalRef = useRef<number | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle camera
  useEffect(() => {
    if (cameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
      cleanupDetector();
    };
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      toast({
        title: "Iniciando cámara...",
        description: "Cargando modelo de detección de emociones",
      });

      // Initialize emotion detector
      if (!isDetectorReady) {
        await initializeEmotionDetector();
        setIsDetectorReady(true);
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        
        toast({
          title: "Cámara activada",
          description: "Analizando emociones en tiempo real",
        });
        
        // Start emotion analysis
        analyzeEmotions();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Error",
        description: "No se pudo acceder a la cámara. Verifica los permisos.",
        variant: "destructive"
      });
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Reset emotions
    setEmotionData([
      { emotion: "Neutral", percentage: 100, icon: "Meh", color: "muted" },
      { emotion: "Feliz", percentage: 0, icon: "Smile", color: "success" },
      { emotion: "Triste", percentage: 0, icon: "Frown", color: "warning" },
      { emotion: "Ansioso", percentage: 0, icon: "Frown", color: "destructive" }
    ]);
  };

  const analyzeEmotions = () => {
    // Clear any existing interval
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
    
    // Analyze every 2 seconds
    analysisIntervalRef.current = window.setInterval(async () => {
      if (cameraActive && videoRef.current && isDetectorReady) {
        try {
          const emotions = await analyzeEmotionFromVideo(videoRef.current);
          setEmotionData(emotions);
        } catch (error) {
          console.error('Error analyzing emotions:', error);
        }
      }
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call the edge function
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Error al comunicarse con el asistente');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let botText = "";
      const botMessageId = updatedMessages.length + 1;

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  botText += content;
                  setMessages(prev => {
                    const existing = prev.find(m => m.id === botMessageId);
                    if (existing) {
                      return prev.map(m => m.id === botMessageId ? { ...m, text: botText } : m);
                    }
                    return [...prev, {
                      id: botMessageId,
                      sender: "bot",
                      text: botText,
                      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                    }];
                  });
                }
              } catch (e) {
                console.error('Error parsing SSE:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="patient-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={metapsisLogo} alt="Metapsis" className="sidebar-logo" />
          <h2 className="sidebar-title">Metapsis</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/paciente/dashboard" className="nav-item">
            <Brain size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/paciente/cuestionario" className="nav-item">
            <ClipboardList size={20} />
            <span>Cuestionario</span>
          </Link>
          <Link to="/paciente/chat" className="nav-item active">
            <MessageCircle size={20} />
            <span>Chat</span>
          </Link>
          <Link to="/paciente/perfil" className="nav-item">
            <User size={20} />
            <span>Mi Perfil</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/login" className="nav-item logout">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <header className="chat-header">
          <div>
            <h1 className="header-title">Chat Terapéutico</h1>
            <p className="header-subtitle">Tu asistente está aquí para escucharte</p>
          </div>
        </header>

        <div className="chat-layout">
          {/* Chat Messages */}
          <div className="chat-messages-container">
            <Card className="chat-card">
              <div className="messages-list">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.sender === "user" ? "message-user" : "message-bot"}`}
                  >
                    <div className="message-bubble">
                      <p className="message-text">{message.text}</p>
                      <span className="message-timestamp">{message.timestamp}</span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message message-bot">
                    <div className="message-bubble">
                      <p className="message-text">Escribiendo...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-container">
                <Input
                  placeholder="Escribe tu mensaje aquí..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="chat-input"
                />
                <Button onClick={handleSendMessage} className="send-button">
                  <Send size={20} />
                </Button>
              </div>
            </Card>
          </div>

          {/* Emotion Analysis Sidebar */}
          <aside className="emotion-sidebar">
            <Card className="emotion-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera size={20} />
                  Análisis Emocional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="camera-preview">
                  {cameraActive ? (
                    <div className="camera-active">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="camera-video"
                      />
                      <div className="camera-overlay">
                        <Camera size={24} className="camera-icon-small" />
                        <p className="text-xs">Analizando emociones...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="camera-inactive">
                      <Camera size={48} className="camera-icon" />
                      <p className="text-sm text-muted-foreground">Cámara desactivada</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCameraActive(!cameraActive)}
                    className="mt-2 w-full"
                  >
                    {cameraActive ? "Desactivar" : "Activar"} Cámara
                  </Button>
                </div>

                {cameraActive && (
                  <div className="emotion-analysis">
                    <h4 className="text-sm font-semibold mb-3">Emociones Detectadas (ML)</h4>
                    <div className="space-y-3">
                      {emotionData.map((item, index) => {
                        const IconComponent = item.icon === "Smile" ? Smile : item.icon === "Meh" ? Meh : Frown;
                        return (
                          <div key={index} className="emotion-item">
                            <div className="emotion-header">
                              <div className="emotion-label">
                                <IconComponent size={16} className={`emotion-icon-${item.color}`} />
                                <span className="text-sm font-medium">{item.emotion}</span>
                              </div>
                              <span className="emotion-percentage">{item.percentage}%</span>
                            </div>
                            <Progress value={item.percentage} className="emotion-progress" />
                          </div>
                        );
                      })}
                    </div>

                    <div className="emotion-summary">
                      <p className="text-xs text-muted-foreground">
                        💡 Tu estado emocional predominante es <strong>{emotionData[0]?.emotion}</strong>.
                        El análisis utiliza TensorFlow.js para detección facial en tiempo real.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="tips-card">
              <CardHeader>
                <CardTitle className="text-base">💭 Tip del Día</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Recuerda que está bien pedir ayuda. Compartir tus sentimientos
                  es el primer paso hacia el bienestar emocional.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PatientChat;
