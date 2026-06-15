import React, { useState, useEffect } from 'react';
import {
  Users, Building2, DollarSign, Search,
  TrendingUp, RefreshCw, Flag, AlertTriangle, ShieldCheck, BarChart2, ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'payments' | 'reports'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'owner' | 'seeker' | 'flagged'>('all');
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeListings: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    newSignupsToday: 0,
    newSignupsThisWeek: 0,
    newSignupsThisMonth: 0,
    flaggedOwners: 0,
    totalReports: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: subsData } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: propsData } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: usersData } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: reportsData } = await supabase
        .from('listing_reports')
        .select('*')
        .order('created_at', { ascending: false });

      const subs = subsData || [];
      const props = propsData || [];
      const allUsers = usersData || [];
      const allReports = reportsData || [];

      setSubscriptions(subs);
      setProperties(props);
      setReports(allReports);

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const paidSubs = subs.filter(s => s.status === 'paid');
      const monthRevenue = paidSubs
        .filter(s => new Date(s.created_at) >= monthStart)
        .reduce((sum, s) => sum + (s.amount || 2), 0);
      const totalRevenue = paidSubs.reduce((sum, s) => sum + (s.amount || 2), 0);

      const newToday = allUsers.filter(u => new Date(u.created_at) >= todayStart).length;
      const newWeek = allUsers.filter(u => new Date(u.created_at) >= weekStart).length;
      const newMonth = allUsers.filter(u => new Date(u.created_at) >= monthStart).length;

      const userMap = new Map<string, any>();
      allUsers.forEach(u => {
        const listingCount = props.filter(p => p.owner_id === u.id).length;
        userMap.set(u.id, {
          id: u.id,
          email: u.email || 'N/A',
          name: u.full_name || u.email?.split('@')[0] || 'User',
          userType: u.user_type || 'seeker',
          status: 'active',
          subscriptionType: subs.find(s => s.user_id === u.id)?.subscription_type || null,
          listingsCount: listingCount,
          isFlagged: listingCount >= 4,
          createdAt: u.created_at,
        });
      });

      const allUsersArr = Array.from(userMap.values());
      const flaggedCount = allUsersArr.filter(u => u.isFlagged).length;

      setStats({
        totalUsers: allUsers.length,
        activeListings: props.filter(p => p.status === 'available').length,
        monthlyRevenue: monthRevenue,
        totalRevenue: totalRevenue,
        newSignupsToday: newToday,
        newSignupsThisWeek: newWeek,
        newSignupsThisMonth: newMonth,
        flaggedOwners: flaggedCount,
        totalReports: allReports.length,
      });

      setUsers(allUsersArr);

    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAnalytics = () => {
    window.open('https://analytics.google.com/analytics/web/#/p539313917/reports/intelligenthome', '_blank');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      userFilter === 'all' ? true :
      userFilter === 'flagged' ? user.isFlagged :
      user.userType === userFilter;
    return matchesSearch && matchesFilter;
  });

  const paidSubscriptions = subscriptions.filter(s => s.status === 'paid');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'listings', label: 'Listings', icon: Building2 },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'reports', label: `Reports${stats.totalReports > 0 ? ` (${stats.totalReports})` : ''}`, icon: Flag },
  ];

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">PropLink Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openAnalytics}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <BarChart2 className="w-4 h-4" />
                Analytics
                <ExternalLink className="w-3 h-3" />
              </button>
              <button onClick={loadData} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                Exit Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-purple-600 text-white' :
                tab.id === 'reports' && stats.totalReports > 0 ? 'bg-red-50 text-red-600 hover:bg-red-100' :
                'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">

                {/* Google Analytics Card */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <BarChart2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Website Traffic & Analytics</h3>
                        <p className="text-orange-100 text-sm">See how many people are visiting PropLink</p>
                      </div>
                    </div>
                    <button
                      onClick={openAnalytics}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-sm"
                    >
                      Open Analytics
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <p className="text-white/70 text-xs">Visitors</p>
                      <p className="text-white font-bold text-lg">Live on GA</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <p className="text-white/70 text-xs">Countries</p>
                      <p className="text-white font-bold text-lg">Live on GA</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <p className="text-white/70 text-xs">Devices</p>
                      <p className="text-white font-bold text-lg">Live on GA</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                    <p className="text-gray-500">Total Users</p>
                    <p className="text-xs text-emerald-600 mt-1">+{stats.newSignupsThisMonth} this month</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.activeListings}</p>
                    <p className="text-gray-500">Active Listings</p>
                    <p className="text-xs text-gray-400 mt-1">{properties.length} total</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">${stats.monthlyRevenue}</p>
                    <p className="text-gray-500">This Month's Revenue</p>
                    <p className="text-xs text-gray-400 mt-1">${stats.totalRevenue} all time</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-cyan-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.newSignupsThisWeek}</p>
                    <p className="text-gray-500">New Signups (7 days)</p>
                    <p className="text-xs text-emerald-600 mt-1">+{stats.newSignupsToday} today</p>
                  </div>
                </div>

                {(stats.flaggedOwners > 0 || stats.totalReports > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.flaggedOwners > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-amber-800">{stats.flaggedOwners} Flagged Owner{stats.flaggedOwners > 1 ? 's' : ''}</p>
                          <p className="text-sm text-amber-700">Owner(s) with 4+ listings — possible agents</p>
                          <button onClick={() => { setActiveTab('users'); setUserFilter('flagged'); }}
                            className="text-xs text-amber-600 font-medium hover:underline mt-1">
                            View flagged owners →
                          </button>
                        </div>
                      </div>
                    )}
                    {stats.totalReports > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Flag className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-red-800">{stats.totalReports} Listing Report{stats.totalReports > 1 ? 's' : ''}</p>
                          <p className="text-sm text-red-700">Users have reported suspicious listings</p>
                          <button onClick={() => setActiveTab('reports')}
                            className="text-xs text-red-600 font-medium hover:underline mt-1">
                            View reports →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Signup Activity</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Today', value: stats.newSignupsToday, color: 'bg-cyan-500' },
                        { label: 'This Week', value: stats.newSignupsThisWeek, color: 'bg-blue-500' },
                        { label: 'This Month', value: stats.newSignupsThisMonth, color: 'bg-purple-500' },
                        { label: 'All Time', value: stats.totalUsers, color: 'bg-gray-400' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-4">
                          <span className="w-28 text-sm text-gray-600">{item.label}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-3">
                            <div className={`${item.color} h-3 rounded-full transition-all`}
                              style={{ width: stats.totalUsers > 0 ? `${Math.min((item.value / Math.max(stats.totalUsers, 1)) * 100, 100)}%` : '0%' }} />
                          </div>
                          <span className="w-8 text-sm font-semibold text-gray-800 text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscription Breakdown</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Residential Rental', type: 'residential_rental', color: 'bg-blue-500' },
                        { label: 'Commercial Rental', type: 'commercial_rental', color: 'bg-green-500' },
                        { label: 'For Sale', type: 'for_sale', color: 'bg-orange-500' },
                      ].map((item) => {
                        const count = paidSubscriptions.filter(s => s.subscription_type === item.type).length;
                        return (
                          <div key={item.type} className="flex items-center gap-4">
                            <span className="w-40 text-sm text-gray-600">{item.label}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-3">
                              <div className={`${item.color} h-3 rounded-full`}
                                style={{ width: paidSubscriptions.length > 0 ? `${(count / paidSubscriptions.length) * 100}%` : '0%' }} />
                            </div>
                            <span className="w-8 text-sm font-semibold text-gray-800 text-right">{count}</span>
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t mt-2">
                        <p className="text-sm text-gray-500">Total paid subscriptions: <span className="font-semibold text-gray-800">{paidSubscriptions.length}</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Signups</h3>
                  {users.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No users yet</p>
                  ) : (
                    <div className="space-y-3">
                      {users.slice(0, 10).map((user, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-gray-800 font-medium">{user.name}</p>
                              {user.isFlagged && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> Flagged
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                              user.userType === 'owner' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {user.userType === 'owner' ? 'Owner' : 'Seeker'}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'owner', label: 'Owners' },
                      { id: 'seeker', label: 'Seekers' },
                      { id: 'flagged', label: '⚠️ Flagged' },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setUserFilter(filter.id as any)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize ${
                          userFilter === filter.id
                            ? filter.id === 'flagged' ? 'bg-amber-500 text-white' : 'bg-purple-600 text-white'
                            : filter.id === 'flagged' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {filter.label}
                        {filter.id === 'flagged' && stats.flaggedOwners > 0 && (
                          <span className="ml-1 bg-amber-600 text-white text-xs px-1.5 py-0.5 rounded-full">{stats.flaggedOwners}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No users found</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Details</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className={`hover:bg-gray-50 ${user.isFlagged ? 'bg-amber-50' : ''}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div>
                                  <p className="font-medium text-gray-800">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                user.userType === 'owner' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {user.userType === 'owner' ? 'Owner' : 'Seeker'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {user.userType === 'owner'
                                ? `${user.listingsCount} listing(s)`
                                : user.subscriptionType
                                  ? user.subscriptionType.replace(/_/g, ' ')
                                  : 'No subscription'}
                            </td>
                            <td className="px-6 py-4">
                              {user.isFlagged ? (
                                <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full w-fit">
                                  <AlertTriangle className="w-3 h-3" /> Possible Agent
                                </span>
                              ) : user.userType === 'owner' ? (
                                <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full w-fit">
                                  <ShieldCheck className="w-3 h-3" /> Normal
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full w-fit">
                                  <ShieldCheck className="w-3 h-3" /> Active
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-800">All Listings ({properties.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  {properties.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No listings yet</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Property</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Owner</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Listed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {properties.map((p) => {
                          const ownerListingCount = properties.filter(x => x.owner_id === p.owner_id).length;
                          return (
                            <tr key={p.id} className={`hover:bg-gray-50 ${ownerListingCount >= 4 ? 'bg-amber-50' : ''}`}>
                              <td className="px-6 py-4">
                                <p className="font-medium text-gray-800">{p.title}</p>
                                <p className="text-sm text-gray-500">{p.city}</p>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 capitalize">{p.type} · {p.transaction_type}</td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-800">${p.price?.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  p.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                                  p.status === 'sold' ? 'bg-gray-100 text-gray-600' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  {p.owner_name}
                                  {ownerListingCount >= 4 && (
                                    <span title="Owner has 4+ listings">
                                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">All Transactions ({paidSubscriptions.length})</h3>
                  <p className="text-sm text-gray-500">Total: <span className="font-semibold text-emerald-600">${stats.totalRevenue}</span></p>
                </div>
                <div className="overflow-x-auto">
                  {paidSubscriptions.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No payments yet</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Plan</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {paidSubscriptions.map((sub, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-800">{sub.user_email || 'Unknown'}</p>
                              <p className="text-xs text-gray-400">{sub.user_id?.slice(0, 12)}...</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                              {sub.subscription_type?.replace(/_/g, ' ')}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                              ${sub.amount || 2}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                Paid
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(sub.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    Reported Listings ({reports.length})
                  </h3>
                  {reports.length > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                      Requires Review
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto">
                  {reports.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No reports yet</p>
                      <p className="text-sm mt-1">All listings are clean!</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Property</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reason</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Owner</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reported</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {reports.map((report, i) => (
                          <tr key={i} className="hover:bg-red-50">
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-800">{report.property_title || 'Unknown'}</p>
                              <p className="text-xs text-gray-400">ID: {report.property_id?.slice(0, 8)}...</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-red-700 bg-red-50 px-2 py-1 rounded">
                                {report.reason}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <p>{report.owner_name || 'N/A'}</p>
                              <p className="text-xs text-gray-400">{report.owner_email || ''}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
