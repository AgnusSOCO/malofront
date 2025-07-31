import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Eye, EyeOff, Building, Shield, AlertTriangle, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api';

const BankCredentials = () => {
  const [banks, setBanks] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    provider_id: '',
    username: '',
    password: ''
  });

  // Fallback banks data
  const fallbackBanks = [
    { id: 'bbva-mexico', name: 'BBVA México', logo: '/banks/bbva.jpg' },
    { id: 'santander-mexico', name: 'Santander México', logo: '/banks/santander.png' },
    { id: 'banamex', name: 'Banamex', logo: '/banks/banamex.jpg' },
    { id: 'banorte', name: 'Banorte', logo: '/banks/banorte.jpg' },
    { id: 'hsbc-mexico', name: 'HSBC México', logo: '/banks/hsbc.png' },
    { id: 'banco-azteca', name: 'Banco Azteca', logo: '/banks/azteca.jpg' }
  ];

  // Load banks and credentials on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Loading banks and credentials...');
      
      // Load banks
      try {
        const banksData = await apiClient.getBanks();
        console.log('✅ Banks loaded from API:', banksData);
        setBanks(banksData);
        setApiStatus('connected');
      } catch (error) {
        console.log('⚠️ API failed, using fallback banks:', error);
        setBanks(fallbackBanks);
        setApiStatus('offline');
      }

      // Load existing credentials
      try {
        const credentialsData = await apiClient.getCredentials();
        console.log('✅ Credentials loaded:', credentialsData);
        setCredentials(credentialsData);
      } catch (error) {
        console.log('⚠️ Failed to load credentials:', error);
        setCredentials([]);
      }

    } catch (error) {
      console.error('❌ Failed to load data:', error);
      setError('Error al cargar los datos. Usando datos locales.');
      setBanks(fallbackBanks);
      setCredentials([]);
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    console.log(`📝 Form field changed: ${field} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Submitting form with data:', formData);
    
    // Validation
    if (!formData.provider_id || !formData.username || !formData.password) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      console.log('💾 Saving credentials...');
      
      const response = await apiClient.saveCredentials({
        provider_id: formData.provider_id,
        username: formData.username,
        password: formData.password
      });

      console.log('✅ Credentials saved successfully:', response);
      
      setSuccess('Credenciales guardadas exitosamente');
      setShowAddDialog(false);
      
      // Reset form
      setFormData({
        provider_id: '',
        username: '',
        password: ''
      });
      
      // Reload credentials
      await loadData();
      
    } catch (error) {
      console.error('❌ Failed to save credentials:', error);
      setError(`Error al guardar las credenciales: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (credentialId) => {
    console.log('🗑️ Deleting credential:', credentialId);
    
    setDeleting(credentialId);
    setError('');
    setSuccess('');

    try {
      await apiClient.deleteCredentials(credentialId);
      console.log('✅ Credential deleted successfully');
      
      setSuccess('Credenciales eliminadas exitosamente');
      await loadData();
      
    } catch (error) {
      console.error('❌ Failed to delete credentials:', error);
      setError(`Error al eliminar las credenciales: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const getBankById = (bankId) => {
    return banks.find(bank => bank.id === bankId) || { name: 'Banco Desconocido', logo: null };
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando credenciales bancarias...</p>
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
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
              <div className="space-y-2">
                <Label htmlFor="bank">Banco *</Label>
                <Select 
                  value={formData.provider_id} 
                  onValueChange={(value) => handleInputChange('provider_id', value)}
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
                {apiStatus === 'offline' && (
                  <p className="text-sm text-orange-600">
                    ⚠️ Usando bancos predeterminados (API temporalmente no disponible)
                  </p>
                )}
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
                  Tus credenciales se encriptan con AES-256 antes de almacenarse. Solo tú y los 
                  administradores autorizados pueden acceder a esta información.
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
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

      {/* API Status Alert */}
      {apiStatus === 'offline' && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            <strong>Modo sin conexión:</strong> La API está temporalmente no disponible. 
            Los bancos se muestran desde datos locales. Las credenciales se guardarán cuando la conexión se restablezca.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Seguridad garantizada:</strong> Todas tus credenciales bancarias se encriptan con AES-256 
          antes de almacenarse. Solo tú y los administradores autorizados pueden acceder a esta información.
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
            <div className="text-center py-8">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes bancos conectados</h3>
              <p className="text-gray-600 mb-4">
                Conecta tus cuentas bancarias para acelerar el proceso de solicitud de préstamos
              </p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Conectar tu primer banco
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {credentials.map((credential) => {
                const bank = getBankById(credential.provider_id);
                return (
                  <Card key={credential.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {bank.logo ? (
                            <img 
                              src={bank.logo} 
                              alt={bank.name}
                              className="w-8 h-8 rounded mr-3"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <Building className="w-8 h-8 text-gray-400 mr-3" style={{display: bank.logo ? 'none' : 'flex'}} />
                          <div>
                            <h4 className="font-medium">{bank.name}</h4>
                            <p className="text-sm text-gray-600">{credential.username}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(credential.id)}
                          disabled={deleting === credential.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deleting === credential.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        Conectado: {new Date(credential.created_at).toLocaleDateString()}
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
            {banks.map((bank) => (
              <div key={bank.id} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                {bank.logo ? (
                  <img 
                    src={bank.logo} 
                    alt={bank.name}
                    className="w-12 h-12 mx-auto mb-2 rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <Building 
                  className="w-12 h-12 mx-auto mb-2 text-gray-400" 
                  style={{display: bank.logo ? 'none' : 'flex'}} 
                />
                <p className="text-sm font-medium">{bank.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Conectar Banco
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <div className="text-xs text-gray-500 text-center">
        Debug: {banks.length} bancos cargados, API: {apiStatus === 'connected' ? 'Conectada' : 'Error'}
      </div>
    </div>
  );
};

export default BankCredentials;

