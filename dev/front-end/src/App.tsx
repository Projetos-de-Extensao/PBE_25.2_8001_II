import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Home } from "./pages/Home";

// Auth Pages
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Profile } from "./pages/auth/Profile";

// Student Pages
import { BuscarVagas } from "./pages/student/BuscarVagas";
import { DetalhesVaga } from "./pages/student/DetalhesVaga";
import { MinhasCandidaturas } from "./pages/student/MinhasCandidaturas";
import { BuscarMonitores } from "./pages/student/BuscarMonitores";
import { PerfilMonitor } from "./pages/student/PerfilMonitor";
import { Agendamentos } from "./pages/student/Agendamentos";

// Monitor Pages
import { Dashboard } from "./pages/monitor/Dashboard";
import { Agenda } from "./pages/monitor/Agenda";
import { Sessoes } from "./pages/monitor/Sessoes";
import { Materiais } from "./pages/monitor/Materiais";
import { Feedbacks } from "./pages/monitor/Feedbacks";

// Coordinator Pages
import { Dashboard as CoordinatorDashboard } from "./pages/coordinator/Dashboard";
import { Vagas } from "./pages/coordinator/Vagas";
import { Candidatos } from "./pages/coordinator/Candidatos";
import { Relatorios } from "./pages/coordinator/Relatorios";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/profile" element={<Profile />} />
            
            {/* Student Routes */}
            <Route path="/student/vagas" element={<BuscarVagas />} />
            <Route path="/student/vaga/:vagaId" element={<DetalhesVaga />} />
            <Route path="/student/candidaturas" element={<MinhasCandidaturas />} />
            <Route path="/student/monitores" element={<BuscarMonitores />} />
            <Route path="/student/monitor/:monitorId" element={<PerfilMonitor />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
            
            {/* Monitor Routes */}
            <Route path="/monitor/dashboard" element={<Dashboard />} />
            <Route path="/monitor/agenda" element={<Agenda />} />
            <Route path="/monitor/sessoes" element={<Sessoes />} />
            <Route path="/monitor/materiais" element={<Materiais />} />
            <Route path="/monitor/feedbacks" element={<Feedbacks />} />
            
            {/* Coordinator Routes */}
            <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
            <Route path="/coordinator/vagas" element={<Vagas />} />
            <Route path="/coordinator/candidatos" element={<Candidatos />} />
            <Route path="/coordinator/relatorios" element={<Relatorios />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
