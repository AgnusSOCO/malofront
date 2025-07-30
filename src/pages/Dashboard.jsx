/**
 * Dashboard page component
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, isApplicant, isAdmin } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isApplicant) {
        try {
          const statusData = await apiClient.getApplicationStatus();
          setApplicationStatus(statusData);
        } catch (error) {
          console.error('Failed to fetch application status:', error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [isApplicant]);

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
          label: 'Desconocido',
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          description: 'Estado desconocido'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.profile?.first_name || user?.email}
        </h1>
        <p className="text-gray-600 mt-2">
          {isAdmin ? 'Panel de administración' : 'Gestiona tu solicitud de préstamo'}
        </p>
      </div>

      {/* Applicant Dashboard */}
      {isApplicant && applicationStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Application Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estado de Solicitud
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(() => {
                  const statusInfo = getStatusInfo(applicationStatus.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-5 w-5" />
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {statusInfo.description}
                      </p>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Profile Completion */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Perfil Completo
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {applicationStatus.profile_complete ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">
                    {applicationStatus.profile_complete ? 'Completo' : 'Incompleto'}
                  </span>
                </div>
                {!applicationStatus.profile_complete && (
                  <Button asChild size="sm" variant="outline">
                    <Link to="/profile">Completar Perfil</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bank Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Información Bancaria
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {applicationStatus.has_bank_credentials ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">
                    {applicationStatus.has_bank_credentials ? 'Agregada' : 'Pendiente'}
                  </span>
                </div>
                {!applicationStatus.has_bank_credentials && (
                  <Button asChild size="sm" variant="outline">
                    <Link to="/bank-credentials">Agregar Banco</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Dashboard */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Solicitantes
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Total de solicitantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Solicitudes pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aprobados
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Solicitudes aprobadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tickets Abiertos
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Tickets sin resolver
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            {isAdmin ? 'Gestiona la plataforma' : 'Gestiona tu solicitud'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {isApplicant && (
              <>
                <Button asChild>
                  <Link to="/profile">Ver Perfil</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/bank-credentials">Datos Bancarios</Link>
                </Button>
              </>
            )}
            {isAdmin && (
              <>
                <Button asChild>
                  <Link to="/admin/applicants">Ver Solicitantes</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/tickets">Gestionar Tickets</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/audit">Logs de Auditoría</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

