import { Link } from "react-router-dom";
import { Brain, MessageCircle, ClipboardList, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./Dashboard.css";

const PatientDashboard = () => {
  const patientName = "Ana López";

  const menuItems = [
    {
      title: "Cuestionario Inicial",
      description: "Completa tu evaluación de bienestar",
      icon: ClipboardList,
      link: "/paciente/cuestionario",
      color: "teal",
      completed: false
    },
    {
      title: "Chat Terapéutico",
      description: "Habla con tu asistente de IA",
      icon: MessageCircle,
      link: "/paciente/chat",
      color: "blue",
      completed: true
    },
    {
      title: "Mi Perfil",
      description: "Ver y editar tu información",
      icon: User,
      link: "/paciente/perfil",
      color: "green",
      completed: true
    }
  ];

  return (
    <div className="patient-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={metapsisLogo} alt="Metapsis" className="sidebar-logo" />
          <h2 className="sidebar-title">Metapsis</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/paciente/dashboard" className="nav-item active">
            <Brain size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/paciente/cuestionario" className="nav-item">
            <ClipboardList size={20} />
            <span>Cuestionario</span>
          </Link>
          <Link to="/paciente/chat" className="nav-item">
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

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1 className="header-title">¡Hola, {patientName}! 👋</h1>
            <p className="header-subtitle">Bienvenido a tu espacio de bienestar</p>
          </div>
        </header>

        <div className="dashboard-grid">
          {menuItems.map((item, index) => (
            <Card key={index} className="dashboard-card">
              <CardHeader>
                <div className={`card-icon card-icon-${item.color}`}>
                  <item.icon size={28} />
                </div>
                <CardTitle className="card-title">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={item.link}>
                  <Button className="card-button w-full">
                    {item.completed ? "Acceder" : "Comenzar"}
                  </Button>
                </Link>
                {!item.completed && (
                  <span className="card-badge">Pendiente</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="welcome-card">
          <CardHeader>
            <CardTitle>📋 Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Completa el Cuestionario Inicial</h4>
                <p>Ayúdanos a conocerte mejor para personalizar tu experiencia</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Inicia una Conversación</h4>
                <p>Nuestro chatbot está aquí para escucharte 24/7</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Revisa tu Progreso</h4>
                <p>Visualiza tu evolución emocional con gráficos y análisis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;
