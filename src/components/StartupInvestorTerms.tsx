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

export function StartupInvestorTerms() {
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
            BlkXchange™ Startup Investor Terms
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Effective Date: October 2025 | Last Updated: October 2025
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-white">
          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">1. Purpose</h3>
            <p className="text-gray-300 leading-relaxed">
              BlkXchange™ ("the Platform") provides a digital community funding and visibility portal designed to support BIPOC-owned businesses seeking exposure, mentorship, and potential investment.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">2. No Guarantee of Funding</h3>
            <p className="text-gray-300 leading-relaxed">
              Submission of a startup application does not guarantee funding, partnership, or investment. All funding decisions are subject to internal review, eligibility criteria, and availability of investment resources.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">3. Eligibility</h3>
            <p className="text-gray-300 leading-relaxed mb-2">
              To participate, applicants must:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Be at least 18 years old.</li>
              <li>Represent a legitimate, registered business entity owned or co-owned by a person identifying as Black, Indigenous, or a Person of Color (BIPOC).</li>
              <li>Provide accurate and truthful information in all application fields.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">4. Use of Funds</h3>
            <p className="text-gray-300 leading-relaxed">
              Funds obtained through BlkXchange™-facilitated investments must be used for legitimate business development, expansion, or community-impact purposes. Misrepresentation or misuse of funds may result in disqualification and legal action.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">5. Data Use & Confidentiality</h3>
            <p className="text-gray-300 leading-relaxed">
              Information submitted may be reviewed by BlkXchange™ administrators, investors, or community partners for evaluation purposes. Confidential business details will not be shared publicly without consent.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">6. No Financial Advice</h3>
            <p className="text-gray-300 leading-relaxed">
              BlkXchange™ is not a registered broker-dealer, investment advisor, or crowdfunding intermediary. All information is for educational and community development purposes only. Applicants should seek independent financial and legal counsel before accepting any investment.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">7. Platform Rights</h3>
            <p className="text-gray-300 leading-relaxed">
              BlkXchange™ reserves the right to approve, deny, or remove any startup listing that violates these terms, misrepresents ownership, or engages in fraudulent activity.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#C5A14E] mb-3">8. Agreement</h3>
            <p className="text-gray-300 leading-relaxed">
              By checking the box, you affirm that your business is a legitimate BIPOC-owned entity, that all information provided is accurate, and that you agree to the BlkXchange™ Startup Investor Terms.
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
