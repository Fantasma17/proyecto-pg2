import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Retrieve stored users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('metapsis_users') || '[]');
      
      // Default admin credentials
      const defaultAdmin = {
        email: 'admin@metapsis.com',
        password: 'admin123',
        role: 'admin',
        name: 'Administrador Principal'
      };
      
      // Find user in stored users or check against default admin
      const user = storedUsers.find((u: any) => u.email === email && u.password === password) || 
                   (email === defaultAdmin.email && password === defaultAdmin.password ? defaultAdmin : null);
      
      if (user) {
        // Store current user session
        localStorage.setItem('metapsis_current_user', JSON.stringify(user));
        
        toast({
          title: "✅ Inicio de Sesión Exitoso",
          description: `Bienvenido ${user.name}`,
        });
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'psicologo') {
          navigate('/psicologo/dashboard');
        } else if (user.role === 'paciente') {
          navigate('/paciente/dashboard');
        }
      } else {
        toast({
          title: "❌ Error de Autenticación",
          description: "Correo o contraseña incorrectos",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-logo">
          <img src={metapsisLogo} alt="Metapsis Logo" className="logo-image" />
          <h1 className="logo-title">Metapsis</h1>
          <p className="logo-subtitle">Tu espacio de bienestar emocional</p>
        </div>

        <Card className="login-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@metapsis.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <Button type="submit" className="login-button w-full" disabled={isLoading}>
                {isLoading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="login-footer">
          ¿Necesitas ayuda? Contacta a tu psicólogo
        </p>
      </div>
    </div>
  );
};

export default Login;
