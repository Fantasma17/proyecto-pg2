import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, UserPlus, Users, Settings, LogOut, CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./CreatePsychologist.css";

const AdminCreatePsychologist = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateCredentials = (name: string) => {
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@metapsis.com`;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return { email, password };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast({ title: 'Nombre requerido', description: 'Ingresa el nombre completo del psicólogo', variant: 'destructive' });
      return;
    }
    setIsLoading(true);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('token') || '';

      const res = await fetch(`${API_BASE}/api/users/psychologists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: fullName })
      });

      const j = await res.json();
      if (!res.ok) {
        throw new Error(j.message || 'Error creando psicólogo');
      }

      const createdEmail = j.data?.email;
      const genPass = j.generatedPassword;
      if (!createdEmail || !genPass) {
        throw new Error('Respuesta inválida del servidor');
      }

      setCredentials({ email: createdEmail, password: genPass });
      toast({
        title: "✅ Psicólogo Creado Exitosamente",
        description: `Se creó ${createdEmail}. Copia las credenciales.`,
      });
    } catch (err: any) {
      console.error('Create psychologist error:', err);
      toast({ title: 'Error', description: err.message || 'No se pudo crear el psicólogo', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (credentials) {
      const text = `Correo: ${credentials.email}\nContraseña: ${credentials.password}`;
      navigator.clipboard.writeText(text);
      toast({
        title: "📋 Credenciales Copiadas",
        description: "Ahora puedes pegarlas donde las necesites.",
      });
    }
  };

  const handleCreateAnother = () => {
    setFullName("");
    setCredentials(null);
  };

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
          <Link to="/admin/dashboard" className="nav-item">
            <Users size={20} />
            <span>Psicólogos</span>
          </Link>
          <Link to="/admin/crear-psicologo" className="nav-item active">
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
            <h1 className="header-title">Crear Nuevo Psicólogo</h1>
            <p className="header-subtitle">Genera credenciales de acceso para un nuevo profesional</p>
          </div>
        </header>

        <div className="create-psychologist-container">
          {!credentials ? (
            <Card className="create-form-card">
              <CardHeader>
                <CardTitle>Información del Psicólogo</CardTitle>
                <CardDescription>
                  Ingresa el nombre completo para generar automáticamente las credenciales.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="psychologist-form">
                  <div className="form-field">
                    <Label htmlFor="fullName">Nombre Completo *</Label>
                    <Input
                      id="fullName"
                      placeholder="Dr. Carlos Ruiz Hernández"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="submit-button w-full" disabled={isLoading}>
                    {isLoading ? "Creando..." : "Crear Psicólogo"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="credentials-result-card">
              <CardHeader className="credentials-result-header">
                <div className="success-icon">
                  <CheckCircle size={72} />
                </div>
                <CardTitle className="credentials-result-title">
                  ¡Psicólogo Creado Exitosamente!
                </CardTitle>
                <CardDescription>
                  A continuación se muestran las credenciales generadas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="credentials-display">
                  <div className="credential-row">
                    <span className="credential-label">Correo Electrónico:</span>
                    <span className="credential-value">{credentials.email}</span>
                  </div>
                  <div className="credential-row">
                    <span className="credential-label">Contraseña:</span>
                    <span className="credential-value credential-password">{credentials.password}</span>
                  </div>
                </div>

                <div className="credentials-actions-admin">
                  <Button onClick={handleCopyCredentials} className="copy-credentials-button w-full">
                    <Copy size={18} className="mr-2" />
                    Copiar Credenciales
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCreateAnother}
                    className="w-full"
                  >
                    Crear Otro Psicólogo
                  </Button>
                  <Link to="/admin/dashboard" className="w-full">
                    <Button variant="secondary" className="w-full">
                      Ver Todos los Psicólogos
                    </Button>
                  </Link>
                </div>

                <div className="warning-notice">
                  <p className="text-sm text-muted-foreground">
                    ⚠️ <strong>Importante:</strong> Estas credenciales solo se mostrarán una vez.
                    Asegúrate de copiarlas y entregarlas al psicólogo antes de salir.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="info-notice-card">
            <CardHeader>
              <CardTitle className="text-base">💡 Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                • El correo se genera automáticamente: nombre.apellido@metapsis.com
              </p>
              <p>
                • La contraseña es aleatoria, segura y contiene símbolos especiales
              </p>
              <p>
                • El psicólogo podrá iniciar sesión inmediatamente con estas credenciales
              </p>
              <p>
                • Desde su cuenta, el psicólogo puede crear y gestionar pacientes
              </p>
              <p>
                • Puedes ver y eliminar psicólogos desde el Dashboard de Administración
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminCreatePsychologist;
