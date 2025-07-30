/**
 * FIXED Admin tickets management page
 * Replace the existing AdminTickets.jsx with this version
 */
import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Button } from from '@/components/ui/button';
import { Input } from from '@/components/ui/input';
import { Textarea } from from '@/components/ui/textarea';
import { Badge } from from '@/components/ui/badge';
import { Alert, AlertDescription } from from '@/components/ui/alert';
import { Label } from from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from from '@/components/ui/select';
import {
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Ticket,
  User,
  Calendar,
} from 'lucide-react';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
    assigned_to: ''
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching tickets...');
      
      const response = await apiClient.getTickets();
      console.log('Tickets response:', response);
      
      setTickets(response.tickets || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      setError('Error al cargar los tickets: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    try {
      setError(null);
      console.log('Creating ticket:', newTicket);
      
      await apiClient.createTicket(newTicket);
      
      // Reset form
      setNewTicket({
        title: '',
        description: '',
        priority: 'medium',
        category: 'general',
        assigned_to: ''
      });
      
      setShowCreateDialog(false);
      await fetchTickets(); // Refresh the list
    } catch (error) {
      console.error('Failed to create ticket:', error);
      setError('Error al crear el ticket: ' + error.message);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await apiClient.updateTicket(ticketId, { status: newStatus });
      await fetchTickets(); // Refresh the list
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      setError('Error al actualizar el estado del ticket: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Abierto' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'En Progreso' },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Resuelto' },
      closed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, text: 'Cerrado' }
    };
    
    const config = statusConfig[status] || statusConfig.open;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { color: 'bg-blue-100 text-blue-800', text: 'Baja' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Media' },
      high: { color: 'bg-orange-100 text-orange-800', text: 'Alta' },
      urgent: { color: 'bg-red-100 text-red-800', text: 'Urgente' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    
    return { total, open, inProgress, resolved };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Tickets</h1>
          <p className="text-gray-600 mt-2">
            Administra los tickets de soporte y seguimiento
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ticket
        </Button>
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
            <Ticket className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total de tickets del sistema</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Abiertos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
              <p className="text-xs text-gray-500">Tickets sin resolver</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Progreso</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              <p className="text-xs text-gray-500">Tickets en proceso</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resueltos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              <p className="text-xs text-gray-500">Tickets completados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Tickets ({tickets.length})
          </h2>
          <p className="text-sm text-gray-600">
            Lista de todos los tickets del sistema
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-gray-500">
                      <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No hay tickets</p>
                      <p className="text-sm">No se encontraron tickets en el sistema</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        #{ticket.id}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-xs">
                          {ticket.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {ticket.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(ticket.priority)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(ticket.status)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {ticket.category || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(ticket.created_at).toLocaleDateString('es-MX')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {ticket.status !== 'resolved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Ticket</DialogTitle>
            <DialogDescription>
              Crea un nuevo ticket de soporte o seguimiento
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={newTicket.title}
                onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                placeholder="Título del ticket"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                placeholder="Describe el problema o solicitud"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Select 
                  value={newTicket.priority} 
                  onValueChange={(value) => setNewTicket({...newTicket, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select 
                  value={newTicket.category} 
                  onValueChange={(value) => setNewTicket({...newTicket, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Técnico</SelectItem>
                    <SelectItem value="billing">Facturación</SelectItem>
                    <SelectItem value="support">Soporte</SelectItem>
                    <SelectItem value="feature">Nueva Función</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={createTicket}
                disabled={!newTicket.title || !newTicket.description}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Crear Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Ticket</DialogTitle>
            <DialogDescription>
              Información completa del ticket seleccionado
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">ID</label>
                  <p className="text-sm text-gray-900">#{selectedTicket.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Título</label>
                <p className="text-sm text-gray-900">{selectedTicket.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Prioridad</label>
                  <div className="mt-1">
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoría</label>
                  <p className="text-sm text-gray-900">{selectedTicket.category || 'General'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Fecha de Creación</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedTicket.created_at).toLocaleString('es-MX')}
                </p>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'in_progress')}
                  variant="outline"
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  En Progreso
                </Button>
                <Button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolver
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTickets;

