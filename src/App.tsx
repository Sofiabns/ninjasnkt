import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import InvestigatorSelection from "./pages/InvestigatorSelection";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import People from "./pages/People";
import Factions from "./pages/Factions";
import Investigations from "./pages/Investigations";
import ClosedCases from "./pages/ClosedCases";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Main App Router Component
const AppRouter = () => {
  const { state } = useApp();
  
  // If no investigator is selected, show selection screen
  if (!state.currentInvestigator) {
    return <InvestigatorSelection />;
  }
  
  // Otherwise show the main application
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/people" element={<People />} />
        <Route path="/factions" element={<Factions />} />
        <Route path="/investigations" element={<Investigations />} />
        <Route path="/closed-cases" element={<ClosedCases />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
