import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { 
  Users, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import { apiClient } from '../lib/api';

const AdminApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [credentialsError, setCredentialsError] = useState(null);
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      console.log('Fetching applicants...');
      
      const response = await apiClient.getApplicants();
      console.log('Applicants response:', response);
      setApplicants(response.applicants || []);
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
      setError('Error al actualizar el estado: ' + error.message);
      
      // Fallback data for testing
      setApplicants([
        {
          id: '1',
          first_name: 'Juan',
          last_name: 'Soco',
          email: 'juan@socopwa.com',
          curp: 'SOCJ850101HDFRRL01',
          phone: '+52 55 1234 5678',
          status: 'pending',
          created_at: '2025-07-30T20:00:00Z'
        },
        {
          id: '2',
          first_name: 'María',
          last_name: 'González',
          email: 'maria@example.com',
          curp: 'GOMA900215MDFNRL02',
          phone: '+52 55 9876 5432',
          status: 'approved',
          created_at: '2025-07-29T15:30:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      await apiClient.updateApplicantStatus(applicantId, newStatus);
      await fetchApplicants(); // Refresh the list
    } catch (error) {
      console.error('Failed to update status:', error);
      setError('Error al actualizar el estado: ' + error.message);
    }
  };

  const viewCredentials = async (applicantId) => {
    try {
      setCredentialsLoading(true);
      setCredentialsError(null);
      console.log('Fetching credentials for applicant:', applicantId);
      
      const response = await apiClient.getApplicantCredentials(applicantId);
      console.log('Credentials response:', response);
      
      setCredentials(response.credentials || []);
      setSelectedApplicant(applicants.find(a => a.id === applicantId));
      setShowCredentials(true);
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
      setCredentialsError('Error al obtener credenciales: ' + error.message);
      
      // Show fallback data for testing
      setCredentials([
        {
          id: '1',
          provider_name: 'BBVA México',
          username: 'juan.test@bbva.com',
          created_at: '2025-07-30T21:00:00Z'
        }
      ]);
      setSelectedApplicant(applicants.find(a => a.id === applicantId));
      setShowCredentials(true);
    } finally {
      setCredentialsLoading(false);
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = 
      applicant.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.curp?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Aprobado' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rechazado' },
      reviewing: { color: 'bg-blue-100 text-blue-800', icon: Eye, text: 'En Revisión' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getStats = () => {
    const total = applicants.length;
    const pending = applicants.filter(a => a.status === 'pending').length;
    const approved = applicants.filter(a => a.status === 'approved').length;
    const reviewing = applicants.filter(a => a.status === 'reviewing').length;

    return { total, pending, approved, reviewing };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mt-2">Cargando solicitantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Solicitantes</h1>
        <p className="text-gray-600 mt-2">
          Administra las solicitudes de préstamo y revisa la información de los solicitantes
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendiente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aprobados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Revisión</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reviewing}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
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
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="reviewing">En Revisión</SelectItem>
                <SelectItem value="approved">Aprobado</SelectItem>
                <SelectItem value="rejected">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Solicitantes ({filteredApplicants.length})
          </h2>
          <p className="text-sm text-gray-600">
            Lista de todos los solicitantes registrados en la plataforma
          </p>
        </div>

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
              {filteredApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No hay solicitantes</p>
                      <p className="text-sm">No se encontraron solicitantes con los filtros actuales</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {applicant.first_name} {applicant.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{applicant.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900">{applicant.email}</p>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {applicant.curp}
                      </code>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(applicant.status || 'pending')}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900">
                        {new Date(applicant.created_at).toLocaleDateString('es-MX')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplicant(applicant);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewCredentials(applicant.id)}
                          disabled={credentialsLoading}
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Applicant Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Solicitante</DialogTitle>
            <DialogDescription>
              Información completa del solicitante seleccionado
            </DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                  <p className="text-sm text-gray-900">
                    {selectedApplicant.first_name} {selectedApplicant.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedApplicant.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CURP</label>
                  <p className="text-sm text-gray-900">{selectedApplicant.curp}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Teléfono</label>
                  <p className="text-sm text-gray-900">{selectedApplicant.phone}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <div className="mt-1">
                  <Select 
                    value={selectedApplicant.status || 'pending'} 
                    onValueChange={(newStatus) => {
                      handleStatusChange(selectedApplicant.id, newStatus);
                      setSelectedApplicant({...selectedApplicant, status: newStatus});
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="reviewing">En Revisión</SelectItem>
                      <SelectItem value="approved">Aprobado</SelectItem>
                      <SelectItem value="rejected">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bank Credentials Dialog */}
      <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Credenciales Bancarias</DialogTitle>
            <DialogDescription>
              Información bancaria del solicitante: {selectedApplicant?.first_name} {selectedApplicant?.last_name}
            </DialogDescription>
          </DialogHeader>

          {credentialsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-gray-600">Cargando credenciales...</p>
            </div>
          ) : credentialsError ? (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {credentialsError}
              </AlertDescription>
            </Alert>
          ) : credentials.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay credenciales bancarias registradas</p>
              <p className="text-sm text-gray-500">El solicitante no ha conectado ningún banco</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4">
                {credentials.map((credential, index) => (
                  <Card key={credential.id || index} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{credential.provider_name}</CardTitle>
                        <Badge variant="outline">Conectado</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Usuario</label>
                          <p className="text-sm text-gray-900">{credential.username}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Fecha de Conexión</label>
                          <p className="text-sm text-gray-900">
                            {new Date(credential.created_at).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                          <p className="text-sm text-yellow-800">
                            Las credenciales están encriptadas y almacenadas de forma segura
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApplicants;

