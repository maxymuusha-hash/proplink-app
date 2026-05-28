import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Property, SubscriptionTier } from '@/types/property';
import { PROPERTIES } from '@/data/properties';
import { supabase } from '@/lib/supabase';
import Header from './Header';
import Footer from './Footer';
import HeroSection from './HeroSection';
import FilterBar from './FilterBar';
import PropertyCard from './PropertyCard';
import PropertyModal from './PropertyModal';
import SubscriptionModal from './SubscriptionModal';
import DisclaimerModal from './DisclaimerModal';
import AuthModal from './AuthModal';
import ListPropertyModal from './ListPropertyModal';
import OwnerDashboard from './OwnerDashboard';
import AdminDashboard from './AdminDashboard';
import { Crown, Building2, Home, Briefcase, ArrowRight } from 'lucide-react';

interface SubscriptionAccess {
  residentialRental: boolean;
  commercialRental: boolean;
  forSale: boolean;
}

const AppLayout: React.FC = () => {
  // User state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userType, setUserType] = useState<'owner' | 'seeker' | null>(null);
  const [userName, setUserName] = useState('');
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);
  const [subscriptionAccess, setSubscriptionAccess] = useState<SubscriptionAccess>({
    residentialRental: false,
    commercialRental: false,
    forSale: false
  });
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // View state
  const [currentView, setCurrentView] = useState('home');
  const [showHero, setShowHero] = useState(true);

  // Modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showListPropertyModal, setShowListPropertyModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [showFilters, setShowFilters] = useState(false);

  // Properties state
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  const [ownerProperties, setOwnerProperties] = useState<Property[]>([]);

  // Check subscription status
  const checkSubscriptionStatus = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: { userId }
      });

      if (!error && data) {
        setSubscriptionAccess(data.access || {
          residentialRental: false,
          commercialRental: false,
          forSale: false
        });

        // Set primary subscription type for display
        if (data.accessTypes && data.accessTypes.length > 0) {
          setSubscriptionType(data.accessTypes[0]);
        }
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  }, [userId]);

  // Check subscription on login and periodically
  useEffect(() => {
    if (isLoggedIn && userId && userType === 'seeker') {
      checkSubscriptionStatus();
      // Check every 5 minutes
      const interval = setInterval(checkSubscriptionStatus, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userId, userType, checkSubscriptionStatus]);

  // Check for admin access (simple demo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminDashboard(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter properties
  const filteredProperties = useMemo(() => {
    let filtered = properties;

    // Apply category filter from view
    if (currentView === 'residential') {
      filtered = filtered.filter(p => p.category === 'residential');
    } else if (currentView === 'commercial') {
      filtered = filtered.filter(p => p.category === 'commercial');
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    // Transaction filter
    if (selectedTransaction !== 'all') {
      filtered = filtered.filter(p => p.transactionType === selectedTransaction);
    }

    // City filter
    if (selectedCity !== 'All Cities') {
      filtered = filtered.filter(p => p.city === selectedCity);
    }

    // Price filter
    if (priceRange.max > 0) {
      filtered = filtered.filter(p => p.price <= priceRange.max);
    }

    return filtered;
  }, [properties, currentView, searchQuery, selectedCategory, selectedType, selectedTransaction, selectedCity, priceRange]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (selectedTransaction !== 'all') count++;
    if (selectedCity !== 'All Cities') count++;
    if (priceRange.max > 0) count++;
    return count;
  }, [selectedCategory, selectedType, selectedTransaction, selectedCity, priceRange]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedTransaction('all');
    setSelectedCity('All Cities');
    setPriceRange({ min: 0, max: 0 });
  };

const handleLogin = async (type: 'owner' | 'seeker') => {
    const { data: { user } } = await supabase.auth.getUser();
    const newUserId = user?.id || `user-${Date.now()}`;
    const newUserEmail = user?.email || '';

    setUserId(newUserId);
    setUserEmail(newUserEmail);
    setUserType(type);
    setUserName(user?.user_metadata?.name || (type === 'owner' ? 'Property Owner' : 'Property Seeker'));
    setIsLoggedIn(true);
    setShowAuthModal(false);

    if (type === 'owner') {
      setOwnerProperties(PROPERTIES.slice(0, 3).map(p => ({ ...p, ownerId: newUserId })));
    }

    if (!disclaimerAccepted) {
      setShowDisclaimerModal(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    setUserEmail('');
    setUserType(null);
    setUserName('');
    setSubscriptionType(null);
    setSubscriptionAccess({
      residentialRental: false,
      commercialRental: false,
      forSale: false
    });
    setOwnerProperties([]);
    setCurrentView('home');
  };

  const handleSubscribe = (tier: SubscriptionTier, subscription: any) => {
    // Update local state based on subscription
    setSubscriptionType(tier.accessType);
    
    // Update access based on tier
    const newAccess = { ...subscriptionAccess };
    if (tier.accessType === 'residential_rental') {
      newAccess.residentialRental = true;
    } else if (tier.accessType === 'commercial_rental') {
      newAccess.commercialRental = true;
    } else if (tier.accessType === 'buyer') {
      newAccess.forSale = true;
      newAccess.residentialRental = true;
      newAccess.commercialRental = true;
    }
    setSubscriptionAccess(newAccess);
    
    setShowSubscriptionModal(false);
  };

  const canViewContact = (property: Property): boolean => {
    if (property.transactionType === 'sale') {
      return subscriptionAccess.forSale;
    }
    
    if (property.category === 'residential') {
      return subscriptionAccess.residentialRental || subscriptionAccess.forSale;
    }
    
    if (property.category === 'commercial') {
      return subscriptionAccess.commercialRental || subscriptionAccess.forSale;
    }
    
    return false;
  };

  const handleListProperty = (propertyData: Partial<Property>) => {
    const newProperty: Property = {
      id: `new-${Date.now()}`,
      title: propertyData.title || '',
      category: propertyData.category || 'residential',
      type: propertyData.type || 'house',
      transactionType: propertyData.transactionType || 'rent',
      price: propertyData.price || 0,
      currency: 'USD',
      location: `${propertyData.location}, ${propertyData.city}`,
      city: propertyData.city || 'Harare',
      description: propertyData.description || '',
      amenities: propertyData.amenities || [],
      images: ['https://d64gsuwffb70l.cloudfront.net/6946db6198d16b00e323578d_1766251491901_702fd7fe.png'],
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      size: propertyData.size,
      sizeUnit: propertyData.sizeUnit || 'sqm',
      status: 'available',
      ownerId: userId,
      ownerName: userName,
      ownerPhone: propertyData.ownerPhone || '',
      ownerEmail: propertyData.ownerEmail || '',
      ownerWhatsApp: propertyData.ownerWhatsApp,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setOwnerProperties(prev => [newProperty, ...prev]);
    setProperties(prev => [newProperty, ...prev]);
    setShowListPropertyModal(false);
    setEditingProperty(null);
  };

  const handleUpdatePropertyStatus = (propertyId: string, status: 'available' | 'leased' | 'sold') => {
    setOwnerProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p
    ));
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p
    ));
  };

  const handleDeleteProperty = (propertyId: string) => {
    setOwnerProperties(prev => prev.filter(p => p.id !== propertyId));
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const handleBrowseProperties = () => {
    setShowHero(false);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'residential': return 'Residential Properties';
      case 'commercial': return 'Commercial Properties';
      default: return 'All Properties';
    }
  };

  // Admin Dashboard
  if (showAdminDashboard) {
    return <AdminDashboard onClose={() => setShowAdminDashboard(false)} />;
  }

  // Owner Dashboard View
  if (currentView === 'dashboard' && userType === 'owner') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          isLoggedIn={isLoggedIn}
          userType={userType}
          userName={userName}
          subscriptionType={subscriptionType}
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onSubscribe={() => setShowSubscriptionModal(true)}
          onListProperty={() => setShowListPropertyModal(true)}
          onViewDashboard={() => setCurrentView('dashboard')}
          currentView={currentView}
          setCurrentView={(view) => {
            setCurrentView(view);
            setShowHero(view === 'home');
          }}
        />
        
        <OwnerDashboard
          properties={ownerProperties}
          onAddProperty={() => setShowListPropertyModal(true)}
          onEditProperty={(property) => {
            setEditingProperty(property);
            setShowListPropertyModal(true);
          }}
          onUpdateStatus={handleUpdatePropertyStatus}
          onDeleteProperty={handleDeleteProperty}
        />

        <Footer onShowDisclaimer={() => setShowDisclaimerModal(true)} />

        {showListPropertyModal && (
          <ListPropertyModal
            onClose={() => {
              setShowListPropertyModal(false);
              setEditingProperty(null);
            }}
            onSubmit={handleListProperty}
            editProperty={editingProperty}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isLoggedIn={isLoggedIn}
        userType={userType}
        userName={userName}
        subscriptionType={subscriptionType}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onSubscribe={() => setShowSubscriptionModal(true)}
        onListProperty={() => {
          if (!isLoggedIn) {
            setShowAuthModal(true);
          } else {
            setShowListPropertyModal(true);
          }
        }}
        onViewDashboard={() => setCurrentView('dashboard')}
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setShowHero(view === 'home');
        }}
      />

      {/* Hero Section - Only show on home view initially */}
      {showHero && currentView === 'home' && (
        <HeroSection
          onBrowseProperties={handleBrowseProperties}
          onListProperty={() => {
            if (!isLoggedIn) {
              setShowAuthModal(true);
            } else {
              setShowListPropertyModal(true);
            }
          }}
          onLogin={() => setShowAuthModal(true)}
          isLoggedIn={isLoggedIn}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{getViewTitle()}</h2>
            <p className="text-gray-500 mt-1">
              {filteredProperties.length} properties found
            </p>
          </div>
          
          {/* Subscription CTA for seekers */}
          {isLoggedIn && userType === 'seeker' && !subscriptionType && (
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
            >
              <Crown className="w-5 h-5" />
              Subscribe to View Contacts
            </button>
          )}
        </div>

        {/* Category Quick Filters */}
        {!showHero && (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                currentView === 'home'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              <Building2 className="w-4 h-4" />
              All Properties
            </button>
            <button
              onClick={() => setCurrentView('residential')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                currentView === 'residential'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              <Home className="w-4 h-4" />
              Residential
            </button>
            <button
              onClick={() => setCurrentView('commercial')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                currentView === 'commercial'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Commercial
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          clearFilters={clearFilters}
          activeFiltersCount={activeFiltersCount}
        />

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={setSelectedProperty}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Subscription Tiers Section */}
        {!isLoggedIn && (
          <section className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Subscribe to access property owner contact details and connect directly with landlords and sellers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Residential Rental */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Residential Rental</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">$3</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="text-gray-300 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    Houses, Apartments, Rooms
                  </li>
                  <li className="text-gray-300 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    Direct owner contact
                  </li>
                  <li className="text-gray-300 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    30 days access
                  </li>
                </ul>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
                >
                  Get Started
                </button>
              </div>

              {/* Commercial Rental */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Commercial Rental</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">$10</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="text-gray-300 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    Offices, Shops, Warehouses
                  </li>
                  <li className="text-gray-300 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    Direct owner contact
                  </li>
                  <li className="text-gray-300 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    30 days access
                  </li>
                </ul>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
                >
                  Get Started
                </button>
              </div>

              {/* Property Buyer */}
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-amber-400/30 relative">
                <div className="absolute -top-3 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Best Value
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Property Buyer</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">$30</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="text-gray-300 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                    All properties for sale
                  </li>
                  <li className="text-gray-300 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                    Direct owner contact
                  </li>
                  <li className="text-gray-300 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                    Priority support
                  </li>
                </ul>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  Get Started
                </button>
              </div>
            </div>
          </section>
        )}

        {/* How It Works Section */}
        <section className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How PropLink Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Simple steps to find your perfect property or list yours for free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyan-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Browse Properties</h3>
              <p className="text-gray-500">
                Search through thousands of residential and commercial properties across Zimbabwe
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyan-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Subscribe</h3>
              <p className="text-gray-500">
                Choose a plan that fits your needs and get instant access to owner contact details
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyan-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect Directly</h3>
              <p className="text-gray-500">
                Contact property owners directly via phone, email, or WhatsApp
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer onShowDisclaimer={() => setShowDisclaimerModal(true)} />

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribe}
          currentSubscription={subscriptionType}
          userId={userId}
          userEmail={userEmail}
        />
      )}

      {showDisclaimerModal && (
        <DisclaimerModal
          onAccept={() => {
            setDisclaimerAccepted(true);
            setShowDisclaimerModal(false);
          }}
        />
      )}

      {showListPropertyModal && (
        <ListPropertyModal
          onClose={() => {
            setShowListPropertyModal(false);
            setEditingProperty(null);
          }}
          onSubmit={handleListProperty}
          editProperty={editingProperty}
        />
      )}

      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          hasSubscription={canViewContact(selectedProperty)}
          subscriptionType={subscriptionType}
          onSubscribe={() => {
            setSelectedProperty(null);
            setShowSubscriptionModal(true);
          }}
        />
      )}
    </div>
  );
};

export default AppLayout;
