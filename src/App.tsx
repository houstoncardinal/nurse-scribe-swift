// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import Index from "./pages/Index";
// import { MVPApp } from "./pages/MVPApp";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { EducationMode } from "@/components/EducationMode";
import { AdminDashboard } from "@/components/AdminDashboard";
import { EnhancedAdminDashboard as AdminDashboardPage } from "@/components/EnhancedAdminDashboard";
import { pwaService } from "@/lib/pwa";
import { supabaseService } from "@/lib/supabase";

const queryClient = new QueryClient();

const MVPAppLazy = lazy(() => import('./pages/MVPApp').then(m => ({ default: m.MVPApp })));

const App = () => {
  console.log('App rendering...');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Authentication state
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');

  // Authentication functions
  const handleSignIn = async (email: string, password: string) => {
    setIsSigningIn(true);
    setAuthError('');

    try {
      // Simulate API call - in real app, this would call your authentication service
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful sign in - redirect to main app
      console.log('Sign in successful, redirecting to main app...');
      window.location.href = '/';
    } catch (error) {
      setAuthError('Invalid email or password. Please try again.');
      console.error('Sign in failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string, role: string) => {
    setIsSigningIn(true);
    setAuthError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful sign up - redirect to main app
      console.log('Sign up successful, redirecting to main app...');
      window.location.href = '/';
    } catch (error) {
      setAuthError('Failed to create account. Please try again.');
      console.error('Sign up failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  // Check for app updates and clear caches automatically
  const checkForUpdates = async () => {
    try {
      console.log('🔍 Checking for app updates...');
      
      // Get current version from HTML meta tag
      const currentVersion = document.querySelector('meta[name="version"]')?.getAttribute('content') || '1.0.0';
      const lastKnownVersion = localStorage.getItem('nursescribe-version');
      
      console.log('Current version:', currentVersion);
      console.log('Last known version:', lastKnownVersion);
      
      // Prevent infinite reload loops
      const reloadKey = `reload-${currentVersion}`;
      const hasReloaded = sessionStorage.getItem(reloadKey);
      
      if (hasReloaded) {
        console.log('🔄 Already reloaded for this version, skipping update check');
        return;
      }
      
      // If version changed, clear all caches and update
      if (lastKnownVersion && lastKnownVersion !== currentVersion && lastKnownVersion !== 'null') {
        console.log('🚀 New version detected! Clearing caches...');
        console.log('⚠️ Auto-reload temporarily disabled for development');

        // Temporarily disabled to prevent reload loops during development
        // Mark that we're about to reload for this version
        // sessionStorage.setItem(reloadKey, 'true');

        // Clear all caches
        // if ('caches' in window) {
        //   const cacheNames = await caches.keys();
        //   await Promise.all(cacheNames.map(name => caches.delete(name)));
        //   console.log('✅ All caches cleared');
        // }

        // Clear localStorage items that might cause issues
        // localStorage.removeItem('background-sync-registered');
        // localStorage.removeItem('whisper-model-loaded');

        // Update service worker
        // if ('serviceWorker' in navigator) {
        //   const registration = await navigator.serviceWorker.getRegistration();
        //   if (registration) {
        //     await registration.update();
        //     console.log('✅ Service worker updated');
        //   }
        // }

        // console.log('🎉 App updated to version', currentVersion);
        // console.log('🔄 Auto-reloading to apply updates...');

        // Store the new version before reloading
        // localStorage.setItem('nursescribe-version', currentVersion);

        // Automatically reload to apply the new version
        // window.location.reload();
        // return; // Exit early since we're reloading
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

    // Commented out fallback to prevent reload loops during development
    // const fallbackTimer = setTimeout(() => {
    //   const rootElement = document.getElementById('root');
    //   if (rootElement && !rootElement.innerHTML.trim()) {
    //     console.log('🔄 Fallback: App not loaded, forcing reload...');
    //     window.location.reload();
    //   }
    // }, 3000); // 3 second fallback

    // return () => clearTimeout(fallbackTimer);
    
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
          console.log('⚠️ Auto-reload temporarily disabled for development');

          // Temporarily disabled to prevent reload loops during development
          // const swReloadKey = `sw-reload-${event.data.version}`;
          // const hasSwReloaded = sessionStorage.getItem(swReloadKey);

          // if (hasSwReloaded) {
          //   console.log('🔄 Already reloaded for this SW version, skipping');
          //   return;
          // }

          // console.log('🔄 Auto-reloading to apply service worker updates...');
          // sessionStorage.setItem(swReloadKey, 'true');
          // window.location.reload();
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Suspense fallback={null}><MVPAppLazy /></Suspense>} />
          <Route path="/auth" element={<AuthPage onSignIn={handleSignIn} onSignUp={handleSignUp} isLoading={isSigningIn} error={authError} />} />
          <Route path="/full" element={<Index />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>

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

        {/* Toaster */}
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
