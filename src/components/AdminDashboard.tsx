import React, { useState } from 'react';
import { 
  Users, Building2, DollarSign, AlertTriangle, Search, 
  MoreVertical, Ban, CheckCircle, Eye, Trash2, 
  TrendingUp, Calendar, Filter
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  userType: 'owner' | 'seeker';
  status: 'active' | 'suspended';
  listingsCount?: number;
  subscriptionType?: string;
  createdAt: string;
}

interface AdminDashboardProps {
  onClose: () => void;
}

const MOCK_USERS: AdminUser[] = [
  { id: '1', name: 'John Moyo', email: 'john@email.com', userType: 'owner', status: 'active', listingsCount: 5, createdAt: '2024-12-01' },
  { id: '2', name: 'Sarah Ncube', email: 'sarah@email.com', userType: 'owner', status: 'active', listingsCount: 3, createdAt: '2024-12-05' },
  { id: '3', name: 'Peter Chikwava', email: 'peter@email.com', userType: 'seeker', status: 'active', subscriptionType: 'buyer', createdAt: '2024-12-08' },
  { id: '4', name: 'Grace Mutasa', email: 'grace@email.com', userType: 'seeker', status: 'suspended', subscriptionType: 'residential_rental', createdAt: '2024-12-10' },
  { id: '5', name: 'Tendai Zimuto', email: 'tendai@email.com', userType: 'owner', status: 'active', listingsCount: 8, createdAt: '2024-12-12' },
  { id: '6', name: 'Michael Banda', email: 'michael@email.com', userType: 'seeker', status: 'active', subscriptionType: 'commercial_rental', createdAt: '2024-12-15' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'payments'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'owner' | 'seeker'>('all');
  const [users, setUsers] = useState(MOCK_USERS);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = userFilter === 'all' || user.userType === userFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
    setActiveMenu(null);
  };

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
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Exit Admin
            </button>
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
                  <span className="text-emerald-500 text-sm font-medium">+12%</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">2,547</p>
                <p className="text-gray-500">Total Users</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-emerald-500 text-sm font-medium">+8%</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">1,234</p>
                <p className="text-gray-500">Active Listings</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-emerald-500 text-sm font-medium">+23%</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">$4,580</p>
                <p className="text-gray-500">Monthly Revenue</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">3</p>
                <p className="text-gray-500">Flagged Accounts</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'New user registered', user: 'Michael Banda', time: '2 hours ago', type: 'user' },
                  { action: 'Property listed', user: 'Sarah Ncube', time: '4 hours ago', type: 'listing' },
                  { action: 'Subscription purchased', user: 'Peter Chikwava', time: '6 hours ago', type: 'payment' },
                  { action: 'Property marked as sold', user: 'John Moyo', time: '8 hours ago', type: 'listing' },
                  { action: 'Account suspended', user: 'Grace Mutasa', time: '1 day ago', type: 'warning' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'user' ? 'bg-blue-100' :
                      activity.type === 'listing' ? 'bg-purple-100' :
                      activity.type === 'payment' ? 'bg-emerald-100' :
                      'bg-amber-100'
                    }`}>
                      {activity.type === 'user' && <Users className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'listing' && <Building2 className="w-5 h-5 text-purple-600" />}
                      {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-emerald-600" />}
                      {activity.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.user}</p>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Filters */}
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
                    {filter === 'all' ? 'All Users' : `${filter}s`}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
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
                          {user.userType === 'owner' ? 'Property Owner' : 'Property Seeker'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status === 'active' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                          <span className="capitalize">{user.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.userType === 'owner' 
                          ? `${user.listingsCount} listings`
                          : user.subscriptionType 
                            ? `${user.subscriptionType.replace('_', ' ')} plan`
                            : 'No subscription'
                        }
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>

                          {activeMenu === user.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-2 z-10">
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                View Profile
                              </button>
                              <button
                                onClick={() => toggleUserStatus(user.id)}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                                  user.status === 'active' ? 'text-amber-600' : 'text-emerald-600'
                                }`}
                              >
                                {user.status === 'active' ? (
                                  <>
                                    <Ban className="w-4 h-4" />
                                    Suspend Account
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    Activate Account
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Listings Management</h3>
            <p className="text-gray-500">View and moderate all property listings from this panel.</p>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Transactions</h3>
            <p className="text-gray-500">View all subscription payments and transaction history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
