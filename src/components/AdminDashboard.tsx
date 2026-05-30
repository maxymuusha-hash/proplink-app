import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, DollarSign, AlertTriangle, Search, 
  MoreVertical, Ban, CheckCircle, Eye, TrendingUp, RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'payments'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'owner' | 'seeker'>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Real data state
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeListings: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    newSignupsToday: 0,
    newSignupsThisWeek: 0,
    newSignupsThisMonth: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      // Load users from auth.users via profiles or subscriptions
      const { data: subsData } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      // Load properties
      const { data: propsData } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      const subs = subsData || [];
      const props = propsData || [];

      setSubscriptions(subs);
      setProperties(props);

      // Calculate stats
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const paidSubs = subs.filter(s => s.status === 'paid');
      const monthRevenue = paidSubs
        .filter(s => new Date(s.created_at) >= monthStart)
        .reduce((sum, s) => sum + (s.amount || 2), 0);
      const totalRevenue = paidSubs.reduce((sum, s) => sum + (s.amount || 2), 0);

      const newToday = subs.filter(s => new Date(s.created_at) >= todayStart).length;
      const newWeek = subs.filter(s => new Date(s.created_at) >= weekStart).length;
      const newMonth = subs.filter(s => new Date(s.created_at) >= monthStart).length;

      // Unique users from subscriptions
      const uniqueUsers = new Set(subs.map(s => s.user_id));

      setStats({
        totalUsers: uniqueUsers.size,
        activeListings: props.filter(p => p.status === 'available').length,
        monthlyRevenue: monthRevenue,
        totalRevenue: totalRevenue,
        newSignupsToday: newToday,
        newSignupsThisWeek: newWeek,
        newSignupsThisMonth: newMonth,
      });

      // Build user list from subscriptions
      const userMap = new Map<string, any>();
      subs.forEach(s => {
        if (!userMap.has(s.user_id)) {
          userMap.set(s.user_id, {
            id: s.user_id,
            email: s.user_email || 'N/A',
            name: s.user_email?.split('@')[0] || 'User',
            userType: 'seeker',
            status: 'active',
            subscriptionType: s.subscription_type,
            createdAt: s.created_at,
          });
        }
      });

      // Add owners from properties
      props.forEach(p => {
        if (p.owner_id && !userMap.has(p.owner_id)) {
          userMap.set(p.owner_id, {
            id: p.owner_id,
            email: p.owner_email || 'N/A',
            name: p.owner_name || 'Owner',
            userType: 'owner',
            status: 'active',
            listingsCount: props.filter(pr => pr.owner_id === p.owner_id).length,
            createdAt: p.created_at,
          });
        }
      });

      setUsers(Array.from(userMap.values()));

    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = userFilter === 'all' || user.userType === userFilter;
    return matchesSearch && matchesFilter;
  });

  const paidSubscriptions = subscriptions.filter(s => s.status === 'paid');

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
      {/* Header */}
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
                onClick={loadData}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Exit Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'listings', label: 'Listings', icon: Building2 },
            { id: 'payments', label: 'Payments', icon: DollarSign }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                    <p className="text-gray-500">Total Users</p>
                    <p className="text-xs text-emerald-600 mt-1">+{stats.newSignupsThisMonth} this month</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.activeListings}</p>
                    <p className="text-gray-500">Active Listings</p>
                    <p className="text-xs text-gray-400 mt-1">{properties.length} total</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">${stats.monthlyRevenue}</p>
                    <p className="text-gray-500">This Month's Revenue</p>
                    <p className="text-xs text-gray-400 mt-1">${stats.totalRevenue} all time</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-cyan-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.newSignupsThisWeek}</p>
                    <p className="text-gray-500">New Signups (7 days)</p>
                    <p className="text-xs text-emerald-600 mt-1">+{stats.newSignupsToday} today</p>
                  </div>
                </div>

                {/* New Signups Breakdown */}
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
                            <div
                              className={`${item.color} h-3 rounded-full transition-all`}
                              style={{ width: stats.totalUsers > 0 ? `${Math.min((item.value / Math.max(stats.totalUsers, 1)) * 100, 100)}%` : '0%' }}
                            />
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
                              <div
                                className={`${item.color} h-3 rounded-full`}
                                style={{ width: paidSubscriptions.length > 0 ? `${(count / paidSubscriptions.length) * 100}%` : '0%' }}
                              />
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

                {/* Recent Subscriptions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Subscriptions</h3>
                  {paidSubscriptions.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No subscriptions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {paidSubscriptions.slice(0, 10).map((sub, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium">{sub.user_email || sub.user_id?.slice(0, 8) + '...'}</p>
                            <p className="text-sm text-gray-500 capitalize">{sub.subscription_type?.replace(/_/g, ' ')} plan</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-emerald-600">${sub.amount || 2}</p>
                            <p className="text-xs text-gray-400">{new Date(sub.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Users Tab */}
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
                  <div className="flex gap-2">
                    {['all', 'owner', 'seeker'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setUserFilter(filter as any)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize ${
                          userFilter === filter
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {filter === 'all' ? 'All' : `${filter}s`}
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
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                user.userType === 'owner'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {user.userType === 'owner' ? 'Owner' : 'Seeker'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {user.userType === 'owner'
                                ? `${user.listingsCount} listing(s)`
                                : user.subscriptionType
                                  ? user.subscriptionType.replace(/_/g, ' ')
                                  : 'No subscription'
                              }
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

            {/* Listings Tab */}
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
                        {properties.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50">
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
                            <td className="px-6 py-4 text-sm text-gray-600">{p.owner_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* Payments Tab */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
