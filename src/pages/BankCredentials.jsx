import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Eye, EyeOff, Shield, Building, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api';

const BankCredentials = () => {
  const [banks, setBanks] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    bankId: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load banks and credentials in parallel
      const [banksResponse, credentialsResponse] = await Promise.all([
        apiClient.getBanks(),
        apiClient.getUserCredentials()
      ]);
      
      console.log('Banks loaded:', banksResponse);
      console.log('Credentials loaded:', credentialsResponse);
      
      setBanks(banksResponse.banks || []);
      setCredentials(credentialsResponse.credentials || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar la información bancaria');
      
      // Fallback data if API fails
      setBanks([
        { id: '1', name: 'BBVA México', code: 'bbva' },
        { id: '2', name: 'Santander México', code: 'santander' },
        { id: '3', name: 'Banamex', code: 'banamex' },
        { id: '4', name: 'Banorte', code: 'banorte' },
        { id: '5', name: 'HSBC México', code: 'hsbc' },
        { id: '6', name: 'Banco Azteca', code: 'azteca' }
      ]);
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear any previous errors
    setError('');
  };

  const validateForm = () => {
    if (!formData.bankId) {
      setError('Por favor selecciona un banco');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Por favor ingresa tu usuario o email');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Por favor ingresa tu contraseña');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('Submitting credentials:', {
        bankId: formData.bankId,
        username: formData.username,
        hasPassword: !!formData.password
      });

      const response = await apiClient.saveCredentials(formData.bankId, {
        username: formData.username,
        password: formData.password
      });

      console.log('Save credentials response:', response);

      setSuccess('Credenciales bancarias guardadas exitosamente');
      
      // Reset form
      setFormData({
        bankId: '',
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
      setLoading(false);
    }
  };

  const handleDelete = async (credentialId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar estas credenciales?')) {
      return;
    }

    try {
      setLoading(true);
      await apiClient.deleteCredentials(credentialId);
      setSuccess('Credenciales eliminadas exitosamente');
      await loadData();
    } catch (error) {
      console.error('Error deleting credentials:', error);
      setError(`Error al eliminar las credenciales: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getBankLogo = (bankCode) => {
    const logoMap = {
      'bbva': '/banks/bbva.jpg',
      'santander': '/banks/santander.png',
      'banamex': '/banks/banamex.jpg',
      'banorte': '/banks/banorte.jpg',
      'hsbc': '/banks/hsbc.png',
      'azteca': '/banks/azteca.jpg'
    };
    return logoMap[bankCode] || '/banks/default.png';
  };

  const getSelectedBank = () => {
    return banks.find(bank => bank.id === formData.bankId);
  };

  if (loading && banks.length === 0) {
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
              <Plus className="h-4 w-4 mr-2" />
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
              <div className="space-y-2">
                <Label htmlFor="bank">Banco *</Label>
                <Select 
                  value={formData.bankId} 
                  onValueChange={(value) => handleInputChange('bankId', value)}
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

              <div className="space-y-2">
                <Label htmlFor="username">Usuario/Email *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Tu usuario o email del banco"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña del banco"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Tus credenciales se encriptan con AES-256 antes de almacenarse. Solo tú y administradores autorizados pueden acceder a esta información.
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Guardando...' : 'Guardar Credenciales'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Seguridad garantizada:</strong> Todas tus credenciales bancarias se encriptan con AES-256 antes de almacenarse. Solo tú y los administradores autorizados pueden acceder a esta información.
        </AlertDescription>
      </Alert>

      {/* Connected Banks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Bancos Conectados ({credentials.length})
          </CardTitle>
          <CardDescription>
            Tus cuentas bancarias registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes bancos conectados</h3>
              <p className="text-gray-600 mb-6">
                Conecta tus cuentas bancarias para acelerar el proceso de solicitud de préstamos
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Conectar tu primer banco
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {credentials.map((credential) => {
                const bank = banks.find(b => b.id === credential.provider_id);
                return (
                  <Card key={credential.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getBankLogo(bank?.code)}
                            alt={bank?.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = '/banks/default.png';
                            }}
                          />
                          <div>
                            <h4 className="font-semibold">{bank?.name}</h4>
                            <p className="text-sm text-gray-600">{credential.username}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(credential.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        Conectado el {new Date(credential.created_at).toLocaleDateString('es-MX')}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
            {banks.map((bank) => {
              const isConnected = credentials.some(c => c.provider_id === bank.id);
              return (
                <div
                  key={bank.id}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    isConnected 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isConnected) {
                      setFormData(prev => ({ ...prev, bankId: bank.id }));
                      setIsDialogOpen(true);
                    }
                  }}
                >
                  <img
                    src={getBankLogo(bank.code)}
                    alt={bank.name}
                    className="w-12 h-12 mx-auto mb-2 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = '/banks/default.png';
                    }}
                  />
                  <p className="text-sm font-medium">{bank.name}</p>
                  {isConnected && (
                    <p className="text-xs text-green-600 mt-1">✓ Conectado</p>
                  )}
                </div>
              );
            })}
          </div>
          
          {banks.length === 0 && (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay bancos disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Global Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BankCredentials;

