import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { initSentry } from '@/utils/sentry';
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load pages
const Index = React.lazy(() => import("./pages/Index"));
const Products = React.lazy(() => import("./pages/Products"));
const Projects = React.lazy(() => import("./pages/Projects"));
const Download = React.lazy(() => import("./pages/Download"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Sustainability = React.lazy(() => import("./pages/Sustainability"));
const InvestorRelations = React.lazy(() => import("./pages/InvestorRelations"));
const CSR = React.lazy(() => import("./pages/CSR"));
const Admin = React.lazy(() => import("./pages/Admin"));
const CMS = React.lazy(() => import("./pages/CMS"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Optimized QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaced cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Google Analytics
const TRACKING_ID = "G-DZJ5HSTQBG";

const AnalyticsTracker = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (window.gtag) {
      window.gtag("config", TRACKING_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Simple fallback
const SimpleFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  React.useEffect(() => { initSentry(); }, []);
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AnalyticsTracker />
                
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <Index />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/produk" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <Products />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/produk/:slug" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <Products />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/proyek" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <Projects />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/proyek/:slug" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <Projects />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/download" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <Download />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/tentang" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <About />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/kontak" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <Contact />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/keberlanjutan" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <Sustainability />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/investor" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <InvestorRelations />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/csr" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <CSR />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/auth" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <Auth />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<LoadingSpinner size="lg" text="Loading dashboard..." />}>
                          <Dashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <Admin />
                      </Suspense>
                    }
                  />
                  <Route 
                    path="/cms" 
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<LoadingSpinner size="lg" text="Loading CMS..." />}>
                          <CMS />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="*" 
                    element={
                      <Suspense fallback={<SimpleFallback />}>
                        <NotFound />
                      </Suspense>
                    } 
                  />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

const App = () => <AppContent />;

export default App;
