
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/providers/AuthProvider";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import About from "./pages/About";
import MyReferrals from "./pages/MyReferrals";
import ReferralsPage from "./pages/ReferralsPage";
import MyRequests from "./pages/MyRequests";
import UserSettings from "./pages/UserSettings";
import FAQ from "./pages/FAQ";
import ScrollToTop from "./components/ScrollToTop";

// Admin Routes
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProfessionalsManager from "./pages/Admin/ProfessionalsManager";
import ArticlesManager from "./pages/Admin/ArticlesManager";
import MessagesManager from "./pages/Admin/MessagesManager";
import AdminSettings from "./pages/Admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <ScrollToTop />
              <div className="font-assistant">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/requests" element={<MyRequests />} />
                  <Route path="/dashboard/settings" element={<UserSettings />} />
                  <Route path="/professional/:id" element={<ProfessionalProfile />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/article/:id" element={<ArticleDetail />} />
                  <Route path="/articles/:id" element={<ArticleDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/referrals" element={<ReferralsPage />} />
                  <Route path="/faq" element={<FAQ />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/professionals" element={<ProfessionalsManager />} />
                  <Route path="/admin/articles" element={<ArticlesManager />} />
                  <Route path="/admin/messages" element={<MessagesManager />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);

export default App;
