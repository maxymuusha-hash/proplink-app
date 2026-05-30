import React from 'react';
import { Building2, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  onShowDisclaimer: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowDisclaimer }) => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Prop<span className="text-cyan-400">Link</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Zimbabwe's trusted property marketplace connecting landlords, sellers, tenants, and buyers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Houses for Rent</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Houses for Sale</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Apartments</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Rooms</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Stands</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Commercial Properties</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">FAQs</a></li>
              <li>
                <button
                  onClick={onShowDisclaimer}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Terms & Disclaimer
                </button>
              </li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span>+263 73 611 2106</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <a href="mailto:proplink@gmail.com" className="hover:text-cyan-400 transition-colors">
                  proplink@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} PropLink. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={onShowDisclaimer}
                className="text-gray-500 hover:text-cyan-400 transition-colors"
              >
                Disclaimer
              </button>
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
