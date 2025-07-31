import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Building2, Shield, CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { apiClient } from '@/lib/api';

// Simple toast replacement
const showToast = (title, description, variant = 'default') => {
  const toastType = variant === 'destructive' ? 'error' : 'success';
  console.log(`${toastType.toUpperCase()}: ${title} - ${description}`);
  
  // Create a simple notification
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
    variant === 'destructive' 
      ? 'bg-red-500 text-white' 
      : 'bg-green-500 text-white'
  }`;
  notification.innerHTML = `
    <div class="font-semibold">${title}</div>
    <div class="text-sm opacity-90">${description}</div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
};

// Bank-specific modal components embedded directly to avoid import issues
const BankSpecificModal = ({ bankId, bankName, isOpen, onClose, onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({ username: '', password: '' });
    setShowPassword(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Get bank-specific styling and content based on bank code
  const getBankConfig = (bankCode) => {
    const code = bankCode?.toUpperCase();
    switch (code) {
      case 'BBVA':
        return {
          color: '#004481',
          name: 'BBVA México',
          subtitle: 'Banca en Línea',
          usernameLabel: 'Usuario / Número de Cliente',
          passwordLabel: 'Contraseña',
          buttonText: 'Guardar Credenciales',
          logo: 'BBVA'
        };
      case 'SANTANDER':
        return {
          color: '#EC0000',
          name: 'Santander México',
          subtitle: '¡Bienvenido a SuperNet!',
          usernameLabel: 'Código de Cliente / No. Cuenta / Tarjeta',
          passwordLabel: 'Contraseña',
          buttonText: 'Continuar',
          logo: '🔥'
        };
      case 'BANAMEX':
        return {
          color: '#C41E3A',
          name: 'Banamex',
          subtitle: 'BancaNet - El Banco Nacional de México',
          usernameLabel: 'Número de Cliente',
          passwordLabel: 'Código de Acceso',
          buttonText: 'Ingresar',
          logo: 'BNX'
        };
      case 'BANORTE':
        return {
          color: '#E30613',
          name: 'Banorte',
          subtitle: 'El Banco Fuerte de México',
          usernameLabel: 'Usuario',
          passwordLabel: 'Contraseña',
          buttonText: 'Ingresar',
          logo: 'BNT'
        };
      case 'HSBC':
        return {
          color: '#DB0011',
          name: 'HSBC México',
          subtitle: 'Banca en Línea Personal',
          usernameLabel: 'Número de Cliente / Usuario',
          passwordLabel: 'Contraseña de Acceso',
          buttonText: 'Acceder',
          logo: 'HSBC'
        };
      case 'AZTECA':
        return {
          color: '#00A651',
          name: 'Banco Azteca',
          subtitle: 'Banca Digital',
          usernameLabel: 'Usuario / Número de Cliente',
          passwordLabel: 'Contraseña',
          buttonText: 'Ingresar',
          logo: 'AZ'
        };
      default:
        return {
          color: '#004481',
          name: bankName || 'Banco',
          subtitle: 'Banca en Línea',
          usernameLabel: 'Usuario / Número de Cliente',
          passwordLabel: 'Contraseña',
          buttonText: 'Guardar Credenciales',
          logo: 'BANK'
        };
    }
  };

  const config = getBankConfig(bankId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white">
        {/* Bank Header */}
        <div 
          className="text-white p-4 -m-6 mb-4 rounded-t-lg"
          style={{ backgroundColor: config.color }}
        >
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span 
                className="font-bold text-xs"
                style={{ color: config.color }}
              >
                {config.logo}
              </span>
            </div>
            <h2 className="text-lg font-semibold">{config.name}</h2>
          </div>
          <p className="text-center text-sm mt-2 opacity-90">{config.subtitle}</p>
        </div>

        {/* Bank Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Acceso a tu cuenta</h3>
            <p className="text-sm text-gray-600">Ingresa tus datos para continuar</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank-username" className="text-sm font-medium text-gray-700">
              {config.usernameLabel}
            </Label>
            <Input
              id="bank-username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="focus:ring-2"
              style={{ 
                borderColor: config.color,
                '--tw-ring-color': config.color 
              }}
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank-password" className="text-sm font-medium text-gray-700">
              {config.passwordLabel}
            </Label>
            <div className="relative">
              <Input
                id="bank-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pr-10 focus:ring-2"
                style={{ 
                  borderColor: config.color,
                  '--tw-ring-color': config.color 
                }}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Shield className="text-blue-600" size={16} />
              <span className="text-xs text-gray-700">
                Tus credenciales serán encriptadas y almacenadas de forma segura
              </span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 text-white"
              style={{ backgroundColor: config.color }}
              disabled={loading}
            >
              {loading ? 'Guardando...' : config.buttonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const BankCredentials = () => {
  const [banks, setBanks] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadBanks();
    loadCredentials();
  }, []);

  const loadBanks = async () => {
    try {
      console.log('Loading banks from API...');
      const response = await apiClient.get('/applicants/banks');
      console.log('Banks API response:', response);
      
      if (response && response.banks && response.banks.length > 0) {
        setBanks(response.banks);
        console.log('Using API banks:', response.banks.length);
      } else if (response && Array.isArray(response) && response.length > 0) {
        setBanks(response);
        console.log('Using API banks (array format):', response.length);
      } else {
        // Fallback banks with real UUIDs from the API
        const fallbackBanks = [
          {
            id: '7b4a1d12-cc50-46d8-81c7-08eebfc5bf5a',
            name: 'BBVA México',
            code: 'BBVA',
            logo_url: '/banks/bbva.jpg'
          },
          {
            id: 'b153f653-3af6-48ab-b3c7-44d919fbdcb6',
            name: 'Santander México',
            code: 'SANTANDER',
            logo_url: '/banks/santander.png'
          },
          {
            id: '43d4a40e-f175-4690-ad63-c86efc69adc0',
            name: 'Banamex',
            code: 'BANAMEX',
            logo_url: '/banks/banamex.jpg'
          },
          {
            id: '842f0822-e62f-47f6-a559-c5641cc16669',
            name: 'Banorte',
            code: 'BANORTE',
            logo_url: '/banks/banorte.jpg'
          },
          {
            id: '47dc2c19-dc0b-401d-8947-d8705b315d3e',
            name: 'HSBC México',
            code: 'HSBC',
            logo_url: '/banks/hsbc.png'
          },
          {
            id: 'f885f8e0-9f67-475d-9844-cf5fb34b0313',
            name: 'Banco Azteca',
            code: 'AZTECA',
            logo_url: '/banks/azteca.jpg'
          }
        ];
        setBanks(fallbackBanks);
        console.log('Using fallback banks:', fallbackBanks.length);
      }
    } catch (error) {
      console.error('Error loading banks:', error);
      // Use fallback banks with real UUIDs
      const fallbackBanks = [
        {
          id: '7b4a1d12-cc50-46d8-81c7-08eebfc5bf5a',
          name: 'BBVA México',
          code: 'BBVA',
          logo_url: '/banks/bbva.jpg'
        },
        {
          id: 'b153f653-3af6-48ab-b3c7-44d919fbdcb6',
          name: 'Santander México',
          code: 'SANTANDER',
          logo_url: '/banks/santander.png'
        },
        {
          id: '43d4a40e-f175-4690-ad63-c86efc69adc0',
          name: 'Banamex',
          code: 'BANAMEX',
          logo_url: '/banks/banamex.jpg'
        },
        {
          id: '842f0822-e62f-47f6-a559-c5641cc16669',
          name: 'Banorte',
          code: 'BANORTE',
          logo_url: '/banks/banorte.jpg'
        },
        {
          id: '47dc2c19-dc0b-401d-8947-d8705b315d3e',
          name: 'HSBC México',
          code: 'HSBC',
          logo_url: '/banks/hsbc.png'
        },
        {
          id: 'f885f8e0-9f67-475d-9844-cf5fb34b0313',
          name: 'Banco Azteca',
          code: 'AZTECA',
          logo_url: '/banks/azteca.jpg'
        }
      ];
      setBanks(fallbackBanks);
      console.log('Using fallback banks due to error:', fallbackBanks.length);
    }
  };

  const loadCredentials = async () => {
    try {
      console.log('Loading credentials from API...');
      const response = await apiClient.get('/applicants/credentials');
      console.log('Credentials API response:', response);
      
      if (response && Array.isArray(response)) {
        setCredentials(response);
        console.log('Loaded credentials:', response.length);
      } else {
        setCredentials([]);
        console.log('No credentials found');
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
      setCredentials([]);
    }
  };

  const handleBankSelect = (bank) => {
    console.log('Bank selected:', bank);
    setSelectedBank(bank);
    setIsModalOpen(true);
  };

  const handleCredentialSubmit = async (formData) => {
    if (!selectedBank) {
      showToast("Error", "No se ha seleccionado un banco", "destructive");
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting credentials for bank:', selectedBank);
      console.log('Form data:', formData);

      const credentialData = {
        provider_id: selectedBank.id, // Use the actual UUID from the API
        username: formData.username,
        password: formData.password
      };

      console.log('Sending credential data:', credentialData);
      const response = await apiClient.post('/applicants/credentials', credentialData);
      console.log('Save credentials response:', response);

      showToast("¡Éxito!", "Credenciales bancarias guardadas correctamente");

      setIsModalOpen(false);
      setSelectedBank(null);
      loadCredentials(); // Reload to show new credential
    } catch (error) {
      console.error('Error saving credentials:', error);
      showToast("Error", `Error al guardar las credenciales: ${error.message}`, "destructive");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCredential = async (credentialId) => {
    try {
      console.log('Deleting credential:', credentialId);
      await apiClient.delete(`/applicants/credentials/${credentialId}`);
      
      showToast("¡Éxito!", "Credenciales eliminadas correctamente");

      loadCredentials(); // Reload to update list
    } catch (error) {
      console.error('Error deleting credential:', error);
      showToast("Error", `Error al eliminar las credenciales: ${error.message}`, "destructive");
    }
  };

  const getConnectedBankIds = () => {
    return credentials.map(cred => cred.provider_id);
  };

  const getAvailableBanks = () => {
    const connectedIds = getConnectedBankIds();
    return banks.filter(bank => !connectedIds.includes(bank.id));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Datos Bancarios</h1>
        <p className="text-gray-600">Gestiona tus credenciales bancarias de forma segura</p>
      </div>

      {/* Connected Banks Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="text-green-600" size={24} />
            <span>Bancos Conectados ({credentials.length})</span>
          </CardTitle>
          <CardDescription>
            Bancos donde ya tienes credenciales guardadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No tienes bancos conectados aún</p>
              <p className="text-sm text-gray-400">Agrega tus credenciales bancarias para comenzar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {credentials.map((credential) => {
                const bank = banks.find(b => b.id === credential.provider_id);
                
                return (
                  <Card key={credential.id} className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            {bank?.logo_url ? (
                              <img 
                                src={bank.logo_url} 
                                alt={bank.name}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <Building2 
                              className="text-gray-400 w-8 h-8" 
                              style={{ display: bank?.logo_url ? 'none' : 'flex' }}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {bank?.name || 'Banco Desconocido'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Usuario: {credential.username}
                            </p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              Conectado
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCredential(credential.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Banks Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="text-blue-600" size={24} />
            <span>Bancos Disponibles ({getAvailableBanks().length})</span>
          </CardTitle>
          <CardDescription>
            Selecciona un banco para agregar tus credenciales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getAvailableBanks().length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <p className="text-gray-600 font-semibold">¡Todos los bancos conectados!</p>
              <p className="text-sm text-gray-500">Ya tienes credenciales para todos los bancos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAvailableBanks().map((bank) => (
                <Card 
                  key={bank.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-blue-200 hover:border-blue-300"
                  onClick={() => handleBankSelect(bank)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
                        {bank.logo_url ? (
                          <img 
                            src={bank.logo_url} 
                            alt={bank.name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <Building2 
                          className="text-gray-400 w-8 h-8" 
                          style={{ display: bank.logo_url ? 'none' : 'flex' }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{bank.name}</h3>
                        <p className="text-sm text-gray-600">Agregar credenciales</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          Disponible
                        </Badge>
                      </div>
                      <Plus className="text-blue-600" size={20} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Shield className="text-amber-600" size={24} />
            <div>
              <h3 className="font-semibold text-amber-800">Seguridad de tus Datos</h3>
              <p className="text-sm text-amber-700">
                Todas tus credenciales bancarias son encriptadas con AES-256 y almacenadas de forma segura. 
                Nunca compartimos tu información con terceros.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank-Specific Modal */}
      {selectedBank && (
        <BankSpecificModal
          bankId={selectedBank.code}
          bankName={selectedBank.name}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBank(null);
          }}
          onSubmit={handleCredentialSubmit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default BankCredentials;

