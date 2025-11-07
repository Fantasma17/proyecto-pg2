import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, UserPlus, Search, Users, Settings, LogOut, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./Dashboard.css";

interface Psychologist {
  id: string;
  name: string;
  email: string;
  patients: number;
  status: "active" | "inactive";
  registrationDate: string;
}

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const psychologists: Psychologist[] = [
    {
      id: "1",
      name: "Dr. Carlos Ruiz",
      email: "carlos.ruiz@metapsis.com",
      patients: 12,
      status: "active",
      registrationDate: "10 Ene 2025"
    },
    {
      id: "2",
      name: "Dra. María González",
      email: "maria.gonzalez@metapsis.com",
      patients: 18,
      status: "active",
      registrationDate: "05 Ene 2025"
    },
    {
      id: "3",
      name: "Dr. José Martínez",
      email: "jose.martinez@metapsis.com",
      patients: 8,
      status: "active",
      registrationDate: "15 Dic 2024"
    },
    {
      id: "4",
      name: "Dra. Ana Pérez",
      email: "ana.perez@metapsis.com",
      patients: 0,
      status: "inactive",
      registrationDate: "20 Nov 2024"
    }
  ];

  const filteredPsychologists = psychologists.filter(psych =>
    psych.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    psych.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar al psicólogo ${name}?`)) {
      toast({
        title: "Psicólogo Eliminado",
        description: `${name} ha sido eliminado del sistema.`,
        variant: "destructive"
      });
    }
  };

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
        <div className="admin-stats-grid">
          <Card className="admin-stat-card">
            <CardHeader>
              <CardTitle className="stat-title">Total Psicólogos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-number">{psychologists.length}</p>
            </CardContent>
          </Card>
          <Card className="admin-stat-card">
            <CardHeader>
              <CardTitle className="stat-title">Psicólogos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-number stat-success">
                {psychologists.filter(p => p.status === "active").length}
              </p>
            </CardContent>
          </Card>
          <Card className="admin-stat-card">
            <CardHeader>
              <CardTitle className="stat-title">Total Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="stat-number">{totalPatients}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="search-card">
          <CardContent className="pt-6">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <Input
                placeholder="Buscar psicólogo por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Psychologists Table */}
        <Card className="table-card">
          <CardHeader>
            <CardTitle>Lista de Psicólogos</CardTitle>
            <CardDescription>Todos los psicólogos registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="psychologists-table">
              {filteredPsychologists.map((psych) => (
                <div key={psych.id} className="table-row">
                  <div className="table-cell table-cell-main">
                    <div>
                      <p className="cell-title">{psych.name}</p>
                      <p className="cell-subtitle">{psych.email}</p>
                    </div>
                    <Badge variant={psych.status === "active" ? "default" : "secondary"}>
                      {psych.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="table-cell">
                    <span className="cell-label">Pacientes:</span>
                    <span className="cell-value">{psych.patients}</span>
                  </div>
                  <div className="table-cell">
                    <span className="cell-label">Registro:</span>
                    <span className="cell-value">{psych.registrationDate}</span>
                  </div>
                  <div className="table-cell table-cell-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Ver detalles de ${psych.name}`)}
                    >
                      <Eye size={16} className="mr-2" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(psych.id, psych.name)}
                      className="delete-button"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPsychologists.length === 0 && (
              <div className="empty-table">
                <Shield size={64} className="empty-icon" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron psicólogos</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda"
                    : "Comienza creando el primer psicólogo"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
