/**
 * FIXED App.jsx with proper routing and imports
 * This version ensures the bank-credentials route works correctly
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BankCredentials from './pages/BankCredentials';
import AdminApplicants from './pages/AdminApplicants';
import AdminTickets from './pages/AdminTickets';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/bank-credentials" element={
              <ProtectedRoute>
                <Layout>
                  <BankCredentials />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin/applicants" element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <AdminApplicants />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/tickets" element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <AdminTickets />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect root to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

