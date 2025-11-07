import { Link } from "react-router-dom";
import { Brain, MessageCircle, ClipboardList, User, LogOut, Mail, Phone, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./Profile.css";

const PatientProfile = () => {
  const patientData = {
    fullName: "Ana López García",
    email: "ana.lopez@metapsis.com",
    phone: "+502 1234 5678",
    age: 28,
    registrationDate: "15 de Enero, 2025",
    therapistName: "Dr. Carlos Ruiz",
    sessionsCompleted: 8,
    questionnairesCompleted: 1
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
          <Link to="/paciente/chat" className="nav-item">
            <MessageCircle size={20} />
            <span>Chat</span>
          </Link>
          <Link to="/paciente/perfil" className="nav-item active">
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
          <h1 className="header-title">Mi Perfil</h1>
          <p className="header-subtitle">Información personal y progreso terapéutico</p>
        </header>

        <div className="profile-container">
          <Card className="profile-card-main">
            <CardHeader className="profile-header">
              <div className="profile-avatar-section">
                <Avatar className="profile-avatar">
                  <AvatarFallback className="avatar-fallback">
                    {patientData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="profile-name">{patientData.fullName}</CardTitle>
                  <CardDescription>{patientData.age} años</CardDescription>
                </div>
              </div>
              <Button variant="outline" className="edit-button">
                <Edit size={18} className="mr-2" />
                Editar Perfil
              </Button>
            </CardHeader>
            <CardContent className="profile-info">
              <div className="info-group">
                <h3 className="info-title">Información de Contacto</h3>
                <div className="info-items">
                  <div className="info-item">
                    <Mail className="info-icon" size={20} />
                    <div>
                      <p className="info-label">Correo Electrónico</p>
                      <p className="info-value">{patientData.email}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <Phone className="info-icon" size={20} />
                    <div>
                      <p className="info-label">Teléfono</p>
                      <p className="info-value">{patientData.phone}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <Calendar className="info-icon" size={20} />
                    <div>
                      <p className="info-label">Fecha de Registro</p>
                      <p className="info-value">{patientData.registrationDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-group">
                <h3 className="info-title">Información Terapéutica</h3>
                <div className="info-items">
                  <div className="info-item">
                    <User className="info-icon" size={20} />
                    <div>
                      <p className="info-label">Psicólogo Asignado</p>
                      <p className="info-value">{patientData.therapistName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="profile-stats">
            <Card className="stat-card">
              <CardHeader>
                <CardTitle className="stat-title">Sesiones de Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="stat-number">{patientData.sessionsCompleted}</p>
                <p className="stat-description">Conversaciones completadas</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader>
                <CardTitle className="stat-title">Cuestionarios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="stat-number">{patientData.questionnairesCompleted}</p>
                <p className="stat-description">Evaluaciones realizadas</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader>
                <CardTitle className="stat-title">Progreso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="stat-number">75%</p>
                <p className="stat-description">Objetivos alcanzados</p>
              </CardContent>
            </Card>
          </div>

          <Card className="preferences-card">
            <CardHeader>
              <CardTitle>Preferencias de Comunicación</CardTitle>
              <CardDescription>Tu estilo preferido para el chatbot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="preference-item">
                <span className="preference-label">Estilo:</span>
                <span className="preference-value">Empático y Cálido</span>
              </div>
              <div className="preference-item">
                <span className="preference-label">Temas de Interés:</span>
                <span className="preference-value">Mindfulness, Manejo del Estrés</span>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Actualizar Preferencias
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;
