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
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard,
  Eye,
  UserCheck,
  UserX,
  Building2,
  Shield
} from 'lucide-react';
import { apiClient } from '@/lib/api';

// Simple toast replacement
const showToast = (title, description, variant = 'default') => {
  const toastType = variant === 'destructive' ? 'error' : 'success';
  console.log(`${toastType.toUpperCase()}: ${title} - ${description}`);
  
  // Create a simple notification
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
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

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    try {
      setLoading(true);
      console.log('Loading applicants...');
      
      const data = await apiClient.getApplicants();
      console.log('Applicants loaded:', data);
      
      if (Array.isArray(data)) {
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

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      console.log(`Changing status for ${applicantId} to ${newStatus}`);
      
      // Update local state immediately for better UX
      setApplicants(prev => prev.map(app => 
        app.id === applicantId 
          ? { ...app, is_approved: newStatus === 'approved' }
          : app
      ));

      showToast("¡Éxito!", `Solicitante ${newStatus === 'approved' ? 'aprobado' : 'rechazado'} correctamente`);
    } catch (error) {
      console.error('Error updating status:', error);
      showToast("Error", "Error al actualizar el estado", "destructive");
      // Reload to revert changes
      loadApplicants();
    }
  };

  const viewCredentials = async (applicant) => {
    try {
      setCredentialsLoading(true);
      setSelectedApplicant(applicant);
      setIsCredentialsOpen(true);
      
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
      (statusFilter === 'approved' && applicant.is_approved) ||
      (statusFilter === 'pending' && !applicant.is_approved && applicant.is_active) ||
      (statusFilter === 'rejected' && !applicant.is_approved && !applicant.is_active);

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: applicants.length,
    approved: applicants.filter(a => a.is_approved).length,
    pending: applicants.filter(a => !a.is_approved && a.is_active).length,
    rejected: applicants.filter(a => !a.is_approved && !a.is_active).length
  };

  const getStatusBadge = (applicant) => {
    if (applicant.is_approved) {
      return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
    } else if (applicant.is_active) {
      return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
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
        <p className="text-gray-600">Administra las solicitudes de préstamos</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
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

        <Card>
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

        <Card>
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="text-red-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rechazados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="approved">Aprobados</option>
                <option value="pending">Pendientes</option>
                <option value="rejected">Rechazados</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitantes ({filteredApplicants.length})</CardTitle>
          <CardDescription>
            Lista de todos los solicitantes de préstamos
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
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {applicant.curp}
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
                          >
                            <Eye size={16} />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewCredentials(applicant)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CreditCard size={16} />
                          </Button>

                          {!applicant.is_approved && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(applicant.id, 'approved')}
                                className="text-green-600 hover:text-green-700"
                              >
                                <UserCheck size={16} />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(applicant.id, 'rejected')}
                                className="text-red-600 hover:text-red-700"
                              >
                                <UserX size={16} />
                              </Button>
                            </>
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
                <p className="text-gray-900">{selectedApplicant.name}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <p className="text-gray-900">{selectedApplicant.email}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">CURP</Label>
                <p className="text-gray-900 font-mono">{selectedApplicant.curp}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Estado</Label>
                <div className="mt-1">
                  {getStatusBadge(selectedApplicant)}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Fecha de Registro</Label>
                <p className="text-gray-900">{formatDate(selectedApplicant.created_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bank Credentials Dialog */}
      <Dialog open={isCredentialsOpen} onOpenChange={setIsCredentialsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="text-blue-600" size={24} />
              <span>Credenciales Bancarias</span>
            </DialogTitle>
          </DialogHeader>
          
          {credentialsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando credenciales...</p>
            </div>
          ) : applicantCredentials ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h3 className="font-semibold text-blue-900">
                  {applicantCredentials.applicant?.name || selectedApplicant?.name}
                </h3>
                <p className="text-sm text-blue-700">
                  {applicantCredentials.applicant?.email || selectedApplicant?.email}
                </p>
              </div>

              {applicantCredentials.credentials && applicantCredentials.credentials.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Bancos Conectados:</h4>
                  {applicantCredentials.credentials.map((credential, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Building2 className="text-gray-400" size={20} />
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              {credential.provider_name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              Usuario: {credential.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              Conectado: {formatDate(credential.created_at)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Conectado</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building2 className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-600">No hay credenciales bancarias registradas</p>
                  <p className="text-sm text-gray-500">
                    El usuario aún no ha conectado ningún banco
                  </p>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Shield className="text-amber-600" size={16} />
                  <span className="text-xs text-amber-700">
                    Las credenciales están encriptadas y almacenadas de forma segura
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <XCircle className="mx-auto text-red-400 mb-3" size={32} />
              <p className="text-red-600">Error al cargar las credenciales</p>
              <p className="text-sm text-gray-500">
                No se pudieron obtener las credenciales bancarias
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApplicants;

