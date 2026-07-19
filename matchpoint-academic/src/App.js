import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import RecommendationEngine from './pages/admin/RecommendationEngine';
import SpecializationPredictor from './pages/admin/SpecializationPredictor';
import WorkloadDashboard from './pages/admin/WorkloadDashboard';
import SubjectRequests from './pages/admin/SubjectRequests';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyProfile from './pages/faculty/FacultyProfile';
import RequestSubject from './pages/faculty/RequestSubject';

// Protected route wrapper
function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/faculty'} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={user
          ? <Navigate to={user.role === 'admin' ? '/admin' : '/faculty'} replace />
          : <LoginPage />
        }
      />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/recommendation" element={
        <ProtectedRoute requiredRole="admin"><RecommendationEngine /></ProtectedRoute>
      } />
      <Route path="/admin/specialization" element={
        <ProtectedRoute requiredRole="admin"><SpecializationPredictor /></ProtectedRoute>
      } />
      <Route path="/admin/workload" element={
        <ProtectedRoute requiredRole="admin"><WorkloadDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/requests" element={
        <ProtectedRoute requiredRole="admin"><SubjectRequests /></ProtectedRoute>
      } />

      {/* Faculty routes */}
      <Route path="/faculty" element={
        <ProtectedRoute requiredRole="faculty"><FacultyDashboard /></ProtectedRoute>
      } />
      <Route path="/faculty/profile" element={
        <ProtectedRoute requiredRole="faculty"><FacultyProfile /></ProtectedRoute>
      } />
      <Route path="/faculty/request" element={
        <ProtectedRoute requiredRole="faculty"><RequestSubject /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
