import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Financas from "./pages/Financas";
import Estoque from "./pages/Estoque";
import RH from "./pages/RH";
import Projetos from "./pages/Projetos";
import Relatorios from "./pages/Relatorios";
import Cobrancas from "./pages/Cobrancas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/financas" element={<Financas />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/rh" element={<RH />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/cobrancas" element={<Cobrancas />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
