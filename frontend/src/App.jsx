import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import ResidentDashboard from './pages/ResidentDashboard';
import GuardDashboard from './pages/GuardDashboard';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Fixed missing /login route */}
          <Route path="/login" element={<AuthPage />} />
          
          <Route path="/resident-dashboard" element={
            <ProtectedRoute allowedRole="Resident">
              <ResidentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/guard-dashboard" element={
            <ProtectedRoute allowedRole="Guard">
              <GuardDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}