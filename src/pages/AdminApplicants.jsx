/**
 * Admin applicants management page
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle,
  CreditCard,
  FileText,
  AlertCircle
} from 'lucide-react';

const AdminApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getApplicants();
      setApplicants(response.applicants || []);
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
      setError('Error al cargar los solicitantes');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicantDetails = async (applicantId) => {
    try {
      const response = await apiClient.getApplicantDetails(applicantId);
      setSelectedApplicant(response.applicant);
      setShowDetails(true);
    } catch (error) {
      console.error('Failed to fetch applicant details:', error);
      setError('Error al cargar los detalles del solicitante');
    }
  };

  const updateApplicationStatus = async (applicantId, newStatus) => {
    try {
      await apiClient.updateApplicationStatus(applicantId, newStatus);
      await fetchApplicants();
      setError(null);
    } catch (error) {
      console.error('Failed to update application status:', error);
      setError('Error al actualizar el estado de la solicitud');
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Aprobado',
          variant: 'default',
          className: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'under_review':
        return {
          label: 'En Revisión',
          variant: 'secondary',
          className: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        };
      case 'pending_bank_info':
        return {
          label: 'Pendiente Info Bancaria',
          variant: 'outline',
          className: 'bg-blue-100 text-blue-800',
          icon: CreditCard
        };
      case 'rejected':
        return {
          label: 'Rechazado',
          variant: 'destructive',
          className: 'bg-red-100 text-red-800',
          icon: XCircle
        };
      case 'incomplete':
        return {
          label: 'Incompleto',
          variant: 'outline',
          className: 'bg-gray-100 text-gray-800',
          icon: AlertCircle
        };
      default:
        return {
          label: 'Desconocido',
          variant: 'outline',
          className: 'bg-gray-100 text-gray-800',
          icon: AlertCircle
        };
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = 
      applicant.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.profile?.curp?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || applicant.application_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Solicitantes</h1>
        <p className="text-gray-600 mt-2">
          Administra las solicitudes de préstamo y revisa la información de los solicitantes
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{applicants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">En Revisión</p>
                <p className="text-2xl font-bold">
                  {applicants.filter(a => a.application_status === 'under_review').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Aprobados</p>
                <p className="text-2xl font-bold">
                  {applicants.filter(a => a.application_status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pendiente Info</p>
                <p className="text-2xl font-bold">
                  {applicants.filter(a => a.application_status === 'pending_bank_info').length}
                </p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, email o CURP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="incomplete">Incompleto</SelectItem>
                  <SelectItem value="pending_bank_info">Pendiente Info Bancaria</SelectItem>
                  <SelectItem value="under_review">En Revisión</SelectItem>
                  <SelectItem value="approved">Aprobado</SelectItem>
                  <SelectItem value="rejected">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitantes ({filteredApplicants.length})</CardTitle>
          <CardDescription>
            Lista de todos los solicitantes registrados en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>CURP</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => {
                  const statusInfo = getStatusInfo(applicant.application_status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <TableRow key={applicant.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {applicant.profile?.first_name} {applicant.profile?.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {applicant.profile?.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{applicant.email}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {applicant.profile?.curp || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusInfo.className}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(applicant.created_at).toLocaleDateString('es-MX')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchApplicantDetails(applicant.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select
                            value={applicant.application_status}
                            onValueChange={(value) => updateApplicationStatus(applicant.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="incomplete">Incompleto</SelectItem>
                              <SelectItem value="pending_bank_info">Pendiente Info</SelectItem>
                              <SelectItem value="under_review">En Revisión</SelectItem>
                              <SelectItem value="approved">Aprobar</SelectItem>
                              <SelectItem value="rejected">Rechazar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Applicant Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Solicitante</DialogTitle>
            <DialogDescription>
              Información completa del solicitante y su solicitud
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplicant && (
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Nombre Completo</Label>
                    <p className="text-sm">
                      {selectedApplicant.profile?.first_name} {selectedApplicant.profile?.last_name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="text-sm">{selectedApplicant.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Teléfono</Label>
                    <p className="text-sm">{selectedApplicant.profile?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">CURP</Label>
                    <p className="text-sm font-mono">{selectedApplicant.profile?.curp || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              {selectedApplicant.profile?.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dirección</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {selectedApplicant.profile.address.street}<br />
                      {selectedApplicant.profile.address.city}, {selectedApplicant.profile.address.state}<br />
                      CP: {selectedApplicant.profile.address.postal_code}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Bank Credentials */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Bancaria</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedApplicant.bank_credentials?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedApplicant.bank_credentials.map((credential, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{credential.provider?.display_name}</p>
                            <p className="text-sm text-gray-500">Usuario: {credential.username}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No hay información bancaria registrada</p>
                  )}
                </CardContent>
              </Card>

              {/* Application Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estado de la Solicitud</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const statusInfo = getStatusInfo(selectedApplicant.application_status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <>
                          <StatusIcon className="h-5 w-5" />
                          <Badge className={statusInfo.className}>
                            {statusInfo.label}
                          </Badge>
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Última actualización: {new Date(selectedApplicant.updated_at).toLocaleString('es-MX')}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApplicants;

