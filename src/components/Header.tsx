import React, { useState, useRef } from 'react';
import { Menu, X, User, LogOut, Building2, Crown, ChevronDown } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  userType: 'owner' | 'seeker' | null;
  userName: string;
  subscriptionType: string | null;
  onLogin: () => void;
  onLogout: () => void;
  onSubscribe: () => void;
  onListProperty: () => void;
  onViewDashboard: () => void;
  onOpenAdmin?: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  userType,
  userName,
  subscriptionType,
  onLogin,
  onLogout,
  onSubscribe,
  onListProperty,
  onViewDashboard,
  onOpenAdmin,
  currentView,
  setCurrentView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2000);
    if (tapCountRef.current >= 7) {
      tapCountRef.current = 0;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      if (onOpenAdmin) onOpenAdmin();
    }
  };

  const getSubscriptionLabel = () => {
    switch (subscriptionType) {
      case 'residential_rental': return 'Residential';
      case 'commercial_rental': return 'Commercial';
      case 'buyer': return 'Buyer';
      default: return null;
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setCurrentView('home');
              handleLogoTap();
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              Prop<span className="text-cyan-600">Link</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'home' ? 'text-cyan-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Browse Properties
            </button>
            <button
              onClick={() => setCurrentView('residential')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'residential' ? 'text-cyan-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Residential
            </button>
            <button
              onClick={() => setCurrentView('commercial')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'commercial' ? 'text-cyan-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Commercial
            </button>
            {isLoggedIn && userType === 'owner' && (
              <button
                onClick={onViewDashboard}
                className={`text-sm font-medium transition-colors ${
                  currentView === 'dashboard' ? 'text-cyan-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                My Listings
              </button>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {userType === 'owner' && (
                  <button
                    onClick={onListProperty}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all"
                  >
                    List Property
                  </button>
                )}
                {userType === 'seeker' && !subscriptionType && (
                  <button
                    onClick={onSubscribe}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                  >
                    <Crown className="w-4 h-4" />
                    Subscribe
                  </button>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-medium text-gray-800">{userName}</p>
                      {subscriptionType && (
                        <p className="text-xs text-cyan-600">{getSubscriptionLabel()} Plan</p>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-800">{userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{userType}</p>
                      </div>
                      {userType === 'seeker' && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onSubscribe();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Crown className="w-4 h-4" />
                          {subscriptionType ? 'Manage Subscription' : 'Subscribe'}
                        </button>
                      )}
                      {userType === 'owner' && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onViewDashboard();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Building2 className="w-4 h-4" />
                          My Listings
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onLogin}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Browse Properties
              </button>
              <button
                onClick={() => {
                  setCurrentView('residential');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Residential
              </button>
              <button
                onClick={() => {
                  setCurrentView('commercial');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Commercial
              </button>

              <div className="border-t my-2"></div>

              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2">
                    <p className="font-medium text-gray-800">{userName}</p>
                    <p className="text-sm text-gray-500 capitalize">{userType}</p>
                  </div>
                  {userType === 'owner' && (
                    <>
                      <button
                        onClick={() => {
                          onListProperty();
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-2 text-left text-cyan-600 font-medium hover:bg-cyan-50 rounded-lg"
                      >
                        List Property
                      </button>
                      <button
                        onClick={() => {
                          onViewDashboard();
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        My Listings
                      </button>
                    </>
                  )}
                  {userType === 'seeker' && (
                    <button
                      onClick={() => {
                        onSubscribe();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 text-left text-amber-600 font-medium hover:bg-amber-50 rounded-lg"
                    >
                      {subscriptionType ? 'Manage Subscription' : 'Subscribe'}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="mx-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium text-center"
                  >
                    Get Started
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
