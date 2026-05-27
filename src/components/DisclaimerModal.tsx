import React, { useState } from 'react';
import { AlertTriangle, Check, Shield } from 'lucide-react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Important Disclaimer</h2>
              <p className="text-gray-600">Please read carefully before continuing</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="prose prose-sm text-gray-600">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Terms of Use & Disclaimer</h3>
            
            <p className="mb-4">
              Welcome to PropLink. By using this platform, you acknowledge and agree to the following terms:
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Platform Role
              </h4>
              <p className="text-sm">
                PropLink operates solely as a <strong>listing and contact facilitation platform</strong>. 
                We connect property owners with potential tenants and buyers but do not participate in, 
                verify, or guarantee any transactions, agreements, or communications between parties.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-800 mb-2">Limitation of Liability</h4>
              <p className="text-sm text-red-700">
                PropLink, its owners, employees, and affiliates are <strong>NOT responsible</strong> for:
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                <li>• Any agreements made between property owners and seekers</li>
                <li>• Payments, deposits, or financial transactions between parties</li>
                <li>• Property conditions, misrepresentations, or inaccuracies in listings</li>
                <li>• Losses, damages, or disputes arising from property transactions</li>
                <li>• Fraud, scams, or deceptive practices by any user</li>
                <li>• Personal safety during property viewings or meetings</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">User Responsibilities</h4>
              <p className="text-sm text-blue-700">
                All users are responsible for:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Conducting their own due diligence before any transaction</li>
                <li>• Verifying property ownership and legitimacy</li>
                <li>• Ensuring personal safety during viewings and meetings</li>
                <li>• Seeking legal advice for contracts and agreements</li>
                <li>• Reporting suspicious listings or users to PropLink</li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-amber-800 mb-2">Transaction Warning</h4>
              <p className="text-sm text-amber-700">
                All transactions, viewings, and payments between property owners and property seekers 
                are conducted <strong>at your own risk</strong>. We strongly recommend:
              </p>
              <ul className="text-sm text-amber-700 mt-2 space-y-1">
                <li>• Never paying deposits without viewing the property</li>
                <li>• Verifying property documents with legal professionals</li>
                <li>• Meeting in safe, public locations when possible</li>
                <li>• Using secure payment methods with transaction records</li>
              </ul>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              By clicking "I Agree & Continue", you confirm that you have read, understood, and 
              agree to these terms. You acknowledge that PropLink is not liable for any outcomes 
              resulting from your use of this platform.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 mt-0.5"
            />
            <span className="text-sm text-gray-700">
              I have read and understood the disclaimer. I agree that PropLink is not responsible 
              for any transactions, disputes, or losses, and I will use this platform at my own risk.
            </span>
          </label>

          <button
            onClick={onAccept}
            disabled={!agreed}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5" />
            I Agree & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
