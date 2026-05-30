import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
  page: string;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ page, onClose }) => {
  const getContent = () => {
    switch (page) {
      case 'about':
        return {
          title: 'About Us', 
          content: (
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>PropLink is Zimbabwe's trusted property marketplace — built to connect landlords, sellers, tenants, and buyers directly, without the need for middlemen or expensive agents.</p>
              <p>We believe finding or listing a property in Zimbabwe should be simple, affordable, and transparent. That's why we built a platform where property owners can list for free, and seekers can browse and contact owners directly for as little as $2/month.</p>
              <h3 className="text-lg font-semibold text-gray-800 mt-6">Our Mission</h3>
              <p>To make property transactions in Zimbabwe more accessible, affordable, and efficient for everyone — from first-time renters to seasoned property investors.</p>
              <h3 className="text-lg font-semibold text-gray-800 mt-6">What We Offer</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Residential properties — houses, apartments, rooms, and stands</li>
                <li>Commercial properties — offices, shops, and warehouses</li>
                <li>Direct owner-to-seeker connections across Zimbabwe</li>
                <li>EcoCash, OneMoney, and InnBucks payment support</li>
                <li>Properties across Harare, Bulawayo, Victoria Falls, and more</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 mt-6">Contact Us</h3>
              <p>Email: <a href="mailto:proplinkall@gmail.com" className="text-cyan-600 hover:underline">proplinkall@gmail.com</a></p>
              <p>Phone: <a href="tel:+263736112106" className="text-cyan-600 hover:underline">+263 73 611 2106</a></p>
            </div>
          )
        };
      case 'how-it-works':
        return {
          title: 'How It Works',
          content: (
            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">For Property Seekers</h3>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Browse properties', desc: 'Search through hundreds of residential and commercial properties across Zimbabwe.' },
                    { step: '2', title: 'Choose a plan', desc: 'Residential access from $2/month. Commercial rental contacts are completely free.' },
                    { step: '3', title: 'Pay securely', desc: 'Pay via EcoCash, OneMoney, or InnBucks. Subscription activates instantly.' },
                    { step: '4', title: 'Contact owners directly', desc: 'View phone, email, and WhatsApp. No agents, no commission.' },
                  ].map(item => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-cyan-600 font-bold text-sm">{item.step}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">For Property Owners</h3>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Create a free account', desc: 'Sign up as a Property Owner in less than 2 minutes.' },
                    { step: '2', title: 'List your property', desc: 'Fill in details, upload photos, and set your price. Listing is completely free.' },
                    { step: '3', title: 'Get contacted directly', desc: 'Serious seekers contact you directly. No middlemen involved.' },
                    { step: '4', title: 'Manage your listings', desc: 'Update, edit, or remove listings anytime from your dashboard.' },
                  ].map(item => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-cyan-600 font-bold text-sm">{item.step}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        };
      case 'pricing':
        return {
          title: 'Pricing',
          content: (
            <div className="space-y-6 text-gray-600">
              <p>PropLink is designed to be affordable for everyone in Zimbabwe.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Residential Rental</h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-cyan-600">$2</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>✅ Houses, Apartments, Rooms</li>
                    <li>✅ View owner contact details</li>
                    <li>✅ 30 days access</li>
                    <li>✅ Pay via EcoCash/OneMoney</li>
                  </ul>
                </div>
                <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Commercial Rental</h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-emerald-600">FREE</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>✅ Offices, Shops, Warehouses</li>
                    <li>✅ View owner contact details</li>
                    <li>✅ No subscription needed</li>
                    <li>✅ Always free</li>
                  </ul>
                </div>
              </div>
              <div className="border border-blue-200 bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Property Owners</h3>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-blue-600">FREE</span>
                  <span className="text-gray-500"> — always</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✅ List unlimited properties</li>
                  <li>✅ Upload photos</li>
                  <li>✅ Manage listings from dashboard</li>
                  <li>✅ Get contacted directly by seekers</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500">All payments processed securely via Paynow Zimbabwe. Subscriptions valid for 30 days.</p>
            </div>
          )
        };
      case 'faqs':
        return {
          title: 'Frequently Asked Questions',
          content: (
            <div className="space-y-4 text-gray-600">
              {[
                { q: 'Is listing a property free?', a: 'Yes, listing your property on PropLink is completely free. There are no hidden charges for property owners.' },
                { q: 'How do I contact a property owner?', a: 'Subscribe to a plan, then open any property listing to view the owner\'s phone number, email, and WhatsApp contact.' },
                { q: 'What payment methods are accepted?', a: 'We accept EcoCash, OneMoney, and InnBucks. All payments are processed securely via Paynow Zimbabwe.' },
                { q: 'How long does a subscription last?', a: 'All subscriptions are valid for 30 days from the date of activation.' },
                { q: 'Are commercial rental contacts really free?', a: 'Yes! You can view contact details for all commercial rental properties without any subscription.' },
                { q: 'Can I list properties in any city?', a: 'Yes, you can list properties in any city across Zimbabwe including Harare, Bulawayo, Victoria Falls, Mutare, Gweru, and Masvingo.' },
                { q: 'How do I update or remove my listing?', a: 'Log in as a Property Owner and go to your dashboard. You can edit, update the status, or delete your listings at any time.' },
                { q: 'Is my payment information secure?', a: 'Yes. All payments are handled by Paynow Zimbabwe — we never store your payment details on our servers.' },
                { q: 'What if my payment went through but account is not activated?', a: 'Contact us at proplinkall@gmail.com or call +263 73 611 2106 with your payment reference and we will resolve it promptly.' },
              ].map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-2">{item.q}</p>
                  <p className="text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          )
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: (
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p className="text-sm text-gray-500">Last updated: May 2026</p>
              <p>PropLink is committed to protecting your privacy. This policy explains how we collect, use, and protect your information.</p>
              <h3 className="text-lg font-semibold text-gray-800">Information We Collect</h3>
              <ul className="space-y-2 list-disc list-inside text-sm">
                <li>Name and email address when you create an account</li>
                <li>Property details when you list a property</li>
                <li>Payment references (we do not store card or mobile money details)</li>
                <li>Usage data such as pages visited and searches made</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800">How We Use Your Information</h3>
              <ul className="space-y-2 list-disc list-inside text-sm">
                <li>To provide and improve our services</li>
                <li>To process your subscription payments</li>
                <li>To send you important notifications about your account</li>
                <li>To display your property listings to potential seekers</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800">Data Security</h3>
              <p className="text-sm">We use Supabase for secure data storage and Paynow Zimbabwe for payment processing. We do not sell or share your personal data with third parties.</p>
              <h3 className="text-lg font-semibold text-gray-800">Contact</h3>
              <p className="text-sm">For privacy concerns, contact us at <a href="mailto:proplinkall@gmail.com" className="text-cyan-600 hover:underline">proplinkall@gmail.com</a></p>
            </div>
          )
        };
      default:
        return { title: '', content: null };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {content}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
