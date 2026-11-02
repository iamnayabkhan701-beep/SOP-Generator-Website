import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { Dashboard } from './pages/Dashboard';
import { SOPWizard } from './pages/SOPWizard';
import { SOPPreview } from './pages/SOPPreview';
import { Settings } from './pages/Settings';
import { AdminPanel } from './pages/AdminPanel';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPages initialMode="login" />} />
          <Route path="/signup" element={<AuthPages initialMode="signup" />} />
          <Route path="/forgot-password" element={<AuthPages initialMode="forgot" />} />

          {/* Authenticated Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sop/new"
            element={
              <ProtectedRoute>
                <SOPWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sop/:id/edit"
            element={
              <ProtectedRoute>
                <SOPWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sop/:id/preview"
            element={
              <ProtectedRoute>
                <SOPPreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminPanel />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

