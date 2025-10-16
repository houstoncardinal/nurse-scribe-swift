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
import { PowerfulAdminDashboard as AdminDashboardPage } from "@/components/PowerfulAdminDashboard";
import { pwaService } from "@/lib/pwa";
import { supabaseService } from "@/lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  console.log('App rendering...');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Check for app updates and clear caches automatically
  const checkForUpdates = async () => {
    try {
      console.log('🔍 Checking for app updates...');
      
      // Get current version from HTML meta tag
      const currentVersion = document.querySelector('meta[name="version"]')?.getAttribute('content') || '1.0.0';
      const lastKnownVersion = localStorage.getItem('nursescribe-version');
      
      console.log('Current version:', currentVersion);
      console.log('Last known version:', lastKnownVersion);
      
      // If version changed, clear all caches and update
      if (lastKnownVersion && lastKnownVersion !== currentVersion) {
        console.log('🚀 New version detected! Clearing caches...');
        
        // Clear all caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
          console.log('✅ All caches cleared');
        }
        
        // Clear localStorage items that might cause issues
        localStorage.removeItem('background-sync-registered');
        localStorage.removeItem('whisper-model-loaded');
        
        // Update service worker
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            await registration.update();
            console.log('✅ Service worker updated');
          }
        }
        
        console.log('🎉 App updated to version', currentVersion);
      }
      
      // Store current version
      localStorage.setItem('nursescribe-version', currentVersion);
      
    } catch (error) {
      console.error('❌ Error checking for updates:', error);
    }
  };

  useEffect(() => {
    // Check for app updates and clear caches automatically
    checkForUpdates();
    
    // Initialize PWA service
    pwaService.initialize().catch(console.error);

    // Initialize Supabase if configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('🔍 Checking Supabase environment variables...');
    console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
    console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Present' : '❌ Missing');
    
    if (supabaseUrl && supabaseKey) {
      console.log('🚀 Initializing Supabase with provided credentials...');
      supabaseService.initialize({
        url: supabaseUrl,
        anonKey: supabaseKey,
        encrypted: true
      }).then(() => {
        console.log('✅ Supabase initialization completed');
      }).catch((error) => {
        console.error('❌ Supabase initialization failed:', error);
      });
    } else {
      console.warn('⚠️ Supabase environment variables not found - continuing without Supabase integration');
    }

    // Handle PWA events
    const handleInstallAvailable = () => {
      console.log('PWA install available');
    };

    const handleUpdateAvailable = () => {
      console.log('PWA update available');
    };

    // Handle service worker messages
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SW_UPDATED') {
        console.log('🔄 Service worker updated to version:', event.data.version);
        // Optionally reload the page to ensure fresh state
        if (confirm('New version available! Reload to get the latest updates?')) {
          window.location.reload();
        }
      }
    };

    const handleOffline = () => {
      console.log('App is offline');
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);
    window.addEventListener('pwa-offline', handleOffline);
    
    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
      window.removeEventListener('pwa-offline', handleOffline);
      
      // Clean up service worker listener
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
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
            <Route path="/admin" element={<AdminDashboardPage />} />
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
