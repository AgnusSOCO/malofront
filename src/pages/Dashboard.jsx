/**
 * FIXED User Dashboard - Complete loan platform dashboard
 * Replace the existing Dashboard.jsx with this version
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import {
  User,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Building2,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Plus,
  Eye,
  Settings,
  Bell,
  TrendingUp,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const { user, isApplicant, isAdmin } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banks, setBanks] = useState([]);
  const [userCredentials, setUserCredentials] = useState([]);
  const [loanApplications, setLoanApplications] = useState([]);

  useEffect(() => {
    if (isApplicant) {
      fetchData();
    }
  }, [isApplicant]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user's application status
      const statusData = await apiClient.getApplicationStatus();
      setApplicationStatus(statusData);
      
      // Fetch available banks
      const banksData = await apiClient.getBanks();
      setBanks(banksData.banks || []);
      
      // Fetch user's bank credentials
      const credentialsData = await apiClient.getUserCredentials();
      setUserCredentials(credentialsData.credentials || []);
      
      // Fetch user's loan applications
      const applicationsData = await apiClient.getUserApplications();
      setLoanApplications(applicationsData.applications || []);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Error al cargar la información del dashboard: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Aprobado',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          description: 'Tu solicitud ha sido aprobada'
        };
      case 'under_review':
        return {
          label: 'En Revisión',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          description: 'Tu solicitud está siendo revisada'
        };
      case 'pending_bank_info':
        return {
          label: 'Pendiente Información Bancaria',
          color: 'bg-blue-100 text-blue-800',
          icon: CreditCard,
          description: 'Necesitas agregar tu información bancaria'
        };
      case 'incomplete':
        return {
          label: 'Incompleto',
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle,
          description: 'Completa tu perfil para continuar'
        };
      default:
        return {
          label: 'Nuevo',
          color: 'bg-gray-100 text-gray-800',
          icon: User,
          description: 'Bienvenido a la plataforma'
        };
    }
  };

  const getApplicationProgress = () => {
    if (!applicationStatus) return 0;
    
    switch (applicationStatus.status) {
      case 'incomplete': return 25;
      case 'pending_bank_info': return 50;
      case 'under_review': return 75;
      case 'approved': return 100;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (isAdmin) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {user?.first_name}. Gestiona la plataforma de préstamos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Solicitantes</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 desde ayer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Requieren revisión</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobaciones</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets Activos</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Pendientes de resolver</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Gestiona la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/applicants">
                <Button className="w-full justify-start" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Gestionar Solicitantes
                </Button>
              </Link>
              <Link to="/admin/tickets">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Gestionar Tickets
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Reportes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nueva solicitud aprobada</p>
                    <p className="text-xs text-gray-500">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo usuario registrado</p>
                    <p className="text-xs text-gray-500">Hace 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Ticket creado</p>
                    <p className="text-xs text-gray-500">Hace 6 horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // User Dashboard
  const statusInfo = getStatusInfo(applicationStatus?.status);
  const StatusIcon = statusInfo.icon;
  const progress = getApplicationProgress();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Hola, {user?.first_name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido a tu plataforma de préstamos. Aquí puedes gestionar tu solicitud y información bancaria.
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

      {/* Application Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <StatusIcon className="h-5 w-5" />
            <span>Estado de tu Solicitud</span>
          </CardTitle>
          <CardDescription>
            Progreso de tu solicitud de préstamo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
            <span className="text-sm text-gray-500">{progress}% completado</span>
          </div>
          
          <Progress value={progress} className="w-full" />
          
          <p className="text-sm text-gray-600">
            {statusInfo.description}
          </p>

          {applicationStatus?.status === 'pending_bank_info' && (
            <Link to="/bank-credentials">
              <Button className="w-full mt-4">
                <CreditCard className="h-4 w-4 mr-2" />
                Agregar Información Bancaria
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Mi Perfil</span>
            </CardTitle>
            <CardDescription>
              Información personal y contacto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{user?.phone || 'No registrado'}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{user?.city || 'No registrado'}</span>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Settings className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Bancos Conectados</span>
            </CardTitle>
            <CardDescription>
              Información bancaria registrada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userCredentials.length === 0 ? (
              <div className="text-center py-4">
                <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-4">
                  No tienes bancos conectados
                </p>
                <Link to="/bank-credentials">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Conectar Banco
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {userCredentials.slice(0, 2).map((credential, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{credential.bank_name}</span>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Seguro
                    </Badge>
                  </div>
                ))}
                <Link to="/bank-credentials">
                  <Button variant="outline" className="w-full mt-2">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Todos
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Mis Solicitudes</span>
            </CardTitle>
            <CardDescription>
              Historial de préstamos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loanApplications.length === 0 ? (
              <div className="text-center py-4">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-4">
                  No tienes solicitudes activas
                </p>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Solicitud
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {loanApplications.slice(0, 2).map((application, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        ${application.amount?.toLocaleString('es-MX')}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {application.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(application.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Historial
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Banks */}
      <Card>
        <CardHeader>
          <CardTitle>Bancos Disponibles</CardTitle>
          <CardDescription>
            Conecta tus cuentas bancarias para acelerar tu solicitud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {banks.map((bank) => (
              <div key={bank.id} className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">{bank.name}</p>
              </div>
            ))}
          </div>
          <Link to="/bank-credentials">
            <Button className="w-full mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Conectar Banco
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Actividad Reciente</span>
          </CardTitle>
          <CardDescription>
            Últimas actualizaciones en tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Perfil actualizado</p>
                <p className="text-xs text-gray-500">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {new Date().toLocaleDateString('es-MX')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Cuenta creada exitosamente</p>
                <p className="text-xs text-gray-500">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {new Date(user?.created_at).toLocaleDateString('es-MX')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

