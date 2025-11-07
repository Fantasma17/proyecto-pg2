import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Search, Brain, User, LogOut, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./Dashboard.css";

interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  lastSession: string;
  emotionalState: string;
  status: "active" | "inactive";
}

const PsychologistDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const patients: Patient[] = [
    {
      id: "1",
      name: "Ana López García",
      age: 28,
      email: "ana.lopez@metapsis.com",
      lastSession: "Hace 2 días",
      emotionalState: "Ansioso",
      status: "active"
    },
    {
      id: "2",
      name: "Carlos Méndez",
      age: 35,
      email: "carlos.mendez@metapsis.com",
      lastSession: "Hace 1 semana",
      emotionalState: "Neutral",
      status: "active"
    },
    {
      id: "3",
      name: "María Fernández",
      age: 42,
      email: "maria.fernandez@metapsis.com",
      lastSession: "Hace 3 días",
      emotionalState: "Feliz",
      status: "active"
    },
    {
      id: "4",
      name: "José Ramírez",
      age: 31,
      email: "jose.ramirez@metapsis.com",
      lastSession: "Hace 1 mes",
      emotionalState: "Triste",
      status: "inactive"
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmotionalStateBadge = (state: string) => {
    const variants: Record<string, string> = {
      "Feliz": "success",
      "Neutral": "secondary",
      "Ansioso": "warning",
      "Triste": "destructive"
    };
    return variants[state] || "secondary";
  };

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
          <Link to="/psicologo/dashboard" className="nav-item active">
            <Users size={20} />
            <span>Mis Pacientes</span>
          </Link>
          <Link to="/psicologo/crear-paciente" className="nav-item">
            <UserPlus size={20} />
            <span>Crear Paciente</span>
          </Link>
          <Link to="/psicologo/perfil" className="nav-item">
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
            <h1 className="header-title">Panel de Pacientes</h1>
            <p className="header-subtitle">Gestiona y da seguimiento a tus pacientes</p>
          </div>
          <Link to="/psicologo/crear-paciente">
            <Button className="create-patient-button">
              <UserPlus size={20} className="mr-2" />
              Crear Nuevo Paciente
            </Button>
          </Link>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <CardHeader>
              <CardTitle className="stat-title">Total Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-number">{patients.length}</p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardHeader>
              <CardTitle className="stat-title">Pacientes Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-number stat-success">
                {patients.filter(p => p.status === "active").length}
              </p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardHeader>
              <CardTitle className="stat-title">Pacientes Inactivos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-number stat-warning">
                {patients.filter(p => p.status === "inactive").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="search-card">
          <CardContent className="pt-6">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <Input
                placeholder="Buscar paciente por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patients Grid */}
        <div className="patients-grid">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="patient-card">
              <CardHeader>
                <div className="patient-card-header">
                  <div>
                    <CardTitle className="patient-name">{patient.name}</CardTitle>
                    <CardDescription>{patient.age} años</CardDescription>
                  </div>
                  <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                    {patient.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="patient-info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{patient.email}</span>
                </div>
                <div className="patient-info-item">
                  <span className="info-label">Última Sesión:</span>
                  <span className="info-value">{patient.lastSession}</span>
                </div>
                <div className="patient-info-item">
                  <span className="info-label">Estado Emocional:</span>
                  <Badge variant={getEmotionalStateBadge(patient.emotionalState) as any}>
                    {patient.emotionalState}
                  </Badge>
                </div>
                <Link to={`/psicologo/paciente/${patient.id}`}>
                  <Button className="view-details-button w-full mt-4">
                    <Eye size={18} className="mr-2" />
                    Ver Detalles
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card className="empty-state">
            <CardContent className="pt-6 text-center">
              <Brain size={64} className="empty-icon mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron pacientes</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza creando tu primer paciente"}
              </p>
              {!searchTerm && (
                <Link to="/psicologo/crear-paciente">
                  <Button>
                    <UserPlus size={18} className="mr-2" />
                    Crear Primer Paciente
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PsychologistDashboard;