import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Brain, MessageCircle, ClipboardList, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import metapsisLogo from "@/assets/metapsis-logo.png";
import "./Questionnaire.css";

const PatientQuestionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: "",
    age: "",
    phone: "",
    // Step 2: Support Need
    supportReason: "",
    emotionalState: "",
    // Step 3: Motivation
    previousTherapy: "",
    goals: "",
    // Step 4: Chatbot Preferences
    communicationStyle: "",
    topicsInterest: "",
    // Step 5: Confirmation
    consent: false
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      toast({
        title: "¡Cuestionario Completado!",
        description: "Gracias por compartir tu información. Ya puedes usar el chat terapéutico.",
      });
      navigate("/paciente/chat");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="questionnaire-step">
            <h2 className="step-title">Información Personal</h2>
            <p className="step-description">Cuéntanos un poco sobre ti</p>
            <div className="form-fields">
              <div className="form-field">
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  placeholder="Ana López García"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                />
              </div>
              <div className="form-field">
                <Label htmlFor="age">Edad *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="28"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                />
              </div>
              <div className="form-field">
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <Input
                  id="phone"
                  placeholder="+502 1234 5678"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="questionnaire-step">
            <h2 className="step-title">Necesidad de Apoyo</h2>
            <p className="step-description">¿Cómo podemos ayudarte?</p>
            <div className="form-fields">
              <div className="form-field">
                <Label>¿Por qué buscas apoyo emocional? *</Label>
                <Textarea
                  placeholder="Ej: Ansiedad laboral, problemas de sueño, manejo del estrés..."
                  value={formData.supportReason}
                  onChange={(e) => updateFormData("supportReason", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="form-field">
                <Label>¿Cómo describirías tu estado emocional actual? *</Label>
                <RadioGroup
                  value={formData.emotionalState}
                  onValueChange={(value) => updateFormData("emotionalState", value)}
                >
                  <div className="radio-item">
                    <RadioGroupItem value="muy-bien" id="muy-bien" />
                    <Label htmlFor="muy-bien">Muy bien</Label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="bien" id="bien" />
                    <Label htmlFor="bien">Bien</Label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular">Regular</Label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="mal" id="mal" />
                    <Label htmlFor="mal">Mal</Label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="muy-mal" id="muy-mal" />
                    <Label htmlFor="muy-mal">Muy mal</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="questionnaire-step">
            <h2 className="step-title">Motivación y Experiencia</h2>
            <p className="step-description">Experiencia previa y objetivos</p>
            <div className="form-fields">
              <div className="form-field">
                <Label>¿Has tenido terapia psicológica antes? *</Label>
                <RadioGroup
                  value={formData.previousTherapy}
                  onValueChange={(value) => updateFormData("previousTherapy", value)}
                >
                  <div className="radio-item">
                    <RadioGroupItem value="si-reciente" id="si-reciente" />
                    <Label htmlFor="si-reciente">Sí, recientemente</Label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="si-hace-tiempo" id="si-hace-tiempo" />
                    <Label htmlFor="si-hace-tiempo">Sí, hace tiempo</Label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">No, es mi primera vez</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="form-field">
                <Label>¿Qué esperas lograr con esta herramienta? *</Label>
                <Textarea
                  placeholder="Ej: Reducir mi ansiedad, mejorar mi autoestima, aprender a manejar el estrés..."
                  value={formData.goals}
                  onChange={(e) => updateFormData("goals", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="questionnaire-step">
            <h2 className="step-title">Preferencias del Chatbot</h2>
            <p className="step-description">Personaliza tu experiencia</p>
            <div className="form-fields">
              <div className="form-field">
                <Label>¿Cómo prefieres que el chatbot se comunique contigo? *</Label>
                <RadioGroup
                  value={formData.communicationStyle}
                  onValueChange={(value) => updateFormData("communicationStyle", value)}
                >
                  <div className="radio-item">
                    <RadioGroupItem value="formal" id="formal" />
                    <Label htmlFor="formal">Formal y profesional</Label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="casual" id="casual" />
                    <Label htmlFor="casual">Casual y amigable</Label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="empatico" id="empatico" />
                    <Label htmlFor="empatico">Muy empático y cálido</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="form-field">
                <Label>¿Qué temas te gustaría explorar? (opcional)</Label>
                <Textarea
                  placeholder="Ej: Mindfulness, técnicas de respiración, manejo de emociones..."
                  value={formData.topicsInterest}
                  onChange={(e) => updateFormData("topicsInterest", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="questionnaire-step">
            <h2 className="step-title">Confirmación Final</h2>
            <p className="step-description">Revisa tu información antes de continuar</p>
            <Card className="confirmation-card">
              <CardHeader>
                <CardTitle>Resumen de tu Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="summary-item">
                  <span className="summary-label">Nombre:</span>
                  <span className="summary-value">{formData.fullName || "No especificado"}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Edad:</span>
                  <span className="summary-value">{formData.age || "No especificado"}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Estado Emocional:</span>
                  <span className="summary-value">{formData.emotionalState || "No especificado"}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Estilo de Comunicación:</span>
                  <span className="summary-value">{formData.communicationStyle || "No especificado"}</span>
                </div>
              </CardContent>
            </Card>
            <div className="consent-section">
              <Label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => updateFormData("consent", e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  Acepto que mi información sea utilizada para personalizar mi experiencia terapéutica
                  y que sea visible para mi psicólogo asignado.
                </span>
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
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
          <Link to="/paciente/cuestionario" className="nav-item active">
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
          <h1 className="header-title">Cuestionario Inicial</h1>
          <p className="header-subtitle">Completa estos pasos para personalizar tu experiencia</p>
        </header>

        <div className="questionnaire-container">
          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <p className="progress-text">Paso {currentStep} de {totalSteps}</p>
          </div>

          {/* Step Content */}
          <Card className="questionnaire-card">
            <CardContent className="pt-6">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="questionnaire-navigation">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="nav-button"
            >
              <ArrowLeft size={18} className="mr-2" />
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === 5 && !formData.consent}
              className="nav-button nav-button-primary"
            >
              {currentStep === totalSteps ? (
                <>
                  <Check size={18} className="mr-2" />
                  Finalizar
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientQuestionnaire;
