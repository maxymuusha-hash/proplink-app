import React, { useState } from 'react';
import { Property } from '@/types/property';
import { 
  Plus, Edit2, Trash2, Eye, MoreVertical, 
  CheckCircle, XCircle, Clock, MapPin, DollarSign 
} from 'lucide-react';

interface OwnerDashboardProps {
  properties: Property[];
  onAddProperty: () => void;
  onEditProperty: (property: Property) => void;
  onUpdateStatus: (propertyId: string, status: 'available' | 'leased' | 'sold') => void;
  onDeleteProperty: (propertyId: string) => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  properties,
  onAddProperty,
  onEditProperty,
  onUpdateStatus,
  onDeleteProperty
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'leased':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'sold':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-700';
      case 'leased':
        return 'bg-amber-100 text-amber-700';
      case 'sold':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatPrice = (price: number, transactionType: string) => {
    if (price >= 1000) {
      return transactionType === 'rent' 
        ? `$${price.toLocaleString()}/mo`
        : `$${price.toLocaleString()}`;
    }
    return transactionType === 'rent' ? `$${price}/mo` : `$${price}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
          <p className="text-gray-600 mt-1">Manage your property listings</p>
        </div>
        <button
          onClick={onAddProperty}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Property
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {properties.filter(p => p.status === 'available').length}
              </p>
              <p className="text-gray-500">Available</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {properties.filter(p => p.status === 'leased').length}
              </p>
              <p className="text-gray-500">Leased</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {properties.filter(p => p.status === 'sold').length}
              </p>
              <p className="text-gray-500">Sold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Listed</h3>
          <p className="text-gray-500 mb-6">Start by adding your first property listing</p>
          <button
            onClick={onAddProperty}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all"
          >
            Add Your First Property
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Listed</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1">{property.title}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {property.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        property.transactionType === 'rent' 
                          ? 'bg-cyan-100 text-cyan-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {property.transactionType === 'rent' ? 'For Rent' : 'For Sale'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        {formatPrice(property.price, property.transactionType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${getStatusBadge(property.status)}`}>
                        {getStatusIcon(property.status)}
                        <span className="capitalize">{property.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 relative">
                        <button
                          onClick={() => onEditProperty(property)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => setActiveMenu(activeMenu === property.id ? null : property.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>

                        {activeMenu === property.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-2 z-10">
                            <p className="px-4 py-1 text-xs text-gray-400 uppercase">Change Status</p>
                            <button
                              onClick={() => {
                                onUpdateStatus(property.id, 'available');
                                setActiveMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              Mark Available
                            </button>
                            <button
                              onClick={() => {
                                onUpdateStatus(property.id, 'leased');
                                setActiveMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4 text-amber-500" />
                              Mark Leased
                            </button>
                            <button
                              onClick={() => {
                                onUpdateStatus(property.id, 'sold');
                                setActiveMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                              Mark Sold
                            </button>
                            <div className="border-t my-2"></div>
                            <button
                              onClick={() => {
                                setDeleteConfirm(property.id);
                                setActiveMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Listing
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Property?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProperty(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
