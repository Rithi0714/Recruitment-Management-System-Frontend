import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Pages
import Landing from '@/pages/Landing';
import LoginPage from '@/pages/LoginPage';

// HR Pages
import HRDashboard from '@/pages/hr/HRDashboard';
import HRCandidates from '@/pages/hr/HRCandidates';
import HRInterviews from '@/pages/hr/HRInterviews';
import HRSelected from '@/pages/hr/HRSelected';
import HRRecruiters from '@/pages/hr/HRRecruiters';
import HRSettings from '@/pages/hr/HRSettings';

// Recruiter Pages
import RecruiterDashboard from '@/pages/recruiter/RecruiterDashboard';
import RecruiterCandidates from '@/pages/recruiter/RecruiterCandidates';
import RecruiterInterviews from '@/pages/recruiter/RecruiterInterviews';
import RecruiterSettings from '@/pages/recruiter/RecruiterSettings';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminCandidates from '@/pages/admin/AdminCandidates';
import AdminInterviews from '@/pages/admin/AdminInterviews';
import AdminRecruiters from '@/pages/admin/AdminRecruiters';
import AdminSelected from '@/pages/admin/AdminSelected';

// Layout
import DashboardLayout from '@/components/layout/DashboardLayout';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />

      {/* HR Routes */}
      <Route element={<DashboardLayout role="hr" />}>
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr/candidates" element={<HRCandidates />} />
        <Route path="/hr/interviews" element={<HRInterviews />} />
        <Route path="/hr/selected" element={<HRSelected />} />
        <Route path="/hr/recruiters" element={<HRRecruiters />} />
        <Route path="/hr/settings" element={<HRSettings />} />
      </Route>

      {/* Recruiter Routes */}
      <Route element={<DashboardLayout role="recruiter" />}>
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/candidates" element={<RecruiterCandidates />} />
        <Route path="/recruiter/interviews" element={<RecruiterInterviews />} />
        <Route path="/recruiter/settings" element={<RecruiterSettings />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<DashboardLayout role="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/candidates" element={<AdminCandidates />} />
        <Route path="/admin/interviews" element={<AdminInterviews />} />
        <Route path="/admin/recruiters" element={<AdminRecruiters />} />
        <Route path="/admin/selected" element={<AdminSelected />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App