/**
 * Admin tickets management page
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
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
  Ticket, 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Calendar
} from 'lucide-react';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
  });
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTickets();
      setTickets(response.tickets || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      setError('Error al cargar los tickets');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    try {
      await apiClient.createTicket(newTicket);
      setNewTicket({
        title: '',
        description: '',
        priority: 'medium',
        category: 'general',
      });
      setShowCreateDialog(false);
      await fetchTickets();
    } catch (error) {
      console.error('Failed to create ticket:', error);
      setError('Error al crear el ticket');
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      await apiClient.updateTicket(ticketId, { status });
      await fetchTickets();
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      setError('Error al actualizar el estado del ticket');
    }
  };

  const addComment = async (ticketId) => {
    if (!newComment.trim()) return;
    
    try {
      await apiClient.addTicketComment(ticketId, newComment);
      setNewComment('');
      // Refresh ticket details if dialog is open
      if (selectedTicket && selectedTicket.id === ticketId) {
        // In a real app, you'd fetch updated ticket details here
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      setError('Error al agregar el comentario');
    }
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'high':
        return {
          label: 'Alta',
          className: 'bg-red-100 text-red-800',
        };
      case 'medium':
        return {
          label: 'Media',
          className: 'bg-yellow-100 text-yellow-800',
        };
      case 'low':
        return {
          label: 'Baja',
          className: 'bg-green-100 text-green-800',
        };
      default:
        return {
          label: 'Media',
          className: 'bg-yellow-100 text-yellow-800',
        };
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'open':
        return {
          label: 'Abierto',
          className: 'bg-blue-100 text-blue-800',
          icon: AlertCircle
        };
      case 'in_progress':
        return {
          label: 'En Progreso',
          className: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        };
      case 'resolved':
        return {
          label: 'Resuelto',
          className: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'closed':
        return {
          label: 'Cerrado',
          className: 'bg-gray-100 text-gray-800',
          icon: CheckCircle
        };
      default:
        return {
          label: 'Abierto',
          className: 'bg-blue-100 text-blue-800',
          icon: AlertCircle
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Tickets</h1>
          <p className="text-gray-600 mt-2">
            Administra los tickets de soporte y seguimiento
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Ticket</DialogTitle>
              <DialogDescription>
                Crea un nuevo ticket para seguimiento interno
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título del ticket"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción detallada del ticket"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technical">Técnico</SelectItem>
                      <SelectItem value="applicant_issue">Problema de Solicitante</SelectItem>
                      <SelectItem value="bank_integration">Integración Bancaria</SelectItem>
                      <SelectItem value="security">Seguridad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={createTicket}>
                  Crear Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
              <Ticket className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{tickets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Abiertos</p>
                <p className="text-2xl font-bold">
                  {tickets.filter(t => t.status === 'open').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold">
                  {tickets.filter(t => t.status === 'in_progress').length}
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
                <p className="text-sm font-medium text-gray-600">Resueltos</p>
                <p className="text-2xl font-bold">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({tickets.length})</CardTitle>
          <CardDescription>
            Lista de todos los tickets del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                {tickets.map((ticket) => {
                  const priorityInfo = getPriorityInfo(ticket.priority);
                  const statusInfo = getStatusInfo(ticket.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm">
                        #{ticket.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ticket.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {ticket.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityInfo.className}>
                          {priorityInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusInfo.className}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {ticket.category?.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        {new Date(ticket.created_at).toLocaleDateString('es-MX')}
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
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Select
                            value={ticket.status}
                            onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                          >
                            <SelectTrigger className="w-32">
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket #{selectedTicket?.id}</DialogTitle>
            <DialogDescription>
              {selectedTicket?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              {/* Ticket Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Estado</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        {(() => {
                          const statusInfo = getStatusInfo(selectedTicket.status);
                          const StatusIcon = statusInfo.icon;
                          return (
                            <>
                              <StatusIcon className="w-4 h-4" />
                              <Badge className={statusInfo.className}>
                                {statusInfo.label}
                              </Badge>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Prioridad</Label>
                      <div className="mt-1">
                        <Badge className={getPriorityInfo(selectedTicket.priority).className}>
                          {getPriorityInfo(selectedTicket.priority).label}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Categoría</Label>
                      <p className="text-sm capitalize mt-1">
                        {selectedTicket.category?.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Creado</Label>
                      <p className="text-sm mt-1">
                        {new Date(selectedTicket.created_at).toLocaleString('es-MX')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comentarios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing comments would be displayed here */}
                  <div className="text-sm text-gray-500">
                    No hay comentarios aún.
                  </div>
                  
                  {/* Add Comment */}
                  <div className="border-t pt-4">
                    <Label htmlFor="comment">Agregar Comentario</Label>
                    <Textarea
                      id="comment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe un comentario..."
                      rows={3}
                      className="mt-2"
                    />
                    <Button
                      onClick={() => addComment(selectedTicket.id)}
                      className="mt-2"
                      disabled={!newComment.trim()}
                    >
                      Agregar Comentario
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTickets;

