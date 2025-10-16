import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import { MVPApp } from "./pages/MVPApp";
import { LandingPage } from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { EducationMode } from "@/components/EducationMode";
import { AdminDashboard } from "@/components/AdminDashboard";
import { pwaService } from "@/lib/pwa";
import { supabaseService } from "@/lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Initialize PWA service
    pwaService.initialize().catch(console.error);

    // Initialize Supabase if configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      supabaseService.initialize({
        url: supabaseUrl,
        anonKey: supabaseKey,
        encrypted: true
      }).catch(console.error);
    }

    // Handle PWA events
    const handleInstallAvailable = () => {
      console.log('PWA install available');
    };

    const handleUpdateAvailable = () => {
      console.log('PWA update available');
    };

    const handleOffline = () => {
      console.log('App is offline');
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);
    window.addEventListener('pwa-offline', handleOffline);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
      window.removeEventListener('pwa-offline', handleOffline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MVPApp />} />
            <Route path="/full" element={<Index />} />
            <Route path="/landing" element={<LandingPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
        {/* Global Modals */}
        <AnalyticsDashboard 
          isOpen={showAnalytics} 
          onClose={() => setShowAnalytics(false)} 
        />
        <EducationMode 
          isOpen={showEducation} 
          onClose={() => setShowEducation(false)} 
        />
        <AdminDashboard 
          isOpen={showAdmin} 
          onClose={() => setShowAdmin(false)} 
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
