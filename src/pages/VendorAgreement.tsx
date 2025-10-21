import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function VendorAgreement() {
  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-16 h-16 text-brand-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Vendor Agreement
          </h1>
          <p className="text-xl text-gray-300">
            BlkXchange™ Marketplace Terms & Conditions
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-brand-gold">
          <CardHeader className="bg-brand-gold">
            <CardTitle className="text-2xl text-brand-black">
              BlkXchange™ Vendor Agreement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6 text-gray-700">
            <p className="text-sm text-gray-600 italic">
              Last Updated: January 2025
            </p>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">1. Introduction</h2>
              <p>
                Welcome to BlkXchange™ ("Platform," "we," "us," or "our"). This Vendor Agreement 
                ("Agreement") governs your use of the BlkXchange™ marketplace as a vendor. By 
                submitting a vendor application and selling products on our platform, you agree to 
                be bound by these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">2. Commission Rate</h2>
              <p className="mb-2">
                BlkXchange™ operates on a revenue-sharing model with the following breakdown:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Vendor Share:</strong> 85% of each sale goes directly to you</li>
                <li><strong>Platform Operations:</strong> 12% covers platform maintenance, payment processing, and support</li>
                <li><strong>Community Impact Fund:</strong> 3% supports HBCUs, scholarships, and nonprofit partners</li>
              </ul>
              <p className="mt-3">
                <strong>Total Platform Fee: 15%</strong> (deducted automatically from each transaction)
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">3. Payout Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payouts are processed on a <strong>Net-14 basis</strong> (14 days after order completion)</li>
                <li>Minimum payout threshold: $25.00</li>
                <li>Payments are sent via direct deposit or Stripe Connect</li>
                <li>You are responsible for providing accurate banking information</li>
                <li>Refunds and chargebacks will be deducted from future payouts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">4. Vendor Responsibilities</h2>
              <p className="mb-2">As a vendor on BlkXchange™, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate product descriptions, pricing, and images</li>
                <li>Fulfill orders promptly (within 3-5 business days unless otherwise stated)</li>
                <li>Maintain adequate inventory or mark items as out of stock</li>
                <li>Provide tracking information for shipped orders</li>
                <li>Respond to customer inquiries within 48 hours</li>
                <li>Honor your stated return and refund policies</li>
                <li>Comply with all applicable laws, including tax obligations</li>
                <li>Maintain professional communication with customers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">5. Prohibited Items</h2>
              <p className="mb-2">
                The following items are <strong>strictly prohibited</strong> from being sold on BlkXchange™:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Counterfeit, replica, or unauthorized branded goods</li>
                <li>Stolen or illegally obtained items</li>
                <li>Weapons, explosives, or hazardous materials</li>
                <li>Illegal drugs, drug paraphernalia, or prescription medications</li>
                <li>Adult content or sexually explicit materials</li>
                <li>Items that promote hate, violence, or discrimination</li>
                <li>Live animals or animal parts from endangered species</li>
                <li>Items that violate intellectual property rights</li>
              </ul>
              <p className="mt-3">
                Violation of this policy may result in immediate account suspension and removal of listings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">6. Intellectual Property & Marketing</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You retain ownership of your product images, descriptions, and brand materials</li>
                <li>You grant BlkXchange™ a non-exclusive license to display your products and brand on our platform</li>
                <li>We may feature your products in marketing materials, social media, and promotional campaigns</li>
                <li>You may not use the BlkXchange™ logo or branding without written permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">7. Product Approval Process</h2>
              <p className="mb-2">
                All products submitted to BlkXchange™ are subject to admin review and approval:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Products must meet our quality and authenticity standards</li>
                <li>We reserve the right to reject any product listing without explanation</li>
                <li>Approved products will appear in the marketplace within 24-48 hours</li>
                <li>Rejected products may be resubmitted after addressing feedback</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">8. Termination & Dispute Policy</h2>
              <p className="mb-2">
                BlkXchange™ reserves the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Suspend or terminate vendor accounts for violations of this Agreement</li>
                <li>Remove listings that violate our policies or receive customer complaints</li>
                <li>Withhold payouts pending investigation of fraudulent activity</li>
                <li>Mediate disputes between vendors and customers</li>
              </ul>
              <p className="mt-3">
                Vendors may appeal account suspensions by contacting support@blkxchange.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">9. Tax Acknowledgment</h2>
              <p>
                You acknowledge that you are responsible for all applicable taxes related to your sales, 
                including but not limited to sales tax, income tax, and self-employment tax. BlkXchange™ 
                will provide annual sales reports (Form 1099-K if applicable) but does not provide tax advice. 
                Please consult a tax professional for guidance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">10. Limitation of Liability</h2>
              <p>
                BlkXchange™ is a marketplace platform and is not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Product quality, safety, or legality</li>
                <li>Shipping delays or lost packages</li>
                <li>Customer disputes or chargebacks</li>
                <li>Third-party payment processor fees or issues</li>
              </ul>
              <p className="mt-3">
                Vendors assume all liability for their products and transactions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">11. Changes to Agreement</h2>
              <p>
                BlkXchange™ reserves the right to modify this Agreement at any time. Vendors will be 
                notified of material changes via email. Continued use of the platform after changes 
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-black mb-3">12. Contact Information</h2>
              <p>
                For questions about this Agreement or vendor support, please contact:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> support@blkxchange.com<br />
                <strong>Website:</strong> www.blkxchange.com
              </p>
            </section>

            <div className="pt-6 border-t border-gray-300">
              <p className="text-center text-sm text-gray-600">
                BlkXchange™ Marketplace Agreement © 2025. All Rights Reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
