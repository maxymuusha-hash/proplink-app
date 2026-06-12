import React, { useState, useEffect } from 'react';
import { Building2, Search, ArrowRight, Home, Briefcase, Key, ShoppingBag, CheckCircle, Zap, Phone, MapPin, Download, X } from 'lucide-react';

interface HeroSectionProps {
  onBrowseProperties: () => void;
  onListProperty: () => void;
  onLogin: () => void;
  isLoggedIn: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  onBrowseProperties, 
  onListProperty,
  onLogin,
  isLoggedIn
}) => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa_banner_dismissed');
    if (dismissed) return;

    // Capture install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  return (
    <section className="relative overflow-hidden">

      {/* PWA Install Banner */}
      {showBanner && !isInstalled && (
        <div className="relative z-50 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Install PropLink App</p>
                <p className="text-cyan-100 text-xs">Add to your home screen for quick access</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-cyan-600 rounded-lg font-semibold text-sm hover:bg-cyan-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/6946db6198d16b00e323578d_1766251466743_1116cebf.jpg"
          alt="Property Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full mb-6">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">Zimbabwe's Trusted Property Marketplace</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"> Property </span>
            Today
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Connect directly with property owners. Browse residential and commercial 
            properties for rent or sale across Zimbabwe — no agents, no hassle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={onBrowseProperties}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
            >
              <Search className="w-5 h-5" />
              Browse Properties
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={isLoggedIn ? onListProperty : onLogin}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              <Building2 className="w-5 h-5" />
              List Your Property Free
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">Free to List</p>
                <p className="text-gray-400 text-xs">For all owners</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <Phone className="w-6 h-6 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">Direct Contact</p>
                <p className="text-gray-400 text-xs">No middlemen</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <Zap className="w-6 h-6 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">Instant Access</p>
                <p className="text-gray-400 text-xs">From just $2/month</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <MapPin className="w-6 h-6 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">Nationwide</p>
                <p className="text-gray-400 text-xs">All towns & cities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="relative bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">What are you looking for?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={onBrowseProperties}
              className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition-all border border-blue-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Home className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Residential Rent</h3>
              <p className="text-sm text-gray-500">Houses, Apartments, Rooms</p>
            </button>

            <button 
              onClick={onBrowseProperties}
              className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition-all border border-purple-100"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Key className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Buy Property</h3>
              <p className="text-sm text-gray-500">Homes, Stands, Commercial</p>
            </button>

            <button 
              onClick={onBrowseProperties}
              className="group p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl hover:shadow-lg transition-all border border-orange-100"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Briefcase className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Commercial Rent</h3>
              <p className="text-sm text-gray-500">Offices, Shops, Warehouses</p>
            </button>

            <button 
              onClick={isLoggedIn ? onListProperty : onLogin}
              className="group p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl hover:shadow-lg transition-all border border-emerald-100"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <ShoppingBag className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">List Property</h3>
              <p className="text-sm text-gray-500">Free for Owners</p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
