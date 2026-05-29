import React, { useState } from 'react';
import { Property } from '@/types/property';
import { 
  X, MapPin, Bed, Bath, Maximize, Phone, Mail, MessageCircle, 
  Lock, ChevronLeft, ChevronRight, Building2, Calendar, Check, Loader2
} from 'lucide-react';

interface PropertyModalProps {
  property: Property;
  onClose: () => void;
  hasSubscription: boolean;
  onSubscribe: () => void;
  subscriptionType: string | null;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ 
  property, 
  onClose, 
  hasSubscription, 
  onSubscribe,
  subscriptionType 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number, transactionType: string) => {
    if (price >= 1000) {
      return transactionType === 'rent' 
        ? `$${price.toLocaleString()}/month`
        : `$${price.toLocaleString()}`;
    }
    return transactionType === 'rent' ? `$${price}/month` : `$${price}`;
  };

  // Commercial rental is FREE for seekers — always show contact
  const canViewContact = () => {
    if (property.category === 'commercial' && property.transactionType === 'rent') {
      return true; // FREE
    }
    return hasSubscription;
  };

  const getRequiredSubscription = () => {
    if (property.category === 'residential' && property.transactionType === 'rent') {
      return 'Residential Rental ($2/month)';
    }
    if (property.category === 'residential' && property.transactionType === 'sale') {
      return 'a subscription';
    }
    if (property.category === 'commercial' && property.transactionType === 'sale') {
      return 'a subscription';
    }
    return 'a subscription';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Property Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Gallery */}
        <div className="relative h-64 md:h-96 bg-gray-100">
          <img 
            src={property.images[currentImageIndex]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {property.images.length > 1 && (
            <>
              <button onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              property.status === 'available' ? 'bg-emerald-500 text-white' :
              property.status === 'leased' ? 'bg-amber-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </span>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              property.transactionType === 'rent' ? 'bg-cyan-500 text-white' : 'bg-purple-500 text-white'
            }`}>
              {property.transactionType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price and Title */}
          <div className="mb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-3xl font-bold text-cyan-600">
                {formatPrice(property.price, property.transactionType)}
              </span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                property.category === 'residential' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {property.category === 'residential' ? 'Residential' : 'Commercial'} - {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">{property.title}</h1>
            <div className="flex items-center text-gray-500 mt-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Property Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-semibold">{property.bedrooms}</p>
                </div>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-semibold">{property.bathrooms}</p>
                </div>
              </div>
            )}
            {property.size && (
              <div className="flex items-center gap-2">
                <Maximize className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-semibold">{property.size} {property.sizeUnit}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-600" />
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-semibold capitalize">{property.type}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span key={index}
                    className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                    <Check className="w-4 h-4 text-emerald-500" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Listed Date */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
            <Calendar className="w-4 h-4" />
            <span>Listed on {new Date(property.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })}</span>
          </div>

          {/* Contact Section */}
          {property.status === 'available' ? (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Property Owner</h3>

              {canViewContact() ? (
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4">
                  {property.category === 'commercial' && property.transactionType === 'rent' && (
                    <div className="mb-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
                      <Check className="w-4 h-4" />
                      <span>Commercial rental contacts are free to view</span>
                    </div>
                  )}
                  <p className="font-semibold text-gray-800 mb-3">{property.ownerName}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <a href={`tel:${property.ownerPhone}`}
                      className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors">
                      <Phone className="w-5 h-5" />
                      <span>{property.ownerPhone}</span>
                    </a>
                    <a href={`mailto:${property.ownerEmail}`}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      <Mail className="w-5 h-5" />
                      <span>Email</span>
                    </a>
                    {property.ownerWhatsApp && (
                      <a href={`https://wa.me/${property.ownerWhatsApp.replace(/\+/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Subscribe to View Contact Details
                  </h4>
                  <p className="text-gray-600 mb-4">
                    To contact this property owner, you need <strong>{getRequiredSubscription()}</strong>.
                  </p>
                  <button onClick={onSubscribe}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all">
                    Subscribe Now
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="border-t pt-6">
              <div className="bg-amber-50 rounded-xl p-6 text-center">
                <p className="text-amber-800 font-medium">
                  This property is no longer available. It has been marked as {property.status}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
