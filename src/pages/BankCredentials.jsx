/**
 * COMPLETE Bank Credentials Management Page - WITH PUBLIC FOLDER LOGOS
 * Replace the existing BankCredentials.jsx with this version
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CreditCard,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  Building2,
  Lock,
  User,
  Key,
} from 'lucide-react';

const BankCredentials = () => {
  const { user } = useAuth();
  const [banks, setBanks] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Form data for adding new credentials
  const [formData, setFormData] = useState({
    provider_id: '',
    username: '',
    password: ''
  });

  // Mexican banks data with logos from public folder
  const mexicanBanks = [
    {
      id: 1,
      name: 'BBVA México',
      code: 'bbva',
      logo: '/banks/bbva.jpg',
      color: '#004481',
      description: 'Banco Bilbao Vizcaya Argentaria'
    },
    {
      id: 2,
      name: 'Santander México',
      code: 'santander',
      logo: '/banks/santander.png',
      color: '#EC0000',
      description: 'Banco Santander México'
    },
    {
      id: 3,
      name: 'Banamex',
      code: 'banamex',
      logo: '/banks/banamex.jpg',
      color: '#C8102E',
      description: 'Banco Nacional de México'
    },
    {
      id: 4,
      name: 'Banorte',
      code: 'banorte',
      logo: '/banks/banorte.jpg',
      color: '#E30613',
      description: 'Banco del Norte'
    },
    {
      id: 5,
      name: 'HSBC México',
      code: 'hsbc',
      logo: '/banks/hsbc.png',
      color: '#DB0011',
      description: 'HSBC Bank México'
    },
    {
      id: 6,
      name: 'Banco Azteca',
      code: 'azteca',
      logo: '/banks/azteca.jpg',
      color: '#00A651',
      description: 'Banco Azteca de México'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch available banks from API
      const banksResponse = await apiClient.getBanks();
      setBanks(banksResponse.banks || mexicanBanks);
      
      // Fetch user's credentials
      const credentialsResponse = await apiClient.getUserCredentials();
      setCredentials(credentialsResponse.credentials || []);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Use fallback data if API fails
      setBanks(mexicanBanks);
      setCredentials([]);
      setError('Error al cargar la información bancaria: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.provider_id || !formData.username || !formData.password) {
      setError('Todos los campos son requeridos');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.saveCredentials(formData.provider_id, {
        username: formData.username,
        password: formData.password
      });
      
      // Reset form and refresh data
      setFormData({
        provider_id: '',
        username: '',
        password: ''
      });
      
      setShowAddForm(false);
      await fetchData(); // Refresh the list
      setError(null);
    } catch (error) {
      console.error('Failed to add bank credentials:', error);
      setError('Error al agregar las credenciales bancarias: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (credentialId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar estas credenciales bancarias?')) {
      return;
    }

    try {
      await apiClient.deleteCredentials(credentialId);
      await fetchData(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete credentials:', error);
      setError('Error al eliminar las credenciales: ' + error.message);
    }
  };

  const togglePasswordVisibility = (credentialId) => {
    setShowPassword(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
  };

  const getBankById = (bankId) => {
    return banks.find(bank => bank.id === bankId) || mexicanBanks.find(bank => bank.id === bankId);
  };

  const getAvailableBanks = () => {
    const connectedBankIds = credentials.map(cred => cred.bank_id);
    return banks.filter(bank => !connectedBankIds.includes(bank.id));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información bancaria...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Credenciales Bancarias</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus credenciales bancarias de forma segura. Toda la información se encripta automáticamente.
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={getAvailableBanks().length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Banco
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

      {/* Security Notice */}
      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Seguridad garantizada:</strong> Todas tus credenciales bancarias se encriptan con AES-256 
          antes de almacenarse. Solo tú y los administradores autorizados pueden acceder a esta información.
        </AlertDescription>
      </Alert>

      {/* Connected Banks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Bancos Conectados ({credentials.length})
        </h2>

        {credentials.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes bancos conectados
              </h3>
              <p className="text-gray-500 mb-6">
                Conecta tus cuentas bancarias para acelerar el proceso de solicitud de préstamos
              </p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Conectar tu primer banco
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {credentials.map((credential) => {
              const bank = getBankById(credential.bank_id);
              return (
                <Card key={credential.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {bank?.logo ? (
                          <img 
                            src={bank.logo} 
                            alt={bank.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <Building2 className="h-6 w-6 text-gray-600" style={{display: bank?.logo ? 'none' : 'flex'}} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{bank?.name || 'Banco Desconocido'}</CardTitle>
                        <CardDescription>{bank?.description || 'Institución bancaria'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Usuario</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{credential.username}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Contraseña</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Key className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 flex-1">
                          {showPassword[credential.id] ? credential.password : '••••••••'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(credential.id)}
                        >
                          {showPassword[credential.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Encriptado
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(credential.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Banks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Bancos Disponibles ({getAvailableBanks().length})
        </h2>
        
        {getAvailableBanks().length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¡Todos los bancos conectados!
              </h3>
              <p className="text-gray-500">
                Has conectado todos los bancos disponibles en la plataforma
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {getAvailableBanks().map((bank) => (
              <Card 
                key={bank.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setFormData(prev => ({ ...prev, provider_id: bank.id }));
                  setShowAddForm(true);
                }}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    {bank.logo ? (
                      <img 
                        src={bank.logo} 
                        alt={bank.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <Building2 className="h-8 w-8 text-gray-600" style={{display: bank.logo ? 'none' : 'flex'}} />
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 mb-1">{bank.name}</h3>
                  <p className="text-xs text-gray-500">{bank.code?.toUpperCase()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Credentials Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Credenciales Bancarias</DialogTitle>
            <DialogDescription>
              Conecta tu cuenta bancaria de forma segura. Toda la información se encripta automáticamente.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="provider_id">Banco *</Label>
              <select
                id="provider_id"
                name="provider_id"
                value={formData.provider_id}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona tu banco</option>
                {getAvailableBanks().map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="username">Usuario/Email *</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Tu usuario o email del banco"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Tu contraseña del banco"
                required
              />
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Lock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Tus credenciales se encriptan con AES-256 antes de almacenarse. 
                Solo tú y administradores autorizados pueden acceder a esta información.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Guardar Credenciales
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankCredentials;

