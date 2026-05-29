import React, { useState } from 'react';
import { X, Check, Upload, Trash2, Image } from 'lucide-react';
import { Property, PropertyCategory, PropertyType, TransactionType, getListingTier, SubscriptionTier } from '@/types/property';
import { CITIES } from '@/data/properties';
import { supabase } from '@/lib/supabase';
import PaymentModal from './PaymentModal';

interface ListPropertyModalProps {
  onClose: () => void;
  onSubmit: (property: Partial<Property>) => void;
  editProperty?: Property | null;
  userId: string;
  userEmail: string;
}

const PROPERTY_TYPES_BY_CATEGORY = {
  residential: [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'room', label: 'Room' },
    { value: 'stand', label: 'Stand' }
  ],
  commercial: [
    { value: 'office', label: 'Office' },
    { value: 'shop', label: 'Shop' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'industrial', label: 'Industrial Space' }
  ]
};

const AMENITIES_OPTIONS = [
  'Water', 'Electricity', 'Parking', 'Security', 'Garden', 'Pool',
  'Borehole', 'Solar', 'Generator', 'WiFi', 'Furnished', 'Air Conditioning',
  'Elevator', 'Gym', 'Staff Quarters', 'Loading Bays', '3-Phase Power'
];

const ListPropertyModal: React.FC<ListPropertyModalProps> = ({
  onClose,
  onSubmit,
  editProperty,
  userId,
  userEmail
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingProperty, setPendingProperty] = useState<Partial<Property> | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentTier, setPaymentTier] = useState<SubscriptionTier | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(editProperty?.images || []);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: editProperty?.title || '',
    category: (editProperty?.category || 'residential') as PropertyCategory,
    type: (editProperty?.type || 'house') as PropertyType,
    transactionType: (editProperty?.transactionType || 'rent') as TransactionType,
    price: editProperty?.price || '',
    location: editProperty?.location || '',
    city: editProperty?.city || 'Harare',
    description: editProperty?.description || '',
    bedrooms: editProperty?.bedrooms || '',
    bathrooms: editProperty?.bathrooms || '',
    size: editProperty?.size || '',
    sizeUnit: editProperty?.sizeUnit || 'sqm',
    amenities: editProperty?.amenities || [] as string[],
    ownerPhone: editProperty?.ownerPhone || '',
    ownerEmail: editProperty?.ownerEmail || '',
    ownerWhatsApp: editProperty?.ownerWhatsApp || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.price) newErrors.price = 'Price is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }
    if (currentStep === 2) {
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }
    if (currentStep === 3) {
      if (!formData.ownerPhone.trim()) newErrors.ownerPhone = 'Phone number is required';
      if (!formData.ownerEmail.trim()) newErrors.ownerEmail = 'Email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > 5) {
      setUploadError('Maximum 5 images allowed');
      return;
    }

    setUploadingImages(true);
    setUploadError(null);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Each image must be under 5MB');
        setUploadingImages(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) {
        setUploadError(`Upload failed: ${error.message}`);
        setUploadingImages(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      newUrls.push(publicUrl);
    }

    setUploadedImages(prev => [...prev, ...newUrls]);
    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);

    const images = uploadedImages.length > 0
      ? uploadedImages
      : ['https://d64gsuwffb70l.cloudfront.net/6946db6198d16b00e323578d_1766251491901_702fd7fe.png'];

    const propertyData: Partial<Property> = {
      ...formData,
      price: Number(formData.price),
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
      size: formData.size ? Number(formData.size) : undefined,
      images
    };

    const tier = getListingTier(formData.category, formData.transactionType);

    if (tier) {
      setPendingProperty(propertyData);
      setPaymentTier(tier);
      setShowPayment(true);
      setIsSubmitting(false);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit(propertyData);
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    if (pendingProperty) {
      onSubmit(pendingProperty);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (showPayment && paymentTier) {
    return (
      <PaymentModal
        tier={paymentTier}
        userId={userId}
        userEmail={userEmail}
        onClose={() => {
          setShowPayment(false);
          setPendingProperty(null);
        }}
        onSuccess={handlePaymentSuccess}
      />
    );
  }

  const listingFee = getListingTier(formData.category, formData.transactionType);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{editProperty ? 'Edit Property' : 'List Your Property'}</h2>
              <p className="text-cyan-100 mt-1">Step {step} of 3</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Details</h3>

              {/* Listing Fee Notice */}
              <div className={`p-3 rounded-lg text-sm ${listingFee ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-green-50 border border-green-200 text-green-800'}`}>
                {listingFee
                  ? `📋 Listing fee: $${listingFee.price} (one-time) — payable after filling in details`
                  : '✅ This listing is FREE — Residential properties for rent have no listing fee'}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: 'residential', type: 'house' }))}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${formData.category === 'residential' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 hover:border-gray-300'}`}>
                    Residential
                  </button>
                  <button type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: 'commercial', type: 'office' }))}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${formData.category === 'commercial' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 hover:border-gray-300'}`}>
                    Commercial
                  </button>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as PropertyType }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  {PROPERTY_TYPES_BY_CATEGORY[formData.category].map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button"
                    onClick={() => setFormData(prev => ({ ...prev, transactionType: 'rent' }))}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${formData.transactionType === 'rent' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 hover:border-gray-300'}`}>
                    For Rent
                  </button>
                  <button type="button"
                    onClick={() => setFormData(prev => ({ ...prev, transactionType: 'sale' }))}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${formData.transactionType === 'sale' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300'}`}>
                    For Sale
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                <input type="text" value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Modern 3 Bedroom House in Borrowdale"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.title ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD) {formData.transactionType === 'rent' && 'per month'}
                </label>
                <input type="number" value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Enter price"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.price ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    {CITIES.filter(c => c !== 'All Cities').map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area/Suburb</label>
                  <input type="text" value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Borrowdale"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.location ? 'border-red-500' : 'border-gray-200'}`} />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Features & Photos</h3>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Photos ({uploadedImages.length}/5)
                </label>

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden h-24">
                        <img src={url} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                          <Trash2 className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {uploadedImages.length < 5 && (
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploadingImages ? 'border-cyan-300 bg-cyan-50' : 'border-gray-300 hover:border-cyan-400 hover:bg-cyan-50'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingImages ? (
                        <>
                          <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mb-2" />
                          <p className="text-sm text-cyan-600">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600"><span className="font-medium text-cyan-600">Click to upload</span> photos</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each (max 5 photos)</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*"
                      onChange={handleImageUpload} disabled={uploadingImages} />
                  </label>
                )}

                {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
                {uploadedImages.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">If no photos uploaded, a placeholder image will be used</p>
                )}
              </div>

              {/* Size and Rooms */}
              <div className="grid grid-cols-3 gap-4">
                {(formData.category === 'residential' && formData.type !== 'stand') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                      <input type="number" value={formData.bedrooms}
                        onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                      <input type="number" value={formData.bathrooms}
                        onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                  </>
                )}
                <div className={formData.category === 'commercial' || formData.type === 'stand' ? 'col-span-3' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size (sqm)</label>
                  <input type="number" value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your property in detail..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.description ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_OPTIONS.map((amenity) => (
                    <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${formData.amenities.includes(amenity) ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {formData.amenities.includes(amenity) && <Check className="w-3 h-3 inline mr-1" />}
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              <p className="text-sm text-gray-500 mb-4">
                This information will be shown to subscribed property seekers.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" value={formData.ownerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerPhone: e.target.value }))}
                  placeholder="+263 7X XXX XXXX"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.ownerPhone ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.ownerPhone && <p className="text-red-500 text-sm mt-1">{errors.ownerPhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={formData.ownerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerEmail: e.target.value }))}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.ownerEmail ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.ownerEmail && <p className="text-red-500 text-sm mt-1">{errors.ownerEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (Optional)</label>
                <input type="tel" value={formData.ownerWhatsApp}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerWhatsApp: e.target.value }))}
                  placeholder="+263 7X XXX XXXX"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">Listing Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Type:</strong> {formData.category} - {formData.type}</p>
                  <p><strong>Price:</strong> ${formData.price}{formData.transactionType === 'rent' ? '/month' : ''}</p>
                  <p><strong>Location:</strong> {formData.location}, {formData.city}</p>
                  <p><strong>Photos:</strong> {uploadedImages.length} uploaded</p>
                </div>
              </div>

              {listingFee && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-semibold text-amber-800">💳 Listing Fee Required</p>
                  <p className="text-sm text-amber-700 mt-1">
                    A one-time fee of <strong>${listingFee.price}</strong> is required to publish this listing.
                    You will be redirected to payment after clicking Publish.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Back
            </button>
          ) : (
            <button onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all">
              Continue
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting || uploadingImages}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50">
              {isSubmitting ? 'Processing...' : listingFee ? `Publish & Pay $${listingFee.price}` : 'Publish Listing (Free)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPropertyModal;
