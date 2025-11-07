import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth pages
import Login from "./pages/auth/Login";

// Patient pages
import PatientDashboard from "./pages/paciente/Dashboard";
import PatientQuestionnaire from "./pages/paciente/Questionnaire";
import PatientChat from "./pages/paciente/Chat";
import PatientProfile from "./pages/paciente/Profile";

// Psychologist pages
import PsychologistDashboard from "./pages/psicologo/Dashboard";
import PsychologistPatientDetails from "./pages/psicologo/PatientDetails";
import PsychologistCreatePatient from "./pages/psicologo/CreatePatient";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCreatePsychologist from "./pages/admin/CreatePsychologist";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          
          {/* Patient Routes */}
          <Route path="/paciente/dashboard" element={<PatientDashboard />} />
          <Route path="/paciente/cuestionario" element={<PatientQuestionnaire />} />
          <Route path="/paciente/chat" element={<PatientChat />} />
          <Route path="/paciente/perfil" element={<PatientProfile />} />
          
          {/* Psychologist Routes */}
          <Route path="/psicologo/dashboard" element={<PsychologistDashboard />} />
          <Route path="/psicologo/crear-paciente" element={<PsychologistCreatePatient />} />
          <Route path="/psicologo/paciente/:id" element={<PsychologistPatientDetails />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/crear-psicologo" element={<AdminCreatePsychologist />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
