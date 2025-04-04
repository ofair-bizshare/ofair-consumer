
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/providers/AuthProvider';
import About from '@/pages/About';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Login';
import FAQ from '@/pages/FAQ';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import MyRequests from '@/pages/MyRequests';
import MyReferrals from '@/pages/MyReferrals';
import AdminLogin from '@/pages/AdminLogin';
import Search from '@/pages/Search';
import ProfessionalProfile from '@/pages/ProfessionalProfile';
import ScrollToTop from '@/components/ScrollToTop';
import { lazy, Suspense, useEffect } from 'react';
import ArticleDetail from '@/pages/ArticleDetail';
import Articles from '@/pages/Articles';
import ReferralsPage from '@/pages/ReferralsPage';
import { seedProfessionals } from '@/services/professionals';

const AdminDashboard = lazy(() => import('@/pages/Admin/AdminDashboard'));
const ArticlesManager = lazy(() => import('@/pages/Admin/ArticlesManager'));
const MessagesManager = lazy(() => import('@/pages/Admin/MessagesManager'));
const ProfessionalsManager = lazy(() => import('@/pages/Admin/ProfessionalsManager'));
const AdminSettings = lazy(() => import('@/pages/Admin/AdminSettings'));

const queryClient = new QueryClient();

function App() {
  // Run seed function when app starts to ensure we have sample data
  useEffect(() => {
    const initSampleData = async () => {
      try {
        // Seed professionals if needed
        await seedProfessionals();
      } catch (error) {
        console.error('Error initializing sample data:', error);
      }
    };

    initSampleData();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <HelmetProvider>
          <AuthProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-requests" element={<MyRequests />} />
                <Route path="/my-referrals" element={<MyReferrals />} />
                <Route path="/search" element={<Search />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/professionals/:id" element={<ProfessionalProfile />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:id" element={<ArticleDetail />} />
                <Route path="/referrals" element={<ReferralsPage />} />
                
                {/* Admin routes */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <Suspense fallback={<div>טוען...</div>}>
                      <AdminDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="/admin/articles"
                  element={
                    <Suspense fallback={<div>טוען...</div>}>
                      <ArticlesManager />
                    </Suspense>
                  }
                />
                <Route
                  path="/admin/messages"
                  element={
                    <Suspense fallback={<div>טוען...</div>}>
                      <MessagesManager />
                    </Suspense>
                  }
                />
                <Route
                  path="/admin/professionals"
                  element={
                    <Suspense fallback={<div>טוען...</div>}>
                      <ProfessionalsManager />
                    </Suspense>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <Suspense fallback={<div>טוען...</div>}>
                      <AdminSettings />
                    </Suspense>
                  }
                />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AuthProvider>
          <Toaster />
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
