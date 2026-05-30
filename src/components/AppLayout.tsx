import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Property, SubscriptionTier } from '@/types/property';
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
import MapView from './MapView';
import InfoModal from './InfoModal';
import { Crown, Building2, Home, Briefcase, ArrowRight, LayoutGrid, Map } from 'lucide-react';

interface SubscriptionAccess {
  residentialRental: boolean;
  commercialRental: boolean;
  forSale: boolean;
}

const rowToProperty = (row: any): Property => ({
  id: row.id,
  title: row.title,
  category: row.category,
  type: row.type,
  transactionType: row.transaction_type,
  price: row.price,
  currency: row.currency || 'USD',
  location: row.location,
  city: row.city,
  description: row.description || '',
  amenities: row.amenities || [],
  images: row.images || [],
  bedrooms: row.bedrooms,
  bathrooms: row.bathrooms,
  size: row.size,
  sizeUnit: row.size_unit || 'sqm',
  status: row.status,
  ownerId: row.owner_id,
  ownerName: row.owner_name || '',
  ownerPhone: row.owner_phone || '',
  ownerEmail: row.owner_email || '',
  ownerWhatsApp: row.owner_whatsapp,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const AppLayout: React.FC = () => {
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
  const [currentView, setCurrentView] = useState('home');
  const [showHero, setShowHero] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showListPropertyModal, setShowListPropertyModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoPage, setInfoPage] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBedrooms, setSelectedBedrooms] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [ownerProperties, setOwnerProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  const loadProperties = useCallback(async () => {
    setLoadingProperties(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setProperties(data.map(rowToProperty));
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Error loading properties:', err);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const loadOwnerProperties = useCallback(async (ownerId: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setOwnerProperties(data.map(rowToProperty));
      }
    } catch (err) {
      console.error('Error loading owner properties:', err);
    }
  }, []);

  const fetchSubscriptions = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', uid)
        .eq('status', 'paid');
      if (!error && data && data.length > 0) {
        const access = {
          residentialRental: data.some(s => s.subscription_type === 'residential_rental'),
          commercialRental: data.some(s => s.subscription_type === 'commercial_rental'),
          forSale: data.some(s => s.subscription_type === 'for_sale'),
        };
        setSubscriptionAccess(access);
        setSubscriptionType(data[0].subscription_type);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };

  const checkSubscriptionStatus = useCallback(async () => {
    if (!userId) return;
    await fetchSubscriptions(userId);
  }, [userId]);

  useEffect(() => {
    const restoreSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = session.user;
        const uid = user.id;
        setUserId(uid);
        setUserEmail(user.email || '');
        setUserName(
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] || 'User'
        );
        const savedUserType = localStorage.getItem('proplink_user_type') as 'owner' | 'seeker' | null;
        const type = savedUserType || 'seeker';
        setUserType(type);
        setIsLoggedIn(true);
        if (type === 'owner') {
          loadOwnerProperties(uid);
        } else {
          await fetchSubscriptions(uid);
        }
      }
    };
    restoreSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn && userId && userType === 'seeker') {
      checkSubscriptionStatus();
      const interval = setInterval(checkSubscriptionStatus, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userId, userType, checkSubscriptionStatus]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminDashboard(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedTransaction('all');
    setSelectedCity('All Cities');
    setPriceRange({ min: 0, max: 0 });
    setSelectedBedrooms('all');
    setSortBy('newest');
  };

  const handleShowPage = (page: string) => {
    const propertyTypeMap: Record<string, { category?: string; type?: string; transaction?: string }> = {
      'residential-rent': { category: 'residential', transaction: 'rent' },
      'residential-sale': { category: 'residential', transaction: 'sale' },
      'apartments': { category: 'residential', type: 'apartment' },
      'rooms': { category: 'residential', type: 'room' },
      'stands': { category: 'residential', type: 'stand' },
      'commercial': { category: 'commercial' },
    };

    if (propertyTypeMap[page]) {
      const filters = propertyTypeMap[page];
      clearFilters();
      if (filters.category) setSelectedCategory(filters.category);
      if (filters.type) setSelectedType(filters.type);
      if (filters.transaction) setSelectedTransaction(filters.transaction);
      setShowHero(false);
      setCurrentView(filters.category === 'commercial' ? 'commercial' : 'residential');
      setTimeout(() => {
        const main = document.querySelector('main');
        if (main) main.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setInfoPage(page);
      setShowInfoModal(true);
    }
  };

  const filteredProperties = useMemo(() => {
    let filtered = properties;
    if (currentView === 'residential') filtered = filtered.filter(p => p.category === 'residential');
    else if (currentView === 'commercial') filtered = filtered.filter(p => p.category === 'commercial');
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query)
      );
    }
    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
    if (selectedType !== 'all') filtered = filtered.filter(p => p.type === selectedType);
    if (selectedTransaction !== 'all') filtered = filtered.filter(p => p.transactionType === selectedTransaction);
    if (selectedCity !== 'All Cities') filtered = filtered.filter(p => p.city === selectedCity);
    if (priceRange.min > 0) filtered = filtered.filter(p => p.price >= priceRange.min);
    if (priceRange.max > 0) filtered = filtered.filter(p => p.price <= priceRange.max);
    if (selectedBedrooms !== 'all') {
      const beds = parseInt(selectedBedrooms);
      if (beds === 5) {
        filtered = filtered.filter(p => p.bedrooms !== undefined && p.bedrooms >= 5);
      } else {
        filtered = filtered.filter(p => p.bedrooms === beds);
      }
    }
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return filtered;
  }, [properties, currentView, searchQuery, selectedCategory, selectedType, selectedTransaction, selectedCity, priceRange, selectedBedrooms, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (selectedTransaction !== 'all') count++;
    if (selectedCity !== 'All Cities') count++;
    if (priceRange.max > 0) count++;
    if (priceRange.min > 0) count++;
    if (selectedBedrooms !== 'all') count++;
    return count;
  }, [selectedCategory, selectedType, selectedTransaction, selectedCity, priceRange, selectedBedrooms]);

  const handleLogin = async (type: 'owner' | 'seeker') => {
    const { data: { user } } = await supabase.auth.getUser();
    const newUserId = user?.id || `user-${Date.now()}`;
    const newUserEmail = user?.email || '';
    setUserId(newUserId);
    setUserEmail(newUserEmail);
    setUserType(type);
    setUserName(
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      newUserEmail.split('@')[0] ||
      (type === 'owner' ? 'Property Owner' : 'Property Seeker')
    );
    localStorage.setItem('proplink_user_type', type);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    if (type === 'owner') {
      loadOwnerProperties(newUserId);
    }
    if (type === 'seeker' && newUserId) {
      await fetchSubscriptions(newUserId);
    }
    if (!disclaimerAccepted) {
      setShowDisclaimerModal(true);
    }
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    localStorage.removeItem('proplink_user_type');
    setIsLoggedIn(false);
    setUserId('');
    setUserEmail('');
    setUserType(null);
    setUserName('');
    setSubscriptionType(null);
    setSubscriptionAccess({ residentialRental: false, commercialRental: false, forSale: false });
    setOwnerProperties([]);
    setCurrentView('home');
  };

  const handleSubscribe = (tier: SubscriptionTier, subscription: any) => {
    setSubscriptionType(tier.accessType);
    const newAccess = { ...subscriptionAccess };
    if (tier.accessType === 'residential_rental') {
      newAccess.residentialRental = true;
    } else if (tier.accessType === 'commercial_rental') {
      newAccess.commercialRental = true;
    }
    setSubscriptionAccess(newAccess);
    setShowSubscriptionModal(false);
  };

  const canViewContact = (property: Property): boolean => {
    if (property.category === 'commercial' && property.transactionType === 'rent') return true;
    if (property.category === 'residential') return subscriptionAccess.residentialRental;
    if (property.category === 'commercial') return subscriptionAccess.commercialRental;
    return false;
  };

  const handleListProperty = async (propertyData: Partial<Property>) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: propertyData.title,
          category: propertyData.category,
          type: propertyData.type,
          transaction_type: propertyData.transactionType,
          price: propertyData.price,
          currency: 'USD',
          location: propertyData.location,
          city: propertyData.city,
          description: propertyData.description,
          amenities: propertyData.amenities || [],
          images: propertyData.images || [],
          bedrooms: propertyData.bedrooms || null,
          bathrooms: propertyData.bathrooms || null,
          size: propertyData.size || null,
          size_unit: propertyData.sizeUnit || 'sqm',
          status: 'available',
          owner_id: userId,
          owner_name: userName,
          owner_phone: propertyData.ownerPhone,
          owner_email: propertyData.ownerEmail,
          owner_whatsapp: propertyData.ownerWhatsApp || null,
        })
        .select()
        .single();
      if (!error && data) {
        const newProperty = rowToProperty(data);
        setProperties(prev => [newProperty, ...prev]);
        setOwnerProperties(prev => [newProperty, ...prev]);
      } else {
        console.error('Error saving property:', error);
      }
    } catch (err) {
      console.error('Error saving property:', err);
    }
    setShowListPropertyModal(false);
    setEditingProperty(null);
  };

  const handleUpdatePropertyStatus = async (propertyId: string, status: 'available' | 'leased' | 'sold') => {
    try {
      await supabase
        .from('properties')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', propertyId);
    } catch (err) {
      console.error('Error updating property status:', err);
    }
    setOwnerProperties(prev => prev.map(p =>
      p.id === propertyId ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p
    ));
    setProperties(prev => prev.map(p =>
      p.id === propertyId ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p
    ));
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await supabase.from('properties').delete().eq('id', propertyId);
    } catch (err) {
      console.error('Error deleting property:', err);
    }
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

  if (showAdminDashboard) {
    return <AdminDashboard onClose={() => setShowAdminDashboard(false)} />;
  }

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
        <Footer
          onShowDisclaimer={() => setShowDisclaimerModal(true)}
          onShowPage={handleShowPage}
        />
        {showSubscriptionModal && (
          <SubscriptionModal
            onClose={() => setShowSubscriptionModal(false)}
            onSubscribe={handleSubscribe}
            currentSubscription={subscriptionType}
            userId={userId}
            userEmail={userEmail}
            userType={userType}
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
            userId={userId}
            userEmail={userEmail}
          />
        )}
        {showInfoModal && (
          <InfoModal page={infoPage} onClose={() => setShowInfoModal(false)} />
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{getViewTitle()}</h2>
            <p className="text-gray-500 mt-1">{filteredProperties.length} properties found</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'map' ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
            </div>
            {isLoggedIn && userType === 'seeker' && !subscriptionType && (
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
              >
                <Crown className="w-5 h-5" />
                Subscribe
              </button>
            )}
          </div>
        </div>

        {!showHero && (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            <button onClick={() => setCurrentView('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${currentView === 'home' ? 'bg-cyan-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>
              <Building2 className="w-4 h-4" />All Properties
            </button>
            <button onClick={() => setCurrentView('residential')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${currentView === 'residential' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>
              <Home className="w-4 h-4" />Residential
            </button>
            <button onClick={() => setCurrentView('commercial')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${currentView === 'commercial' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>
              <Briefcase className="w-4 h-4" />Commercial
            </button>
          </div>
        )}

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
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedBedrooms={selectedBedrooms}
          setSelectedBedrooms={setSelectedBedrooms}
          properties={properties}
        />

        {loadingProperties ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : viewMode === 'map' ? (
          <MapView
            properties={filteredProperties}
            onPropertyClick={setSelectedProperty}
          />
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} onClick={setSelectedProperty} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors">
              Clear Filters
            </button>
          </div>
        )}

        {!isLoggedIn && (
          <section className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Subscribe to access property owner contact details and connect directly with landlords and sellers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Residential Rental</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">$2</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="text-gray-300 text-sm flex items-center gap-2"><ArrowRight className="w-4 h-4 text-cyan-400" />Houses, Apartments, Rooms</li>
                  <li className="text-gray-300 text-sm flex items-center gap-2"><ArrowRight className="w-4 h-4 text-cyan-400" />Direct owner contact</li>
                  <li className="text-gray-300 text-sm flex items-center gap-2"><ArrowRight className="w-4 h-4 text-cyan-400" />30 days access</li>
                </ul>
                <button onClick={() => setShowAuthModal(true)} className="w-full py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors">Get Started</button>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Commercial Rental</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">FREE</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="text-gray-300 text-sm flex items-center gap-2"><ArrowRight className="w-4 h-4 text-green-400" />Offices, Shops, Warehouses</li>
                  <li className="text-gray-300 text-sm flex items-center gap-2"><ArrowRight className="w-4 h-4 text-green-400" />Direct owner contact</li>
                  <li className="text-gray-300 text-sm flex items-center gap-2"><ArrowRight className="w-4 h-4 text-green-400" />No subscription needed</li>
                </ul>
                <button onClick={() => setShowAuthModal(true)} className="w-full py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors">Get Started</button>
              </div>
            </div>
          </section>
        )}

        <section className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How PropLink Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Simple steps to find your perfect property or list yours for free</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyan-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Browse Properties</h3>
              <p className="text-gray-500">Search through residential and commercial properties across Zimbabwe</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyan-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Subscribe</h3>
              <p className="text-gray-500">Choose a plan that fits your needs and get instant access to owner contact details</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyan-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect Directly</h3>
              <p className="text-gray-500">Contact property owners directly via phone, email, or WhatsApp</p>
            </div>
          </div>
        </section>
      </main>

      <Footer
        onShowDisclaimer={() => setShowDisclaimerModal(true)}
        onShowPage={handleShowPage}
      />

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribe}
          currentSubscription={subscriptionType}
          userId={userId}
          userEmail={userEmail}
          userType={userType}
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
          userId={userId}
          userEmail={userEmail}
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

      {showInfoModal && (
        <InfoModal page={infoPage} onClose={() => setShowInfoModal(false)} />
      )}
    </div>
  );
};

export default AppLayout;
