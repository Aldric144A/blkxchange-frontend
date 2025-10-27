import { useState } from 'react';
import { X, Check, FileText } from 'lucide-react';

interface MembershipAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const MembershipAgreementModal = ({ isOpen, onClose, onAccept }: MembershipAgreementModalProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrolledToBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (scrolledToBottom) {
      setHasScrolled(true);
    }
  };

  const handleAccept = () => {
    if (agreed && hasScrolled) {
      localStorage.setItem('blkxchange360_agreement_accepted', 'true');
      localStorage.setItem('blkxchange360_agreement_date', new Date().toISOString());
      onAccept();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl max-w-4xl w-full border-2 border-emerald-700 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 px-6 py-4 flex items-center justify-between border-b border-emerald-700">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
              BlkXchange 360™ Membership Agreement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          onScroll={handleScroll}
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 text-sm mb-6">
              <strong>Effective Date:</strong> January 1, 2025
            </p>

            <section className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">1. Introduction</h3>
              <p className="text-gray-300">
                Welcome to BlkXchange 360™ ("Platform," "we," "us," or "our"). By accessing or using BlkXchange 360™, you agree to be bound by this Membership Agreement ("Agreement"). This Agreement governs your use of all BlkXchange 360™ features, including the Community Hub, Wallet, Governance, Fund, and History Window.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">2. Membership Tiers</h3>
              <p className="text-gray-300 mb-3">
                BlkXchange 360™ offers multiple membership tiers:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Free Tier:</strong> Access to basic community features, marketplace browsing, and limited wallet functionality.</li>
                <li><strong>Premium Tier ($9.99/month):</strong> Full access to Community Hub, Wallet with enhanced earning rates, voting rights in DAO governance, and priority support.</li>
                <li><strong>Elite Tier ($29.99/month):</strong> All Premium benefits plus exclusive events, private groups, advanced analytics, and direct access to leadership.</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">3. Community Guidelines</h3>
              <p className="text-gray-300 mb-3">
                All members must adhere to our community standards:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Treat all members with respect and dignity</li>
                <li>No hate speech, discrimination, or harassment of any kind</li>
                <li>No spam, scams, or fraudulent activities</li>
                <li>Respect intellectual property rights</li>
                <li>Maintain confidentiality of private group discussions</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">4. BlkPoints Wallet Terms</h3>
              <p className="text-gray-300 mb-3">
                The BlkPoints system operates under the following terms:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>BlkPoints have no cash value and cannot be transferred between users</li>
                <li>Points may be earned through purchases, referrals, community engagement, and events</li>
                <li>Points may be redeemed for discounts on marketplace purchases</li>
                <li>We reserve the right to adjust point values and earning rates with 30 days notice</li>
                <li>Points expire after 12 months of account inactivity</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">5. DAO Governance</h3>
              <p className="text-gray-300 mb-3">
                Premium and Elite members may participate in BlkDAO governance:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Voting rights are granted based on membership tier and account standing</li>
                <li>Proposals must meet minimum support thresholds to be considered</li>
                <li>Final decisions rest with BlkXchange™ leadership for legal and operational matters</li>
                <li>Voting history is recorded and may be made public</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">6. Community Fund</h3>
              <p className="text-gray-300 mb-3">
                The Community Fund operates with full transparency:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>85% of funds support vendor growth and development</li>
                <li>12% covers platform operations and improvements</li>
                <li>3% supports HBCUs and scholarship programs</li>
                <li>Quarterly reports detail fund allocation and impact</li>
                <li>Donations are tax-deductible where applicable (consult your tax advisor)</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">7. Data Privacy</h3>
              <p className="text-gray-300">
                We are committed to protecting your privacy. Your personal information will be used solely for platform operations, community engagement, and service improvements. We will never sell your data to third parties. For full details, please review our Privacy Policy.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">8. Termination</h3>
              <p className="text-gray-300">
                We reserve the right to suspend or terminate accounts that violate this Agreement or community guidelines. Members may cancel their subscription at any time. Unused BlkPoints will be forfeited upon account closure.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">9. Modifications</h3>
              <p className="text-gray-300">
                We may update this Agreement from time to time. Material changes will be communicated via email and platform notifications. Continued use of the platform after changes constitutes acceptance of the updated Agreement.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">10. Contact</h3>
              <p className="text-gray-300">
                For questions about this Agreement, please contact us at:
                <br />
                <strong>Email:</strong> support@blkxchange.com
                <br />
                <strong>Address:</strong> BlkXchange™ Headquarters, Atlanta, GA
              </p>
            </section>

            <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-4 mt-8">
              <p className="text-emerald-400 text-sm">
                <strong>Note:</strong> By accepting this agreement, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions outlined above.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 px-8 py-4 border-t border-gray-800">
          {!hasScrolled && (
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 mb-4">
              <p className="text-yellow-400 text-sm text-center">
                Please scroll to the bottom to review the entire agreement
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="agree-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={!hasScrolled}
              className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-gray-900 disabled:opacity-50"
            />
            <label
              htmlFor="agree-checkbox"
              className={`text-sm ${hasScrolled ? 'text-white' : 'text-gray-500'}`}
            >
              I have read and agree to the BlkXchange 360™ Membership Agreement
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!agreed || !hasScrolled}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                agreed && hasScrolled
                  ? 'bg-gradient-to-r from-emerald-600 to-yellow-600 text-white hover:shadow-lg'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-5 h-5" />
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipAgreementModal;
