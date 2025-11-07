import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Search, Brain, User, LogOut, Eye, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./Dashboard.css";

interface Psychologist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  patients: number;
  status: "active" | "inactive";
}

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const psychologists: Psychologist[] = [
    {
      id: "1",
      name: "Dr. Carlos Ruiz Hernández",
      email: "carlos.ruiz@metapsis.com",
      phone: "+502 5555-1234",
      specialty: "Psicología Clínica",
      patients: 12,
      status: "active"
    },
    {
      id: "2",
      name: "Dra. María González",
      email: "maria.gonzalez@metapsis.com",
      phone: "+502 5555-5678",
      specialty: "Terapia Cognitiva",
      patients: 8,
      status: "active"
    },
    {
      id: "3",
      name: "Dr. José Martínez",
      email: "jose.martinez@metapsis.com",
      phone: "+502 5555-9012",
      specialty: "Psicología Infantil",
      patients: 15,
      status: "active"
    },
    {
      id: "4",
      name: "Dra. Ana Rodríguez",
      email: "ana.rodriguez@metapsis.com",
      phone: "+502 5555-3456",
      specialty: "Terapia Familiar",
      patients: 0,
      status: "inactive"
    }
  ];

  const filteredPsychologists = psychologists.filter(psychologist =>
    psychologist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    psychologist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    psychologist.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPatients = psychologists.reduce((sum, p) => sum + p.patients, 0);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={metapsisLogo} alt="Metapsis" className="sidebar-logo" />
          <h2 className="sidebar-title">Metapsis</h2>
          <p className="sidebar-role">Administrador</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="nav-item active">
            <Users size={20} />
            <span>Psicólogos</span>
          </Link>
          <Link to="/admin/crear-psicologo" className="nav-item">
            <UserPlus size={20} />
            <span>Crear Psicólogo</span>
          </Link>
          <Link to="/admin/perfil" className="nav-item">
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
            <h1 className="header-title">Panel de Administración</h1>
            <p className="header-subtitle">Gestiona psicólogos y supervisa el sistema</p>
          </div>
          <Link to="/admin/crear-psicologo">
            <Button className="create-button">
              <UserPlus size={20} className="mr-2" />
              Crear Nuevo Psicólogo
            </Button>
          </Link>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <CardHeader>
              <CardTitle className="stat-title">Total Psicólogos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-number">{psychologists.length}</p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardHeader>
              <CardTitle className="stat-title">Psicólogos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-number stat-success">
                {psychologists.filter(p => p.status === "active").length}
              </p>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardHeader>
              <CardTitle className="stat-title">Total Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-number stat-info">{totalPatients}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="search-card">
          <CardContent className="pt-6">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <Input
                placeholder="Buscar psicólogo por nombre, correo o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Psychologists Grid */}
        <div className="psychologists-grid">
          {filteredPsychologists.map((psychologist) => (
            <Card key={psychologist.id} className="psychologist-card">
              <CardHeader>
                <div className="psychologist-card-header">
                  <div>
                    <CardTitle className="psychologist-name">{psychologist.name}</CardTitle>
                    <CardDescription>{psychologist.specialty}</CardDescription>
                  </div>
                  <Badge variant={psychologist.status === "active" ? "default" : "secondary"}>
                    {psychologist.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="psychologist-info-item">
                  <Mail size={16} className="info-icon" />
                  <span className="info-value">{psychologist.email}</span>
                </div>
                <div className="psychologist-info-item">
                  <Phone size={16} className="info-icon" />
                  <span className="info-value">{psychologist.phone}</span>
                </div>
                <div className="psychologist-info-item">
                  <Users size={16} className="info-icon" />
                  <span className="info-value">{psychologist.patients} pacientes</span>
                </div>
                <Button className="view-details-button w-full mt-4" variant="outline">
                  <Eye size={18} className="mr-2" />
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPsychologists.length === 0 && (
          <Card className="empty-state">
            <CardContent className="pt-6 text-center">
              <Brain size={64} className="empty-icon mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron psicólogos</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza creando tu primer psicólogo"}
              </p>
              {!searchTerm && (
                <Link to="/admin/crear-psicologo">
                  <Button>
                    <UserPlus size={18} className="mr-2" />
                    Crear Primer Psicólogo
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

export default AdminDashboard;