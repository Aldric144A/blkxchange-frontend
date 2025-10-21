import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function AngelInvestorTerms() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-[#C5A14E] hover:underline inline-flex items-center gap-1 ml-1">
          Read Full Terms <ExternalLink className="w-3 h-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#111111] border-[#C5A14E] text-white max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#C5A14E]">
            BlkXchange™ Angel Investor Terms
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Effective Date: October 2025 | Last Updated: October 2025
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-white">
          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">1. Purpose</h3>
            <p className="text-gray-300 leading-relaxed">
              BlkXchange™ ("the Platform") provides opportunities for accredited investors to discover and support emerging BIPOC-owned businesses through mentorship, funding, and strategic collaboration.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">2. Accreditation</h3>
            <p className="text-gray-300 leading-relaxed mb-2">
              By participating, you affirm that you meet the definition of an "Accredited Investor" as defined under Rule 501 of Regulation D, U.S. Securities and Exchange Commission (SEC). This includes, but is not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Individuals with income exceeding $200,000 (or $300,000 jointly with a spouse) over the past two years with the expectation of the same in the current year; or</li>
              <li>Individuals or entities with a net worth exceeding $1 million, excluding primary residence.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">3. No Broker or Advisory Role</h3>
            <p className="text-gray-300 leading-relaxed">
              BlkXchange™ does not act as a broker, dealer, investment advisor, or underwriter. The Platform provides exposure and connectivity only, without advising or guaranteeing investment outcomes.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">4. Risk Disclosure</h3>
            <p className="text-gray-300 leading-relaxed">
              All investments involve risk, including possible loss of principal. Investors are solely responsible for conducting due diligence before making investment decisions. BlkXchange™ bears no liability for business outcomes, representations, or returns.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">5. Data Use & Confidentiality</h3>
            <p className="text-gray-300 leading-relaxed">
              Investor information will be used solely for BlkXchange™ verification, network development, and matching with potential startup opportunities. Data will not be sold or shared externally without consent.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">6. Compliance</h3>
            <p className="text-gray-300 leading-relaxed">
              All users must comply with applicable securities laws, anti-money laundering (AML) regulations, and community standards. Violation may result in suspension or permanent removal from the network.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">7. Community Ethics</h3>
            <p className="text-gray-300 leading-relaxed">
              Investors agree to uphold BlkXchange™'s mission of equity, fairness, and empowerment for BIPOC entrepreneurs, and to avoid exploitative, discriminatory, or unethical conduct in any funding relationships established through the platform.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">8. Agreement</h3>
            <p className="text-gray-300 leading-relaxed">
              By checking the box, you certify that you are an accredited investor and agree to the BlkXchange™ Angel Investor Terms.
            </p>
          </section>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              © 2025 BlkXchange™. All rights reserved.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <DialogTrigger asChild>
            <Button className="bg-[#046C4E] hover:bg-[#035A3F] text-white">
              Close
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}
