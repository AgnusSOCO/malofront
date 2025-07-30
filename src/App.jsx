import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BankCredentials from './pages/BankCredentials';
import AdminApplicants from './pages/AdminApplicants';
import AdminTickets from './pages/AdminTickets';

// Placeholder components for routes that will be implemented later
const Profile = () => <div className="p-6"><h1 className="text-2xl font-bold">Mi Perfil</h1><p>Página en desarrollo...</p></div>;
const AdminPanel = () => <div className="p-6"><h1 className="text-2xl font-bold">Panel de Administración</h1><p>Página en desarrollo...</p></div>;
const AdminAudit = () => <div className="p-6"><h1 className="text-2xl font-bold">Logs de Auditoría</h1><p>Página en desarrollo...</p></div>;
const Unauthorized = () => <div className="p-6"><h1 className="text-2xl font-bold">No Autorizado</h1><p>No tienes permisos para acceder a esta página.</p></div>;

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Applicant routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute requireRole="applicant">
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/bank-credentials"
            element={
              <ProtectedRoute requireRole="applicant">
                <Layout>
                  <BankCredentials />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/applicants"
            element={
              <ProtectedRoute requireRole="admin">
                <Layout>
                  <AdminApplicants />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tickets"
            element={
              <ProtectedRoute requireRole="admin">
                <Layout>
                  <AdminTickets />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/audit"
            element={
              <ProtectedRoute requireRole="admin">
                <Layout>
                  <AdminAudit />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
