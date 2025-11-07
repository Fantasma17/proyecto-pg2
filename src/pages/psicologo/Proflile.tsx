import { Link } from "react-router-dom";
import { Brain, MessageCircle, ClipboardList, User, LogOut, Mail, Phone, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./Profile.css";

const PsychologistProfile = () => {
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('metapsis_current_user') || '{}');
  
  const profileData = {
    name: currentUser.name || "Dr. Carlos Ruiz",
    email: currentUser.email || "carlos.ruiz@metapsis.com",
    specialty: "Psicología Clínica",
    license: "PSI-2024-001",
    phone: "+502 5555-1234",
    joinDate: new Date(currentUser.createdAt || Date.now()).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
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
          <Link to="/psicologo/dashboard" className="nav-item">
            <Brain size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/psicologo/crear-paciente" className="nav-item">
            <ClipboardList size={20} />
            <span>Crear Paciente</span>
          </Link>
          <Link to="/psicologo/perfil" className="nav-item active">
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
            <h1 className="header-title">Mi Perfil</h1>
            <p className="header-subtitle">Información del profesional</p>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="profile-container">
            {/* Main Profile Card */}
            <Card className="profile-card-main">
              <CardContent className="p-6">
                <div className="profile-header">
                  <div className="profile-avatar-section">
                    <Avatar className="profile-avatar">
                      <AvatarImage src="" />
                      <AvatarFallback className="avatar-fallback">
                        {profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="profile-name">{profileData.name}</h2>
                      <p className="text-muted-foreground">{profileData.specialty}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="edit-button">
                    Editar Perfil
                  </Button>
                </div>

                <div className="profile-info">
                  <div className="info-group">
                    <h3 className="info-title">Información de Contacto</h3>
                    <div className="info-items">
                      <div className="info-item">
                        <Mail className="info-icon" size={20} />
                        <div>
                          <p className="info-label">Correo Electrónico</p>
                          <p className="info-value">{profileData.email}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <Phone className="info-icon" size={20} />
                        <div>
                          <p className="info-label">Teléfono</p>
                          <p className="info-value">{profileData.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="info-group">
                    <h3 className="info-title">Información Profesional</h3>
                    <div className="info-items">
                      <div className="info-item">
                        <Award className="info-icon" size={20} />
                        <div>
                          <p className="info-label">Licencia Profesional</p>
                          <p className="info-value">{profileData.license}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <Calendar className="info-icon" size={20} />
                        <div>
                          <p className="info-label">Fecha de Registro</p>
                          <p className="info-value">{profileData.joinDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="profile-stats">
              <Card className="stat-card">
                <CardContent className="p-6">
                  <h3 className="stat-title">Pacientes</h3>
                  <p className="stat-number">12</p>
                  <p className="stat-description">Activos en tratamiento</p>
                </CardContent>
              </Card>

              <Card className="stat-card">
                <CardContent className="p-6">
                  <h3 className="stat-title">Sesiones</h3>
                  <p className="stat-number">48</p>
                  <p className="stat-description">Este mes</p>
                </CardContent>
              </Card>
            </div>

            {/* Preferences Card */}
            <Card className="preferences-card">
              <CardHeader>
                <CardTitle>Especialidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="preference-item">
                  <span className="preference-label">Ansiedad</span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Depresión</span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Terapia Cognitiva</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PsychologistProfile;
