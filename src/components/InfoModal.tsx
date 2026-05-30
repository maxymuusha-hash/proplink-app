import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
  page: string;
  onClose: () => void;
}

const modalContent: Record<string, { title: string; content: React.ReactNode }> = {
  about: {
    title: 'About Us',
    content: (
      <div className="space-y-4">
        <p>PropLink is Zimbabwe's trusted property marketplace, connecting landlords, sellers, tenants, and buyers across the country.</p>
        <p>Our mission is to simplify the property search and listing process by providing a transparent, affordable, and easy-to-use platform for all Zimbabweans.</p>
        <p>Whether you're looking for a house to rent in Harare, a commercial space in Bulawayo, or land to buy anywhere in Zimbabwe, PropLink brings you directly to the property owner — no middlemen, no hidden fees.</p>
        <h3 className="font-semibold text-gray-900 mt-4">Our Values</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Transparency in every listing</li>
          <li>Direct connection between owners and seekers</li>
          <li>Affordable access for all Zimbabweans</li>
          <li>Reliable and up-to-date property information</li>
        </ul>
        <p className="text-sm text-gray-500">Contact us: proplinkall@gmail.com | +263 73 611 2106</p>
      </div>
    ),
  },
  'how-it-works': {
    title: 'How It Works',
    content: (
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-cyan-600">1</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Browse Properties</h3>
            <p className="text-gray-600 mt-1">Search through residential and commercial properties across Zimbabwe. Filter by city, type, price, and more.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-cyan-600">2</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Subscribe</h3>
            <p className="text-gray-600 mt-1">Choose a plan that fits your needs. Residential Rental access costs $2/month. Commercial listings are free to view.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-cyan-600">3</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Connect Directly</h3>
            <p className="text-gray-600 mt-1">Get instant access to the owner's phone, email, and WhatsApp. No agents, no delays.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-cyan-600">4</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">List Your Property</h3>
            <p className="text-gray-600 mt-1">Property owners can create an account and list their property. Listings are reviewed and published quickly.</p>
          </div>
        </div>
      </div>
    ),
  },
  pricing: {
    title: 'Pricing',
    content: (
      <div className="space-y-6">
        <p className="text-gray-600">PropLink offers simple, affordable pricing for property seekers. Listing your property as an owner is free.</p>
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <h3 className="font-bold text-gray-900 text-lg">Residential Rental Access</h3>
          <div className="mt-2 mb-3">
            <span className="text-3xl font-bold text-blue-600">$2</span>
            <span className="text-gray-500">/month</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ Access to all residential rental listings</li>
            <li>✅ Houses, Apartments, Rooms, Stands</li>
            <li>✅ Direct owner contact details (phone, email, WhatsApp)</li>
            <li>✅ 30 days access</li>
          </ul>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-100">
          <h3 className="font-bold text-gray-900 text-lg">Commercial Rental Access</h3>
          <div className="mt-2 mb-3">
            <span className="text-3xl font-bold text-green-600">FREE</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ Access to all commercial rental listings</li>
            <li>✅ Offices, Shops, Warehouses</li>
            <li>✅ Direct owner contact details</li>
            <li>✅ No subscription required</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="font-bold text-gray-900 text-lg">Property Owner Listing</h3>
          <div className="mt-2 mb-3">
            <span className="text-3xl font-bold text-gray-700">FREE</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ List your property on PropLink</li>
            <li>✅ Add photos, description, and contact details</li>
            <li>✅ Manage your listings from your dashboard</li>
          </ul>
        </div>
      </div>
    ),
  },
  faqs: {
    title: 'Frequently Asked Questions',
    content: (
      <div className="space-y-5">
        {[
          { q: 'How do I list my property?', a: 'Create an account as a Property Owner, then click "List Property" in the header. Fill in your property details, add photos, and submit. Your listing will go live shortly.' },
          { q: 'How much does it cost to list a property?', a: 'Listing your property on PropLink is completely free for owners.' },
          { q: 'How do I contact a property owner?', a: 'Subscribe to the relevant plan, then open any property listing to see the owner\'s phone number, email, and WhatsApp contact.' },
          { q: 'Is my payment secure?', a: 'Yes. Payments are processed securely via Paynow Zimbabwe, a trusted local payment platform.' },
          { q: 'How long does my subscription last?', a: 'Residential rental subscriptions are valid for 30 days from the date of payment.' },
          { q: 'Can I view commercial properties for free?', a: 'Yes! Commercial rental listings are free to view — no subscription needed.' },
          { q: 'What cities are covered?', a: 'PropLink covers properties across all major Zimbabwean cities including Harare, Bulawayo, Mutare, Gweru, Masvingo, and more.' },
          { q: 'How do I cancel or change my subscription?', a: 'Contact us at proplinkall@gmail.com and we will assist you promptly.' },
        ].map((item, i) => (
          <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
            <h3 className="font-semibold text-gray-900">{item.q}</h3>
            <p className="text-gray-600 mt-1 text-sm">{item.a}</p>
          </div>
        ))}
      </div>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    content: (
      <div className="space-y-4 text-sm text-gray-600">
        <p className="text-xs text-gray-400">Last updated: January 2026</p>
        <p>PropLink ("we", "us", "our") is committed to protecting your personal information. This policy explains what data we collect and how we use it.</p>
        <h3 className="font-semibold text-gray-900">Information We Collect</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account information: name, email address</li>
          <li>Property listing details provided by owners</li>
          <li>Payment transaction records (processed via Paynow)</li>
          <li>Usage data for improving the platform</li>
        </ul>
        <h3 className="font-semibold text-gray-900">How We Use Your Information</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>To provide and improve our services</li>
          <li>To process subscription payments</li>
          <li>To communicate important updates</li>
          <li>To display property listings to seekers</li>
        </ul>
        <h3 className="font-semibold text-gray-900">Data Security</h3>
        <p>We use industry-standard security measures including Supabase authentication and encrypted connections to protect your data.</p>
        <h3 className="font-semibold text-gray-900">Contact</h3>
        <p>For privacy concerns, email us at proplinkall@gmail.com.</p>
      </div>
    ),
  },
};

const InfoModal: React.FC<InfoModalProps> = ({ page, onClose }) => {
  const modal = modalContent[page];
  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">{modal.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 text-gray-700 leading-relaxed">
          {modal.content}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
