
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Search from '@/pages/Search';
import ProfessionalProfile from '@/pages/ProfessionalProfile';
import Dashboard from '@/pages/Dashboard';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Articles from '@/pages/Articles';
import ArticleDetail from '@/pages/ArticleDetail';
import FAQ from '@/pages/FAQ';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';
import AdminLogin from '@/pages/AdminLogin';
import Settings from '@/pages/Settings'; 
import MyReferrals from '@/pages/MyReferrals';
import MyRequests from '@/pages/MyRequests';
import ReferralsPage from '@/pages/ReferralsPage';

// Admin Pages
import AdminDashboard from '@/pages/Admin/AdminDashboard';
import ProfessionalsManager from '@/pages/Admin/ProfessionalsManager';
import ArticlesManager from '@/pages/Admin/ArticlesManager';
import MessagesManager from '@/pages/Admin/MessagesManager';
import AdminSettings from '@/pages/Admin/AdminSettings';

// Context Providers
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/providers/AuthProvider';

// Components
import ScrollToTop from '@/components/ScrollToTop';
import { Toaster } from '@/components/ui/toaster';
import PhoneRequiredDialog from '@/components/auth/PhoneRequiredDialog';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <HelmetProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/search" element={<Search />} />
                <Route path="/professional/:id" element={<ProfessionalProfile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/referrals" element={<ReferralsPage />} />
                <Route path="/my-referrals" element={<MyReferrals />} />
                <Route path="/my-requests" element={<MyRequests />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:slug" element={<ArticleDetail />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
                {/* Admin Routes */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/professionals" element={<ProfessionalsManager />} />
                <Route path="/admin/articles" element={<ArticlesManager />} />
                <Route path="/admin/messages" element={<MessagesManager />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <PhoneRequiredDialog />
              <Toaster />
            </BrowserRouter>
          </HelmetProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
