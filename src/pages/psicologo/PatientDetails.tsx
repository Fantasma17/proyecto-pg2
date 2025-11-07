import { Link, useParams } from "react-router-dom";
import { Users, UserPlus, Settings, LogOut, ArrowLeft, Calendar, MessageCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./PatientDetails.css";

const PsychologistPatientDetails = () => {
  const { id } = useParams();

  // Mock patient data
  const patient = {
    id: id || "1",
    name: "Ana López García",
    age: 28,
    email: "ana.lopez@metapsis.com",
    phone: "+502 1234 5678",
    registrationDate: "15 de Enero, 2025",
    lastSession: "Hace 2 días",
    totalSessions: 8,
    emotionalState: "Ansioso",
    status: "active"
  };

  const questionnaire = {
    supportReason: "Ansiedad laboral y problemas de sueño. Busca herramientas para manejar el estrés diario.",
    emotionalState: "Regular",
    previousTherapy: "Sí, hace tiempo",
    goals: "Reducir mi ansiedad, mejorar mi autoestima, aprender a manejar el estrés",
    communicationStyle: "Empático y cálido",
    topicsInterest: "Mindfulness, técnicas de respiración, manejo de emociones"
  };

  const chatHistory = [
    { date: "20 Ene 2025", summary: "Sesión sobre manejo de ansiedad laboral", duration: "35 min" },
    { date: "18 Ene 2025", summary: "Técnicas de respiración y mindfulness", duration: "28 min" },
    { date: "15 Ene 2025", summary: "Primera sesión - evaluación inicial", duration: "40 min" }
  ];

  const emotionData = [
    { emotion: "Feliz", percentage: 25, color: "success" },
    { emotion: "Neutral", percentage: 35, color: "muted" },
    { emotion: "Ansioso", percentage: 30, color: "warning" },
    { emotion: "Triste", percentage: 10, color: "destructive" }
  ];

  return (
    <div className="psychologist-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={metapsisLogo} alt="Metapsis" className="sidebar-logo" />
          <h2 className="sidebar-title">Metapsis</h2>
          <p className="sidebar-role">Psicólogo</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/psicologo/dashboard" className="nav-item">
            <Users size={20} />
            <span>Mis Pacientes</span>
          </Link>
          <Link to="/psicologo/crear-paciente" className="nav-item">
            <UserPlus size={20} />
            <span>Crear Paciente</span>
          </Link>
          <div className="nav-item" onClick={() => alert("Funcionalidad próximamente")}>
            <Settings size={20} />
            <span>Configuración</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <Link to="/login" className="nav-item logout">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-with-back">
            <Link to="/psicologo/dashboard">
              <Button variant="ghost" size="sm" className="back-button">
                <ArrowLeft size={18} className="mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="header-title">{patient.name}</h1>
              <p className="header-subtitle">{patient.age} años • {patient.email}</p>
            </div>
          </div>
          <Badge variant={patient.status === "active" ? "default" : "secondary"} className="status-badge">
            {patient.status === "active" ? "Activo" : "Inactivo"}
          </Badge>
        </header>

        {/* Stats Overview */}
        <div className="stats-grid">
          <Card className="stat-card-small">
            <CardContent className="pt-6">
              <div className="stat-content">
                <MessageCircle className="stat-icon" size={24} />
                <div>
                  <p className="stat-label">Sesiones</p>
                  <p className="stat-value">{patient.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-small">
            <CardContent className="pt-6">
              <div className="stat-content">
                <Calendar className="stat-icon" size={24} />
                <div>
                  <p className="stat-label">Última Sesión</p>
                  <p className="stat-value-small">{patient.lastSession}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-small">
            <CardContent className="pt-6">
              <div className="stat-content">
                <TrendingUp className="stat-icon" size={24} />
                <div>
                  <p className="stat-label">Progreso</p>
                  <p className="stat-value">75%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="questionnaire" className="patient-tabs">
          <TabsList className="tabs-list">
            <TabsTrigger value="questionnaire">Cuestionario</TabsTrigger>
            <TabsTrigger value="emotions">Análisis Emocional</TabsTrigger>
            <TabsTrigger value="history">Historial de Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="questionnaire" className="tab-content">
            <Card className="detail-card">
              <CardHeader>
                <CardTitle>Cuestionario Inicial</CardTitle>
                <CardDescription>Información recopilada del paciente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="detail-item">
                  <h4 className="detail-title">¿Por qué busca apoyo emocional?</h4>
                  <p className="detail-text">{questionnaire.supportReason}</p>
                </div>
                <div className="detail-item">
                  <h4 className="detail-title">Estado Emocional Inicial</h4>
                  <Badge variant="outline">{questionnaire.emotionalState}</Badge>
                </div>
                <div className="detail-item">
                  <h4 className="detail-title">Experiencia Previa en Terapia</h4>
                  <p className="detail-text">{questionnaire.previousTherapy}</p>
                </div>
                <div className="detail-item">
                  <h4 className="detail-title">Objetivos del Paciente</h4>
                  <p className="detail-text">{questionnaire.goals}</p>
                </div>
                <div className="detail-item">
                  <h4 className="detail-title">Estilo de Comunicación Preferido</h4>
                  <p className="detail-text">{questionnaire.communicationStyle}</p>
                </div>
                <div className="detail-item">
                  <h4 className="detail-title">Temas de Interés</h4>
                  <p className="detail-text">{questionnaire.topicsInterest}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emotions" className="tab-content">
            <Card className="detail-card">
              <CardHeader>
                <CardTitle>Análisis Emocional</CardTitle>
                <CardDescription>Distribución de emociones detectadas durante las sesiones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {emotionData.map((item, index) => (
                  <div key={index} className="emotion-analysis-item">
                    <div className="emotion-header-detail">
                      <span className="emotion-name">{item.emotion}</span>
                      <span className="emotion-percentage">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="emotion-progress-detail" />
                  </div>
                ))}
                <div className="emotion-insight">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Insight:</strong> El paciente muestra niveles elevados de ansiedad (30%).
                    Se recomienda continuar con técnicas de respiración y mindfulness.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="tab-content">
            <Card className="detail-card">
              <CardHeader>
                <CardTitle>Historial de Conversaciones</CardTitle>
                <CardDescription>Resumen de sesiones anteriores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {chatHistory.map((session, index) => (
                  <div key={index} className="history-item">
                    <div className="history-header">
                      <Calendar size={16} className="history-icon" />
                      <span className="history-date">{session.date}</span>
                      <Badge variant="secondary" className="history-duration">{session.duration}</Badge>
                    </div>
                    <p className="history-summary">{session.summary}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PsychologistPatientDetails;
