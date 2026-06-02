import React, { useState } from 'react';
import { Property } from '@/types/property';
import { MapPin, Bed, Bath, Maximize, Building2, MessageCircle, ShieldCheck } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const [imgError, setImgError] = useState(false);

  const formatPrice = (price: number, transactionType: string) => {
    if (price >= 1000) {
      return transactionType === 'rent'
        ? `$${price.toLocaleString()}/mo`
        : `$${price.toLocaleString()}`;
    }
    return transactionType === 'rent' ? `$${price}/mo` : `$${price}`;
  };

  const getStatusBadge = () => {
    switch (property.status) {
      case 'available':
        return (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Available
          </span>
        );
      case 'leased':
        return (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Leased
          </span>
        );
      case 'sold':
        return (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Sold
          </span>
        );
    }
  };

  const getTypeBadge = () => {
    return (
      <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${
        property.transactionType === 'rent'
          ? 'bg-cyan-500 text-white'
          : 'bg-purple-500 text-white'
      }`}>
        {property.transactionType === 'rent' ? 'For Rent' : 'For Sale'}
      </span>
    );
  };

  const getCategoryBadge = () => {
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
        property.category === 'residential'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-orange-100 text-orange-700'
      }`}>
        {property.category === 'residential' ? 'Residential' : 'Commercial'}
      </span>
    );
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hi, I saw your listing on PropLink: "${property.title}" in ${property.location}. Is it still available?`
    );
    const phone = (property.ownerWhatsApp || property.ownerPhone || '').replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const hasWhatsApp = property.ownerWhatsApp || property.ownerPhone;

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
        property.status !== 'available' ? 'opacity-75' : ''
      }`}
      onClick={() => onClick(property)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {!imgError && property.images[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Building2 className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-400 font-medium capitalize">{property.type}</span>
          </div>
        )}
        {getStatusBadge()}
        {getTypeBadge()}
        {property.status !== 'available' && (
          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">No Longer Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price and Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-navy-800">
            {formatPrice(property.price, property.transactionType)}
          </span>
          {getCategoryBadge()}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>

        {/* Direct Owner Badge */}
        <div className="flex items-center gap-1 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">Direct Owner Listing</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-gray-600 text-sm border-t pt-3">
          {property.bedrooms !== undefined && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms !== undefined && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          {property.size && (
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{property.size} {property.sizeUnit}</span>
            </div>
          )}
          {!property.bedrooms && !property.bathrooms && (
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span className="capitalize">{property.type}</span>
            </div>
          )}
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-1 mt-3">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-xs text-cyan-600 font-medium">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* WhatsApp Button */}
        {hasWhatsApp && property.status === 'available' && (
          <button
            onClick={handleWhatsApp}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Enquire on WhatsApp
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
