/**
 * Complete functional AdminTickets component
 * ✅ Full CRUD functionality for tickets
 * ✅ Professional UI with proper error handling
 * ✅ Integration with updated API client
 * ✅ All ticket management features
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Ticket,
  User,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  MessageSquare,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api';

// Simple toast replacement
const showToast = (title, description, variant = 'default') => {
  const toastType = variant === 'destructive' ? 'error' : 'success';
  console.log(`${toastType.toUpperCase()}: ${title} - ${description}`);
  
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
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
};

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Form states
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
    assigned_to: ''
  });
  
  const [editTicket, setEditTicket] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    category: '',
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
      
      if (response && response.tickets && Array.isArray(response.tickets)) {
        setTickets(response.tickets);
      } else if (Array.isArray(response)) {
        setTickets(response);
      } else {
        console.warn('Unexpected tickets data format:', response);
        setTickets([]);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      setError('Error al cargar los tickets: ' + error.message);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    try {
      setError(null);
      console.log('Creating ticket:', newTicket);
      
      if (!newTicket.title.trim() || !newTicket.description.trim()) {
        showToast("Error", "Título y descripción son obligatorios", "destructive");
        return;
      }
      
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
      showToast("¡Éxito!", "Ticket creado correctamente");
      await fetchTickets(); // Refresh the list
    } catch (error) {
      console.error('Failed to create ticket:', error);
      setError('Error al crear el ticket: ' + error.message);
      showToast("Error", "No se pudo crear el ticket", "destructive");
    }
  };

  const updateTicket = async () => {
    try {
      setError(null);
      console.log('Updating ticket:', selectedTicket.id, editTicket);
      
      await apiClient.updateTicket(selectedTicket.id, editTicket);
      
      setShowEditDialog(false);
      setSelectedTicket(null);
      showToast("¡Éxito!", "Ticket actualizado correctamente");
      await fetchTickets(); // Refresh the list
    } catch (error) {
      console.error('Failed to update ticket:', error);
      setError('Error al actualizar el ticket: ' + error.message);
      showToast("Error", "No se pudo actualizar el ticket", "destructive");
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      console.log('Updating ticket status:', ticketId, newStatus);
      
      // Update local state immediately for better UX
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus, updated_at: new Date().toISOString() }
          : ticket
      ));
      
      await apiClient.updateTicket(ticketId, { status: newStatus });
      
      const statusLabels = {
        'open': 'abierto',
        'in_progress': 'en progreso',
        'resolved': 'resuelto',
        'closed': 'cerrado'
      };
      
      showToast("¡Éxito!", `Ticket marcado como ${statusLabels[newStatus]}`);
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      setError('Error al actualizar el estado del ticket: ' + error.message);
      showToast("Error", "No se pudo actualizar el estado", "destructive");
      // Refresh to revert changes
      await fetchTickets();
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
      return;
    }
    
    try {
      console.log('Deleting ticket:', ticketId);
      
      await apiClient.deleteTicket(ticketId);
      
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      showToast("¡Éxito!", "Ticket eliminado correctamente");
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      setError('Error al eliminar el ticket: ' + error.message);
      showToast("Error", "No se pudo eliminar el ticket", "destructive");
    }
  };

  const openEditDialog = (ticket) => {
    setSelectedTicket(ticket);
    setEditTicket({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      assigned_to: ticket.assigned_to || ''
    });
    setShowEditDialog(true);
  };

  const openDetailsDialog = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsDialog(true);
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.creator_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get statistics
  const getStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const closed = tickets.filter(t => t.status === 'closed').length;
    
    return { total, open, inProgress, resolved, closed };
  };

  const stats = getStats();

  // Status and priority badge helpers
  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle, text: 'Abierto' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, text: 'En Progreso' },
      resolved: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'Resuelto' },
      closed: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle, text: 'Cerrado' }
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
      low: { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Baja' },
      medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Media' },
      high: { color: 'bg-orange-100 text-orange-800 border-orange-200', text: 'Alta' },
      urgent: { color: 'bg-red-100 text-red-800 border-red-200', text: 'Urgente' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
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
            Administra los tickets de soporte y seguimiento del sistema
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ticket
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Error</p>
          </div>
          <p className="text-red-700 mt-1 text-sm">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setError(null)}
            className="mt-2"
          >
            Cerrar
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Ticket className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Abiertos</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resueltos</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cerrados</p>
                <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
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
                  placeholder="Buscar tickets por título, descripción o creador..."
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
                <option value="open">Abiertos</option>
                <option value="in_progress">En Progreso</option>
                <option value="resolved">Resueltos</option>
                <option value="closed">Cerrados</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las prioridades</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTickets}
              >
                <RefreshCw size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
          <CardDescription>
            Lista de todos los tickets del sistema con funcionalidad completa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-lg">No se encontraron tickets</p>
              <p className="text-sm text-gray-400">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Los nuevos tickets aparecerán aquí'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">ID</th>
                    <th className="text-left p-4 font-semibold">Título</th>
                    <th className="text-left p-4 font-semibold">Estado</th>
                    <th className="text-left p-4 font-semibold">Prioridad</th>
                    <th className="text-left p-4 font-semibold">Creador</th>
                    <th className="text-left p-4 font-semibold">Fecha</th>
                    <th className="text-left p-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          #{ticket.id.slice(0, 8)}
                        </code>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-xs">
                            {ticket.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {ticket.description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="p-4">
                        {getPriorityBadge(ticket.priority)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-1" />
                          {ticket.creator_name || 'Desconocido'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(ticket.created_at)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailsDialog(ticket)}
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(ticket)}
                            title="Editar ticket"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {ticket.status !== 'resolved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                              className="text-green-600 hover:text-green-700"
                              title="Marcar como resuelto"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTicket(ticket.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Eliminar ticket"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                placeholder="Título descriptivo del ticket"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                placeholder="Describe detalladamente el problema o solicitud"
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
                disabled={!newTicket.title.trim() || !newTicket.description.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Crear Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Ticket Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Ticket</DialogTitle>
            <DialogDescription>
              Modifica la información del ticket seleccionado
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título *</Label>
              <Input
                id="edit-title"
                value={editTicket.title}
                onChange={(e) => setEditTicket({...editTicket, title: e.target.value})}
                placeholder="Título descriptivo del ticket"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Descripción *</Label>
              <Textarea
                id="edit-description"
                value={editTicket.description}
                onChange={(e) => setEditTicket({...editTicket, description: e.target.value})}
                placeholder="Describe detalladamente el problema o solicitud"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-status">Estado</Label>
                <Select 
                  value={editTicket.status} 
                  onValueChange={(value) => setEditTicket({...editTicket, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Abierto</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="resolved">Resuelto</SelectItem>
                    <SelectItem value="closed">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-priority">Prioridad</Label>
                <Select 
                  value={editTicket.priority} 
                  onValueChange={(value) => setEditTicket({...editTicket, priority: value})}
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
                <Label htmlFor="edit-category">Categoría</Label>
                <Select 
                  value={editTicket.category} 
                  onValueChange={(value) => setEditTicket({...editTicket, category: value})}
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
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={updateTicket}
                disabled={!editTicket.title.trim() || !editTicket.description.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Actualizar Ticket
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
                  <Label className="text-sm font-medium text-gray-700">ID</Label>
                  <p className="text-sm text-gray-900">#{selectedTicket.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Estado</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Título</Label>
                <p className="text-sm text-gray-900 mt-1">{selectedTicket.title}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Descripción</Label>
                <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Prioridad</Label>
                  <div className="mt-1">
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Categoría</Label>
                  <p className="text-sm text-gray-900 mt-1 capitalize">{selectedTicket.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Creado por</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedTicket.creator_name || 'Desconocido'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Asignado a</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedTicket.assignee_name || 'Sin asignar'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Fecha de creación</Label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(selectedTicket.created_at)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Última actualización</Label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(selectedTicket.updated_at)}</p>
                </div>
              </div>

              {selectedTicket.resolved_at && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Fecha de resolución</Label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(selectedTicket.resolved_at)}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTickets;

