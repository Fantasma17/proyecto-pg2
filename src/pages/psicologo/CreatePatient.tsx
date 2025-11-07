import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, UserPlus, User, LogOut, CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./CreatePatient.css";

const PsychologistCreatePatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    age: "",
    notes: ""
  });
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateCredentials = (fullName: string) => {
    const email = `${fullName.toLowerCase().replace(/\s+/g, '.')}@metapsis.com`;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return { email, password };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newCredentials = generateCredentials(formData.fullName);
      
      // Store patient in localStorage with role
      const storedUsers = JSON.parse(localStorage.getItem('metapsis_users') || '[]');
      const newPatient = {
        id: Date.now().toString(),
        email: newCredentials.email,
        password: newCredentials.password,
        role: 'paciente',
        name: formData.fullName,
        phone: formData.phone,
        age: formData.age,
        notes: formData.notes,
        createdAt: new Date().toISOString()
      };
      storedUsers.push(newPatient);
      localStorage.setItem('metapsis_users', JSON.stringify(storedUsers));
      
      setCredentials(newCredentials);
      setIsLoading(false);
      
      toast({
        title: "✅ Paciente Creado Exitosamente",
        description: "Las credenciales se muestran abajo. Cópialas y entrégalas al paciente.",
      });
    }, 1000);
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
    setFormData({ fullName: "", phone: "", age: "", notes: "" });
    setCredentials(null);
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
          <Link to="/psicologo/dashboard" className="nav-item">
            <Users size={20} />
            <span>Mis Pacientes</span>
          </Link>
          <Link to="/psicologo/crear-paciente" className="nav-item active">
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
            <h1 className="header-title">Crear Nuevo Paciente</h1>
            <p className="header-subtitle">Ingresa la información del paciente para generar sus credenciales</p>
          </div>
        </header>

        <div className="create-patient-container">
          {!credentials ? (
            <Card className="create-patient-card">
              <CardHeader>
                <CardTitle>Información del Paciente</CardTitle>
                <CardDescription>
                  Los campos marcados con * son obligatorios. Se generarán automáticamente las credenciales.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="patient-form">
                  <div className="form-field">
                    <Label htmlFor="fullName">Nombre Completo *</Label>
                    <Input
                      id="fullName"
                      placeholder="Ana López García"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        placeholder="+502 1234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <Label htmlFor="age">Edad *</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="28"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <Label htmlFor="notes">Notas Iniciales</Label>
                    <Textarea
                      id="notes"
                      placeholder="Ej: Ansiedad laboral, primera consulta..."
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="submit-button w-full" disabled={isLoading}>
                    {isLoading ? "Creando..." : "Crear Paciente"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="credentials-card">
              <CardHeader className="credentials-header">
                <div className="success-icon">
                  <CheckCircle size={64} />
                </div>
                <CardTitle className="credentials-title">¡Paciente Creado Exitosamente!</CardTitle>
                <CardDescription>
                  A continuación se muestran las credenciales generadas. Cópialas y entrégalas al paciente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="credentials-box">
                  <div className="credential-item">
                    <span className="credential-label">Correo Electrónico:</span>
                    <span className="credential-value">{credentials.email}</span>
                  </div>
                  <div className="credential-item">
                    <span className="credential-label">Contraseña:</span>
                    <span className="credential-value password">{credentials.password}</span>
                  </div>
                </div>

                <div className="credentials-actions">
                  <Button onClick={handleCopyCredentials} className="copy-button w-full">
                    <Copy size={18} className="mr-2" />
                    Copiar Credenciales
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCreateAnother}
                    className="w-full"
                  >
                    Crear Otro Paciente
                  </Button>
                  <Link to="/psicologo/dashboard" className="w-full">
                    <Button variant="secondary" className="w-full">
                      Ver Todos los Pacientes
                    </Button>
                  </Link>
                </div>

                <div className="warning-box">
                  <p className="text-sm text-muted-foreground">
                    ⚠️ <strong>Importante:</strong> Estas credenciales solo se mostrarán una vez.
                    Asegúrate de copiarlas antes de salir de esta página.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="info-card">
            <CardHeader>
              <CardTitle className="text-base">💡 Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                • El correo se genera automáticamente usando el formato: nombre.apellido@metapsis.com
              </p>
              <p>
                • La contraseña es aleatoria y segura (8-12 caracteres con símbolos)
              </p>
              <p>
                • El paciente puede usar estas credenciales para iniciar sesión inmediatamente
              </p>
              <p>
                • Puedes ver y gestionar todos tus pacientes desde el Dashboard
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PsychologistCreatePatient;