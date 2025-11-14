import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

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
import { BuscarVagas } from "./pages/student/BuscarVagas"; // legacy list view (optional)
import { MonitoriasKanban } from "./pages/student/MonitoriasKanban";
import { DetalhesVaga } from "./pages/student/DetalhesVaga";
import { MinhasCandidaturas } from "./pages/student/MinhasCandidaturas";
import { MonitoresAtivos } from "./pages/student/MonitoresAtivos";
// Removed student scheduling and monitor search pages

// Monitor Pages
import { Dashboard } from "./pages/monitor/Dashboard";
import { Agenda } from "./pages/monitor/Agenda";
import { Sessoes } from "./pages/monitor/Sessoes";
import { Materiais } from "./pages/monitor/Materiais";

// Coordinator Pages
import { Dashboard as CoordinatorDashboard } from "./pages/coordinator/Dashboard";
import { Vagas } from "./pages/coordinator/Vagas";
import { Candidatos } from "./pages/coordinator/Candidatos";
import { Relatorios } from "./pages/coordinator/Relatorios";
import { EditarVaga } from "./pages/coordinator/EditarVaga";
import { VagaCandidatos } from "./pages/coordinator/VagaCandidatos";
import { NovaVaga } from "./pages/coordinator/NovaVaga";
// Professor Pages
import { Dashboard as ProfessorDashboard } from "./pages/professor/Dashboard";
import { Candidaturas as ProfessorCandidaturas } from "./pages/professor/Candidaturas";
import { Horas as ProfessorHoras } from "./pages/professor/Horas";

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
            <Route
              path="/student/vagas"
              element={<ProtectedRoute roles={["aluno"]}><MonitoriasKanban /></ProtectedRoute>}
            />
            <Route
              path="/student/vaga/:vagaId"
              element={<ProtectedRoute roles={["aluno"]}><DetalhesVaga /></ProtectedRoute>}
            />
            <Route
              path="/student/candidaturas"
              element={<ProtectedRoute roles={["aluno"]}><MinhasCandidaturas /></ProtectedRoute>}
            />
            <Route
              path="/student/monitores"
              element={<ProtectedRoute roles={["aluno"]}><MonitoresAtivos /></ProtectedRoute>}
            />
            {/* Removed routes related to aluno agendamento and monitor profiles */}
            
            {/* Monitor Routes */}
            <Route path="/monitor/dashboard" element={<ProtectedRoute roles={["monitor"]}><Dashboard /></ProtectedRoute>} />
            <Route path="/monitor/agenda" element={<ProtectedRoute roles={["monitor"]}><Agenda /></ProtectedRoute>} />
            <Route path="/monitor/sessoes" element={<ProtectedRoute roles={["monitor"]}><Sessoes /></ProtectedRoute>} />
            <Route path="/monitor/materiais" element={<ProtectedRoute roles={["monitor"]}><Materiais /></ProtectedRoute>} />
            
            {/* Coordinator Routes */}
            <Route path="/coordinator/dashboard" element={<ProtectedRoute roles={["coordenador"]}><CoordinatorDashboard /></ProtectedRoute>} />
            <Route path="/coordinator/vagas" element={<ProtectedRoute roles={["coordenador"]}><Vagas /></ProtectedRoute>} />
            <Route path="/coordinator/vagas/nova" element={<ProtectedRoute roles={["coordenador"]}><NovaVaga /></ProtectedRoute>} />
            <Route path="/coordinator/vagas/editar/:vagaId" element={<ProtectedRoute roles={["coordenador"]}><EditarVaga /></ProtectedRoute>} />
            <Route path="/coordinator/vaga/:vagaId" element={<ProtectedRoute roles={["coordenador"]}><VagaCandidatos /></ProtectedRoute>} />
            <Route path="/coordinator/candidatos" element={<ProtectedRoute roles={["coordenador"]}><Candidatos /></ProtectedRoute>} />
            <Route path="/coordinator/relatorios" element={<ProtectedRoute roles={["coordenador"]}><Relatorios /></ProtectedRoute>} />

            {/* Professor Routes */}
            <Route path="/professor/dashboard" element={<ProtectedRoute roles={["professor"]}><ProfessorDashboard /></ProtectedRoute>} />
            <Route path="/professor/candidaturas" element={<ProtectedRoute roles={["professor"]}><ProfessorCandidaturas /></ProtectedRoute>} />
            <Route path="/professor/horas" element={<ProtectedRoute roles={["professor"]}><ProfessorHoras /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
