import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import authService from "@/lib/services/auth.service";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      // El servicio puede devolver diferentes shapes; casteamos a AuthResp para evitar errores de TS
      type AuthResp = { user?: any; data?: any; token?: string; accessToken?: string };
      const anyResp = response as AuthResp;
      const user = anyResp?.user || anyResp?.data?.user || anyResp?.data || anyResp;

      // Guardar token en localStorage (si el backend lo devuelve)
      const token = anyResp?.token || anyResp?.data?.token || anyResp?.accessToken || anyResp?.data?.accessToken;
      if (token) {
        localStorage.setItem('token', token);
      }
      
      toast({
        title: "✅ Inicio de sesión exitoso",
        description: `Bienvenido, ${user?.name || user?.firstName || user?.email}`,
      });

      setTimeout(() => {
        switch (user?.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'psicologo':
            navigate('/psicologo/dashboard');
            break;
          case 'paciente':
            navigate('/paciente/dashboard');
            break;
          default:
            navigate('/login');
        }
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "❌ Error de autenticación",
        description: error.response?.data?.message || error.message || "Credenciales inválidas. Verifica tu correo y contraseña.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <CardHeader className="login-header">
            <div className="logo-container">
              <img src={metapsisLogo} alt="Metapsis" className="login-logo" />
            </div>
            <CardTitle className="login-title">Bienvenido a Metapsis</CardTitle>
            <CardDescription className="login-description">
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <Label htmlFor="email" className="form-label">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu.correo@metapsis.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <Label htmlFor="password" className="form-label">
                  Contraseña
                </Label>
                <div className="password-input-wrapper">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="form-input password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    disabled={isLoading}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="login-button" 
                disabled={isLoading}
              >
                {isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="login-footer">
              <p className="footer-text">
                ¿Olvidaste tu contraseña? Contacta a tu administrador
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;