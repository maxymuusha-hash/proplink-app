import React from 'react';
import { Building2, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  onShowDisclaimer: () => void;
  onShowPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onShowDisclaimer, onShowPage }) => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li><button onClick={() => onShowPage('residential-rent')} className="hover:text-cyan-400 transition-colors text-left">Houses for Rent</button></li>
              <li><button onClick={() => onShowPage('residential-sale')} className="hover:text-cyan-400 transition-colors text-left">Houses for Sale</button></li>
              <li><button onClick={() => onShowPage('apartments')} className="hover:text-cyan-400 transition-colors text-left">Apartments</button></li>
              <li><button onClick={() => onShowPage('rooms')} className="hover:text-cyan-400 transition-colors text-left">Rooms</button></li>
              <li><button onClick={() => onShowPage('stands')} className="hover:text-cyan-400 transition-colors text-left">Stands</button></li>
              <li><button onClick={() => onShowPage('commercial')} className="hover:text-cyan-400 transition-colors text-left">Commercial Properties</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => onShowPage('about')} className="hover:text-cyan-400 transition-colors text-left">About Us</button></li>
              <li><button onClick={() => onShowPage('how-it-works')} className="hover:text-cyan-400 transition-colors text-left">How It Works</button></li>
              <li><button onClick={() => onShowPage('pricing')} className="hover:text-cyan-400 transition-colors text-left">Pricing</button></li>
              <li><button onClick={() => onShowPage('faqs')} className="hover:text-cyan-400 transition-colors text-left">FAQs</button></li>
              <li>
                <button onClick={onShowDisclaimer} className="hover:text-cyan-400 transition-colors text-left">
                  Terms & Disclaimer
                </button>
              </li>
              <li><button onClick={() => onShowPage('privacy')} className="hover:text-cyan-400 transition-colors text-left">Privacy Policy</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span>+263 73 611 2106</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <a href="mailto:proplinkall@gmail.com" className="hover:text-cyan-400 transition-colors">
                  proplinkall@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} PropLink. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <button onClick={onShowDisclaimer} className="text-gray-500 hover:text-cyan-400 transition-colors">
                Disclaimer
              </button>
              <button onClick={() => onShowPage('privacy')} className="text-gray-500 hover:text-cyan-400 transition-colors">
                Privacy
              </button>
              <button onClick={() => onShowPage('about')} className="text-gray-500 hover:text-cyan-400 transition-colors">
                Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
