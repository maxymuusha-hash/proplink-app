import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Building2, Search, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (userType: 'owner' | 'seeker') => void;
  initialMode?: 'login' | 'register';
  initialUserType?: 'owner' | 'seeker';
}

const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLogin,
  initialMode = 'login',
  initialUserType = 'seeker'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [userType, setUserType] = useState<'owner' | 'seeker'>(initialUserType);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (mode === 'register' && !formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (mode === 'register' && !formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (mode === 'register' && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.name, phone: formData.phone, user_type: userType } }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      }
      onLogin(userType);
    } catch (err: any) {
      const message = err.message || '';
      if (
        mode === 'login' &&
        (message.toLowerCase().includes('invalid login') ||
          message.toLowerCase().includes('invalid credentials') ||
          message.toLowerCase().includes('user not found') ||
          message.toLowerCase().includes('email not confirmed'))
      ) {
        setErrors({ email: 'No account found. Please sign up first.', _suggest: 'signup' });
      } else {
        setErrors({ email: message || 'Authentication failed' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-cyan-100 mt-1">{mode === 'login' ? 'Sign in to your account' : 'Join PropLink today'}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <p className="text-sm text-gray-600 mb-2 text-center">I am a:</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setUserType('owner')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${userType === 'owner' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 hover:border-gray-300'}`}>
              <Building2 className="w-5 h-5" /><span className="font-medium">Property Owner</span>
            </button>
            <button type="button" onClick={() => setUserType('seeker')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${userType === 'seeker' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 hover:border-gray-300'}`}>
              <Search className="w-5 h-5" /><span className="font-medium">Property Seeker</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.name ? 'border-red-500' : 'border-gray-200'}`} />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.email ? 'border-red-500' : 'border-gray-200'}`} />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            {errors._suggest === 'signup' && (
              <button type="button" onClick={() => { setMode('register'); setErrors({}); }}
                className="mt-2 w-full py-2 border-2 border-cyan-500 text-cyan-600 rounded-lg font-medium hover:bg-cyan-50 transition-colors text-sm">
                Create a new account →
              </button>
            )}
          </div>

          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+263 7X XXX XXXX"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`} />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.password ? 'border-red-500' : 'border-gray-200'}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)} placeholder="Confirm your password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`} />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {mode === 'register' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {userType === 'owner' ? 'As a Property Owner, you can:' : 'As a Property Seeker, you can:'}
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                {userType === 'owner' ? (
                  <><li>• List properties for FREE</li><li>• Manage your listings anytime</li><li>• Connect with verified seekers</li></>
                ) : (
                  <><li>• Browse all properties for FREE</li><li>• Subscribe to view owner contacts</li><li>• Save favorite properties</li></>
                )}
              </ul>
            </div>
          )}

          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>

          <p className="text-center text-gray-600 mt-4">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button type="button" onClick={() => { setMode('register'); setErrors({}); }} className="text-cyan-600 font-semibold hover:underline">Sign Up</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setErrors({}); }} className="text-cyan-600 font-semibold hover:underline">Sign In</button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
