export type PropertyCategory = 'residential' | 'commercial';
export type PropertyType = 'house' | 'apartment' | 'room' | 'stand' | 'office' | 'shop' | 'warehouse' | 'industrial';
export type TransactionType = 'rent' | 'sale';
export type PropertyStatus = 'available' | 'leased' | 'sold';

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  type: PropertyType;
  transactionType: TransactionType;
  price: number;
  currency: string;
  location: string;
  city: string;
  description: string;
  amenities: string[];
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  sizeUnit?: string;
  status: PropertyStatus;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerWhatsApp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'owner' | 'seeker' | 'admin';
  subscriptionType?: 'residential_rental' | 'residential_sale' | 'commercial_rent' | 'commercial_sale' | null;
  subscriptionExpiry?: string | null;
  createdAt: string;
  verified: boolean;
  disclaimerAccepted: boolean;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  accessType: 'residential_rental' | 'residential_sale' | 'commercial_rent' | 'commercial_sale';
  userType: 'seeker' | 'owner';
  billingType: 'monthly' | 'one-time';
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'residential_rental',
    name: 'Residential Rental',
    price: 2,
    currency: 'USD',
    description: 'Access contact details for residential rental properties',
    features: [
      'View owner contact details',
      'Houses, apartments & rooms for rent',
      'Direct WhatsApp contact',
      '30 days access'
    ],
    accessType: 'residential_rental',
    userType: 'seeker',
    billingType: 'monthly'
  },
  {
    id: 'commercial_rent',
    name: 'Commercial Rental Listing',
    price: 10,
    currency: 'USD',
    description: 'List your commercial property for rent',
    features: [
      'List one commercial property for rent',
      'Offices, shops & warehouses',
      'Visible to all seekers',
      'One-time fee per listing'
    ],
    accessType: 'commercial_rent',
    userType: 'owner',
    billingType: 'one-time'
  },
  {
    id: 'residential_sale',
    name: 'Residential Sale Listing',
    price: 200,
    currency: 'USD',
    description: 'List your residential property for sale',
    features: [
      'List one residential property for sale',
      'Houses, apartments & stands',
      'Visible to all seekers',
      'One-time fee per listing'
    ],
    accessType: 'residential_sale',
    userType: 'owner',
    billingType: 'one-time'
  },
  {
    id: 'commercial_sale',
    name: 'Commercial Sale Listing',
    price: 1000,
    currency: 'USD',
    description: 'List your commercial property for sale',
    features: [
      'List one commercial property for sale',
      'Offices, shops & warehouses',
      'Visible to all seekers',
      'One-time fee per listing'
    ],
    accessType: 'commercial_sale',
    userType: 'owner',
    billingType: 'one-time'
  }
];

export const SEEKER_TIERS = SUBSCRIPTION_TIERS.filter(t => t.userType === 'seeker');
export const OWNER_TIERS = SUBSCRIPTION_TIERS.filter(t => t.userType === 'owner');

// Returns the correct listing tier based on property details, or null if free
export const getListingTier = (category: PropertyCategory, transactionType: TransactionType): SubscriptionTier | null => {
  if (category === 'residential' && transactionType === 'rent') return null; // FREE
  if (category === 'residential' && transactionType === 'sale') return SUBSCRIPTION_TIERS.find(t => t.id === 'residential_sale') || null;
  if (category === 'commercial' && transactionType === 'rent') return SUBSCRIPTION_TIERS.find(t => t.id === 'commercial_rent') || null;
  if (category === 'commercial' && transactionType === 'sale') return SUBSCRIPTION_TIERS.find(t => t.id === 'commercial_sale') || null;
  return null;
};
