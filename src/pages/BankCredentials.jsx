import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Building2, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import BankSpecificModal from './BankSpecificModal'; // Import the new bank-specific modals

const BankCredentials = () => {
  const [banks, setBanks] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Fallback banks data with proper IDs for modal mapping
  const fallbackBanks = [
    {
      id: 'bbva-fallback-1',
      name: 'BBVA México',
      code: 'bbva',
      logo_url: '/banks/bbva.jpg'
    },
    {
      id: 'santander-fallback-2',
      name: 'Santander México',
      code: 'santander',
      logo_url: '/banks/santander.png'
    },
    {
      id: 'banamex-fallback-3',
      name: 'Banamex',
      code: 'banamex',
      logo_url: '/banks/banamex.jpg'
    },
    {
      id: 'banorte-fallback-4',
      name: 'Banorte',
      code: 'banorte',
      logo_url: '/banks/banorte.jpg'
    },
    {
      id: 'hsbc-fallback-5',
      name: 'HSBC México',
      code: 'hsbc',
      logo_url: '/banks/hsbc.png'
    },
    {
      id: 'azteca-fallback-6',
      name: 'Banco Azteca',
      code: 'azteca',
      logo_url: '/banks/azteca.jpg'
    }
  ];

  useEffect(() => {
    loadBanks();
    loadCredentials();
  }, []);

  const loadBanks = async () => {
    try {
      console.log('Loading banks from API...');
      const response = await apiClient.get('/applicants/banks');
      console.log('Banks API response:', response);
      
      if (response && response.length > 0) {
        // Map API banks to include bank codes for modal selection
        const banksWithCodes = response.map(bank => ({
          ...bank,
          code: getBankCode(bank.name)
        }));
        setBanks(banksWithCodes);
        console.log('Using API banks:', banksWithCodes.length);
      } else {
        setBanks(fallbackBanks);
        console.log('Using fallback banks:', fallbackBanks.length);
      }
    } catch (error) {
      console.error('Error loading banks:', error);
      setBanks(fallbackBanks);
      console.log('Using fallback banks due to error:', fallbackBanks.length);
    }
  };

  const getBankCode = (bankName) => {
    const name = bankName.toLowerCase();
    if (name.includes('bbva')) return 'bbva';
    if (name.includes('santander')) return 'santander';
    if (name.includes('banamex')) return 'banamex';
    if (name.includes('banorte')) return 'banorte';
    if (name.includes('hsbc')) return 'hsbc';
    if (name.includes('azteca')) return 'azteca';
    return 'bbva'; // Default fallback
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
      toast({
        title: "Error",
        description: "No se ha seleccionado un banco",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting credentials for bank:', selectedBank);
      console.log('Form data:', formData);

      const credentialData = {
        provider_id: selectedBank.id,
        username: formData.username,
        password: formData.password
      };

      console.log('Sending credential data:', credentialData);
      const response = await apiClient.post('/applicants/credentials', credentialData);
      console.log('Save credentials response:', response);

      toast({
        title: "¡Éxito!",
        description: "Credenciales bancarias guardadas correctamente",
      });

      setIsModalOpen(false);
      setSelectedBank(null);
      loadCredentials(); // Reload to show new credential
    } catch (error) {
      console.error('Error saving credentials:', error);
      toast({
        title: "Error",
        description: `Error al guardar las credenciales: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCredential = async (credentialId) => {
    try {
      console.log('Deleting credential:', credentialId);
      await apiClient.delete(`/applicants/credentials/${credentialId}`);
      
      toast({
        title: "¡Éxito!",
        description: "Credenciales eliminadas correctamente",
      });

      loadCredentials(); // Reload to update list
    } catch (error) {
      console.error('Error deleting credential:', error);
      toast({
        title: "Error",
        description: `Error al eliminar las credenciales: ${error.message}`,
        variant: "destructive",
      });
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
                const bank = banks.find(b => b.id === credential.provider_id) || 
                           fallbackBanks.find(b => b.id === credential.provider_id);
                
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

