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
  subscriptionType?: 'residential_rental' | 'commercial_rental' | 'seller_residential' | 'seller_commercial' | null;
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
  accessType: 'residential_rental' | 'commercial_rental' | 'seller_residential' | 'seller_commercial';
  userType: 'seeker' | 'owner';
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
    userType: 'seeker'
  },
  {
    id: 'commercial_rental',
    name: 'Commercial Rental',
    price: 10,
    currency: 'USD',
    description: 'Access contact details for commercial rental properties',
    features: [
      'View owner contact details',
      'Offices, shops & warehouses for rent',
      'Direct WhatsApp contact',
      '30 days access'
    ],
    accessType: 'commercial_rental',
    userType: 'seeker'
  },
  {
    id: 'seller_residential',
    name: 'Property Seller - Residential',
    price: 50,
    currency: 'USD',
    description: 'List your residential property and connect with seekers',
    features: [
      'List residential properties',
      'Houses, apartments & rooms',
      'Visible to all seekers',
      '30 days listing'
    ],
    accessType: 'seller_residential',
    userType: 'owner'
  },
  {
    id: 'seller_commercial',
    name: 'Property Seller - Commercial',
    price: 200,
    currency: 'USD',
    description: 'List your commercial property and connect with seekers',
    features: [
      'List commercial properties',
      'Offices, shops & warehouses',
      'Visible to all seekers',
      '30 days listing'
    ],
    accessType: 'seller_commercial',
    userType: 'owner'
  }
];

export const SEEKER_TIERS = SUBSCRIPTION_TIERS.filter(t => t.userType === 'seeker');
export const OWNER_TIERS = SUBSCRIPTION_TIERS.filter(t => t.userType === 'owner');
