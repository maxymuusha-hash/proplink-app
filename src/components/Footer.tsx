import React from 'react';
import { Building2, Mail, Phone, Facebook } from 'lucide-react';

interface FooterProps {
  onShowDisclaimer: () => void;
  onShowPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onShowDisclaimer, onShowPage }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                Prop<span className="text-cyan-400">Link</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Zimbabwe's trusted property marketplace connecting landlords, sellers, tenants, and buyers.
            </p>
            {/* Facebook only */}
            <div className="flex gap-3">
              
                href="https://www.facebook.com/primewavedigital"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                title="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              {[
                { label: 'Houses for Rent', page: 'residential-rent' },
                { label: 'Houses for Sale', page: 'residential-sale' },
                { label: 'Apartments', page: 'apartments' },
                { label: 'Rooms', page: 'rooms' },
                { label: 'Stands', page: 'stands' },
                { label: 'Commercial Properties', page: 'commercial' },
              ].map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => onShowPage(item.page)}
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'About Us', page: 'about' },
                { label: 'How It Works', page: 'how-it-works' },
                { label: 'Pricing', page: 'pricing' },
                { label: 'FAQs', page: 'faqs' },
                { label: 'Terms & Disclaimer', page: 'terms' },
                { label: 'Privacy Policy', page: 'privacy' },
              ].map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => item.page === 'terms' ? onShowDisclaimer() : onShowPage(item.page)}
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+263736112106" className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                  <Phone className="w-4 h-4" />
                  +263 73 611 2106
                </a>
              </li>
              <li>
                <a href="mailto:proplinkall@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                  <Mail className="w-4 h-4" />
                  proplinkall@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 PropLink. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={onShowDisclaimer} className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">
              Disclaimer
            </button>
            <button onClick={() => onShowPage('privacy')} className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">
              Privacy
            </button>
            <button onClick={() => onShowPage('terms')} className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
