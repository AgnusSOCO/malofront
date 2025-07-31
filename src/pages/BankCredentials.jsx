import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Eye, EyeOff, Plus, Building, Shield } from 'lucide-react';
import { apiClient } from '@/lib/api';

const BankCredentials = () => {
  const [banks, setBanks] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    provider_id: '',
    username: '',
    password: ''
  });

  // Load banks and credentials on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading banks and credentials...');
      
      // Load banks
      const banksResponse = await apiClient.get('/applicants/banks');
      console.log('Banks response:', banksResponse);
      setBanks(banksResponse.banks || []);
      
      // Load user credentials
      const credentialsResponse = await apiClient.get('/applicants/credentials');
      console.log('Credentials response:', credentialsResponse);
      setCredentials(credentialsResponse.credentials || []);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar la información bancaria');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess('');
    
    // Validate form
    if (!formData.provider_id || !formData.username || !formData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setSaving(true);
      console.log('Saving credentials with data:', formData);
      
      const response = await apiClient.post('/applicants/credentials', formData);
      console.log('Save response:', response);
      
      setSuccess('Credenciales guardadas exitosamente');
      
      // Reset form
      setFormData({
        provider_id: '',
        username: '',
        password: ''
      });
      
      // Close dialog
      setIsDialogOpen(false);
      
      // Reload credentials
      await loadData();
      
    } catch (error) {
      console.error('Error saving credentials:', error);
      setError(`Error al guardar las credenciales: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (credentialId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar estas credenciales?')) {
      return;
    }

    try {
      await apiClient.delete(`/applicants/credentials/${credentialId}`);
      setSuccess('Credenciales eliminadas exitosamente');
      await loadData();
    } catch (error) {
      console.error('Error deleting credentials:', error);
      setError('Error al eliminar las credenciales');
    }
  };

  const getBankName = (providerId) => {
    const bank = banks.find(b => b.id === providerId);
    return bank ? bank.name : 'Banco desconocido';
  };

  const getBankLogo = (providerId) => {
    const bank = banks.find(b => b.id === providerId);
    if (bank && bank.logo_url) {
      return bank.logo_url;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Cargando información bancaria...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credenciales Bancarias</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus credenciales bancarias de forma segura. Toda la información se encripta automáticamente.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Banco
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Credenciales Bancarias</DialogTitle>
              <DialogDescription>
                Conecta tu cuenta bancaria de forma segura. Toda la información se encripta automáticamente.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bank Selection */}
              <div className="space-y-2">
                <Label htmlFor="bank">Banco *</Label>
                <Select 
                  value={formData.provider_id} 
                  onValueChange={(value) => {
                    console.log('Selected bank ID:', value);
                    setFormData(prev => ({ ...prev, provider_id: value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Usuario/Email *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Tu usuario o email del banco"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña del banco"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Tus credenciales se encriptan con AES-256 antes de almacenarse. Solo tú y los administradores autorizados pueden acceder a esta información.
                </AlertDescription>
              </Alert>

              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? 'Guardando...' : 'Guardar Credenciales'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Seguridad garantizada:</strong> Todas tus credenciales bancarias se encriptan con AES-256 antes de almacenarse. Solo tú y los administradores autorizados pueden acceder a esta información.
        </AlertDescription>
      </Alert>

      {/* Connected Banks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Bancos Conectados ({credentials.length})
          </CardTitle>
          <CardDescription>
            Tus cuentas bancarias registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes bancos conectados</h3>
              <p className="text-gray-500 mb-6">
                Conecta tus cuentas bancarias para acelerar el proceso de solicitud de préstamos
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Conectar tu primer banco
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {credentials.map((credential) => (
                <Card key={credential.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getBankLogo(credential.provider_id) ? (
                          <img 
                            src={getBankLogo(credential.provider_id)} 
                            alt={getBankName(credential.provider_id)}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <Building className="w-8 h-8 text-gray-400" style={{display: getBankLogo(credential.provider_id) ? 'none' : 'flex'}} />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {getBankName(credential.provider_id)}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {credential.username}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(credential.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Conectado el {new Date(credential.created_at).toLocaleDateString('es-ES')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Banks */}
      <Card>
        <CardHeader>
          <CardTitle>Bancos Disponibles ({banks.length})</CardTitle>
          <CardDescription>
            Conecta tus cuentas bancarias para acelerar tu solicitud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {banks.map((bank) => (
              <div
                key={bank.id}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                {bank.logo_url ? (
                  <img 
                    src={bank.logo_url} 
                    alt={bank.name}
                    className="w-12 h-12 object-contain mb-2"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <Building className="w-12 h-12 text-gray-400 mb-2" style={{display: bank.logo_url ? 'none' : 'flex'}} />
                <span className="text-sm font-medium text-center">{bank.name}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Conectar Banco
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Global Success/Error Messages */}
      {success && !isDialogOpen && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && !isDialogOpen && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BankCredentials;

