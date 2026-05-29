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
  subscriptionType?: 'residential_rental' | 'commercial_rental' | 'buyer' | null;
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
  accessType: 'residential_rental' | 'commercial_rental' | 'buyer';
}
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'residential_rental',
    name: 'Residential Rental',
    price: 3,
    currency: 'USD',
    description: 'Access contact details for residential rental properties',
    features: [
      'View owner contact details',
      'Houses, apartments & rooms for rent',
      'Direct WhatsApp contact',
      '30 days access'
    ],
    accessType: 'residential_rental'
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
    accessType: 'commercial_rental'
  },
  {
    id: 'buyer',
    name: 'Property Buyer',
    price: 30,
    currency: 'USD',
    description: 'Access contact details for all properties for sale',
    features: [
      'View owner contact details',
      'All residential & commercial for sale',
      'Direct WhatsApp contact',
      '30 days access',
      'Priority support'
    ],
    accessType: 'buyer'
  }
];
