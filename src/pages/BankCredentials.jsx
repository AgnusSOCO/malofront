/**
 * Bank credentials page component for managing bank information
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const BankCredentials = () => {
  const { user } = useAuth();
  const [banks, setBanks] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    provider_id: '',
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mock bank data with logos (in a real app, this would come from the API)
  const bankLogos = {
    bbva: '/src/assets/banks/mNy50uG8tyoQ.jpg',
    santander: '/src/assets/banks/w6GpUlkF7sPZ.png',
    banamex: '/src/assets/banks/oKmSCUhMe4g3.jpg',
    banorte: '/src/assets/banks/H4SRMdUbKgRx.jpg',
    hsbc: '/src/assets/banks/f4PteTcNLLYX.png',
    azteca: '/src/assets/banks/xpGST9FkBYAJ.jpg',
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [banksData, credentialsData] = await Promise.all([
        apiClient.getBanks(),
        apiClient.getBankCredentials()
      ]);
      setBanks(banksData.banks || []);
      setCredentials(credentialsData.credentials || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Error al cargar la información bancaria');
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
      await apiClient.addBankCredentials(
        formData.provider_id,
        formData.username,
        formData.password
      );
      
      // Reset form and refresh data
      setFormData({ provider_id: '', username: '', password: '' });
      setShowAddForm(false);
      setError(null);
      await fetchData();
    } catch (error) {
      console.error('Failed to add bank credentials:', error);
      setError(error.message || 'Error al agregar las credenciales bancarias');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (credentialId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar estas credenciales bancarias?')) {
      return;
    }

    try {
      await apiClient.deleteBankCredentials(credentialId);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete bank credentials:', error);
      setError('Error al eliminar las credenciales bancarias');
    }
  };

  const getBankLogo = (bankId) => {
    return bankLogos[bankId] || '/src/assets/banks/default-bank.png';
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Datos Bancarios</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tu información bancaria de forma segura
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Security Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Seguridad de tus Datos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Tus credenciales bancarias están protegidas con encriptación AES-256 y solo son 
            accesibles por personal autorizado para la evaluación de tu solicitud de préstamo.
          </p>
        </CardContent>
      </Card>

      {/* Existing Credentials */}
      {credentials.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Bancos Registrados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentials.map((credential) => (
              <Card key={credential.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getBankLogo(credential.provider_id)}
                        alt={credential.provider?.display_name}
                        className="w-12 h-12 object-contain rounded"
                        onError={(e) => {
                          e.target.src = '/src/assets/banks/default-bank.png';
                        }}
                      />
                      <div>
                        <h3 className="font-medium">
                          {credential.provider?.display_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Usuario: {credential.username || '***'}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Registrado
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(credential.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add New Bank */}
      {!showAddForm ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {credentials.length === 0 ? 'Agrega tu Banco' : 'Agregar Otro Banco'}
              </h3>
              <p className="text-gray-600 mb-4">
                {credentials.length === 0 
                  ? 'Necesitamos tu información bancaria para procesar tu solicitud de préstamo'
                  : 'Puedes agregar múltiples bancos para mejorar tu perfil crediticio'
                }
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Banco
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Información Bancaria</CardTitle>
            <CardDescription>
              Selecciona tu banco e ingresa tus credenciales de banca en línea
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bank Selection */}
              <div className="space-y-2">
                <Label>Selecciona tu Banco</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, provider_id: bank.id }))}
                      className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        formData.provider_id === bank.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={getBankLogo(bank.id)}
                        alt={bank.display_name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.target.src = '/src/assets/banks/default-bank.png';
                        }}
                      />
                      <span className="text-xs text-center">{bank.display_name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Credentials Form */}
              {formData.provider_id && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuario de Banca en Línea</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Tu usuario de banca en línea"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Tu contraseña de banca en línea"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Guardando...' : 'Guardar Credenciales'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setFormData({ provider_id: '', username: '', password: '' });
                        setError(null);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankCredentials;

