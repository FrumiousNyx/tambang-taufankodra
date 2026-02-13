import React, { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ScrollProgress from "@/components/ScrollProgress";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageSkeleton from "@/components/PageSkeleton";
import Chatbot from "./components/Chatbot";

// Lazy load semua pages untuk code splitting
const Index = React.lazy(() => import("./pages/Index"));
const Products = React.lazy(() => import("./pages/Products"));
const Projects = React.lazy(() => import("./pages/Projects"));
const Download = React.lazy(() => import("./pages/Download"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Auth = React.lazy(() => import("./pages/Auth"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Sustainability = React.lazy(() => import("./pages/Sustainability"));
const InvestorRelations = React.lazy(() => import("./pages/InvestorRelations"));
const CSR = React.lazy(() => import("./pages/CSR"));

// Optimized QueryClient dengan caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// --- INTEGRASI GOOGLE ANALYTICS ---
const TRACKING_ID = "G-DZJ5HSTQBG";

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", TRACKING_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};
// ----------------------------------

// Protected Route Component
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

// Fallback components yang dioptimasi
const HomeFallback = () => <PageSkeleton type="hero" />;
const DefaultFallback = () => <PageSkeleton type="default" />;
const CardFallback = () => <PageSkeleton type="card" />;
const ListFallback = () => <PageSkeleton type="list" />;
const AuthFallback = () => <LoadingSpinner size="lg" text="Loading..." />;

const AppContent: React.FC = () => {
  return (
    <ErrorBoundary>
      <ScrollProgress />
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                {/* Tracker diletakkan di dalam BrowserRouter agar bisa mengakses useLocation */}
                <AnalyticsTracker />
                
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <Suspense fallback={<HomeFallback />}>
                        <Index />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/produk" 
                    element={
                      <Suspense fallback={<CardFallback />}>
                        <Products />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/produk/:slug" 
                    element={
                      <Suspense fallback={<CardFallback />}>
                        <Products />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/proyek" 
                    element={
                      <Suspense fallback={<CardFallback />}>
                        <Projects />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/proyek/:slug" 
                    element={
                      <Suspense fallback={<CardFallback />}>
                        <Projects />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/download" 
                    element={
                      <Suspense fallback={<DefaultFallback />}>
                        <Download />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/tentang" 
                    element={
                      <Suspense fallback={<DefaultFallback />}>
                        <About />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/kontak" 
                    element={
                      <Suspense fallback={<DefaultFallback />}>
                        <Contact />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/keberlanjutan" 
                    element={
                      <Suspense fallback={<ListFallback />}>
                        <Sustainability />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/investor" 
                    element={
                      <Suspense fallback={<CardFallback />}>
                        <InvestorRelations />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/csr" 
                    element={
                      <Suspense fallback={<ListFallback />}>
                        <CSR />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/auth" 
                    element={
                      <Suspense fallback={<AuthFallback />}>
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
                    path="*" 
                    element={
                      <Suspense fallback={<DefaultFallback />}>
                        <NotFound />
                      </Suspense>
                    } 
                  />
                </Routes>
                <Chatbot />
              </BrowserRouter>
            </QueryClientProvider>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

const App = () => <AppContent />;

export default App;