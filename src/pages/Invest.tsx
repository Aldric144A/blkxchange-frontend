import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, Building2, GraduationCap, Users, 
  Landmark, PieChart, CheckCircle, ExternalLink 
} from 'lucide-react';
import { api } from '../api';
import { 
  StartupApplicationCreate, AngelInvestorCreate, 
  DonationCreate, BlackBank, InvestImpactStats 
} from '../types';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { StartupInvestorTerms } from '../components/StartupInvestorTerms';
import { AngelInvestorTerms } from '../components/AngelInvestorTerms';
import { SpotlightAd } from '../components/ads';

export default function Invest() {
  const [activeTab, setActiveTab] = useState('startups');
  const [blackBanks, setBlackBanks] = useState<BlackBank[]>([]);
  const [impactStats, setImpactStats] = useState<InvestImpactStats | null>(null);

  useEffect(() => {
    loadBlackBanks();
    loadImpactStats();
  }, []);

  const loadBlackBanks = async () => {
    try {
      const banks = await api.getBlackBanks();
      setBlackBanks(banks);
    } catch (error) {
      console.error('Failed to load black banks:', error);
    }
  };

  const loadImpactStats = async () => {
    try {
      const stats = await api.getInvestImpactStats();
      setImpactStats(stats);
    } catch (error) {
      console.error('Failed to load impact stats:', error);
    }
  };

  const scrollToSection = (tabName: string) => {
    setActiveTab(tabName);
    setTimeout(() => {
      document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      <SpotlightAd page="invest" />
      <section className="bg-gradient-to-b from-[#000000] to-[#023020] py-20 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <TrendingUp className="w-20 h-20 text-[#C5A14E] mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-[#C5A14E] mb-6 uppercase">
            Invest in the Future. Empower the Present.
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
            BlkXchange™ reinvests 3% of all subscriptions and sales into education, innovation, and community wealth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollToSection('angel')}
              className="bg-[#C5A14E] text-black hover:bg-[#B39140] text-lg px-8 py-6"
            >
              Become an Investor
            </Button>
            <Button 
              onClick={() => scrollToSection('hbcu')}
              variant="outline"
              className="border-[#C5A14E] text-[#C5A14E] hover:bg-[#C5A14E] hover:text-black text-lg px-8 py-6"
            >
              Support HBCUs
            </Button>
          </div>
        </div>
      </section>

      <section id="tabs-section" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-[#1A1A1A] mb-8">
              <TabsTrigger value="startups" className="text-white data-[state=active]:bg-[#C5A14E] data-[state=active]:text-black">
                <Building2 className="w-4 h-4 mr-2" />
                Startups
              </TabsTrigger>
              <TabsTrigger value="hbcu" className="text-white data-[state=active]:bg-[#C5A14E] data-[state=active]:text-black">
                <GraduationCap className="w-4 h-4 mr-2" />
                HBCUs
              </TabsTrigger>
              <TabsTrigger value="angel" className="text-white data-[state=active]:bg-[#C5A14E] data-[state=active]:text-black">
                <Users className="w-4 h-4 mr-2" />
                Angel Investors
              </TabsTrigger>
              <TabsTrigger value="banks" className="text-white data-[state=active]:bg-[#C5A14E] data-[state=active]:text-black">
                <Landmark className="w-4 h-4 mr-2" />
                Black Banks
              </TabsTrigger>
              <TabsTrigger value="impact" className="text-white data-[state=active]:bg-[#C5A14E] data-[state=active]:text-black">
                <PieChart className="w-4 h-4 mr-2" />
                Impact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="startups">
              <StartupApplicationTab />
            </TabsContent>

            <TabsContent value="hbcu">
              <HBCUTab />
            </TabsContent>

            <TabsContent value="angel">
              <AngelInvestorTab />
            </TabsContent>

            <TabsContent value="banks">
              <BlackBanksTab banks={blackBanks} />
            </TabsContent>

            <TabsContent value="impact">
              <ImpactDashboardTab stats={impactStats} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function StartupApplicationTab() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<StartupApplicationCreate>({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    website: '',
    funding_goal: 0,
    business_summary: '',
    pitch_deck_url: '',
    agreement_accepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreement_accepted) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createStartupApplication(formData);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon."
      });
      setFormData({
        name: '',
        business_name: '',
        email: '',
        phone: '',
        website: '',
        funding_goal: 0,
        business_summary: '',
        pitch_deck_url: '',
        agreement_accepted: false
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-[#1A1A1A] border-[#C5A14E]">
      <CardHeader>
        <CardTitle className="text-3xl text-[#C5A14E]">Apply for Startup Funding</CardTitle>
        <CardDescription className="text-gray-300">
          Submit your funding application to connect with investors and grow your BIPOC-owned business.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-white">Full Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="business_name" className="text-white">Business Name *</Label>
              <Input
                id="business_name"
                required
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">Phone *</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="website" className="text-white">Website / Social Media</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="funding_goal" className="text-white">Funding Goal ($) *</Label>
              <Input
                id="funding_goal"
                type="number"
                required
                min="0"
                value={formData.funding_goal || ''}
                onChange={(e) => setFormData({ ...formData, funding_goal: parseFloat(e.target.value) || 0 })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="business_summary" className="text-white">Business Summary *</Label>
            <Textarea
              id="business_summary"
              required
              rows={5}
              value={formData.business_summary}
              onChange={(e) => setFormData({ ...formData, business_summary: e.target.value })}
              className="bg-[#111111] border-gray-600 text-white"
              placeholder="Describe your business, target market, and why you're seeking funding..."
            />
          </div>
          <div>
            <Label htmlFor="pitch_deck_url" className="text-white">Pitch Deck URL (optional)</Label>
            <Input
              id="pitch_deck_url"
              value={formData.pitch_deck_url}
              onChange={(e) => setFormData({ ...formData, pitch_deck_url: e.target.value })}
              className="bg-[#111111] border-gray-600 text-white"
              placeholder="Link to Google Drive, Dropbox, etc."
            />
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreement"
              checked={formData.agreement_accepted}
              onCheckedChange={(checked) => setFormData({ ...formData, agreement_accepted: checked as boolean })}
              className="border-[#C5A14E] data-[state=checked]:bg-[#C5A14E]"
            />
            <Label htmlFor="agreement" className="text-sm text-gray-300 leading-relaxed">
              I affirm this is a legitimate BIPOC-owned business seeking capital investment and agree to the BlkXchange™ Investor Terms.
              <StartupInvestorTerms />
            </Label>
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#C5A14E] text-black hover:bg-[#B39140] text-lg py-6"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function HBCUTab() {
  const { toast } = useToast();
  const [donationData, setDonationData] = useState<DonationCreate>({
    donor_name: '',
    email: '',
    amount: 0,
    institution: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hbcuPartners = [
    { name: 'Howard University', location: 'Washington, DC' },
    { name: 'Spelman College', location: 'Atlanta, GA' },
    { name: 'Morehouse College', location: 'Atlanta, GA' },
    { name: 'Hampton University', location: 'Hampton, VA' },
    { name: 'Tuskegee University', location: 'Tuskegee, AL' },
    { name: 'HBCU Scholarship Fund', location: 'Nationwide' }
  ];

  const handleDonate = async (institution: string) => {
    if (!donationData.donor_name || !donationData.email || !donationData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, email, and donation amount.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createDonation({ ...donationData, institution });
      toast({
        title: "Donation Recorded!",
        description: `Thank you for supporting ${institution}!`
      });
      setDonationData({
        donor_name: '',
        email: '',
        amount: 0,
        institution: ''
      });
    } catch (error) {
      toast({
        title: "Donation Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-[#1A1A1A] border-[#C5A14E]">
        <CardHeader>
          <CardTitle className="text-3xl text-[#C5A14E]">Support HBCUs & Scholarships</CardTitle>
          <CardDescription className="text-gray-300">
            Donate directly to partner HBCUs and scholarship funds. 3% of all BlkXchange™ sales automatically support these institutions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="donor_name" className="text-white">Your Name *</Label>
              <Input
                id="donor_name"
                value={donationData.donor_name}
                onChange={(e) => setDonationData({ ...donationData, donor_name: e.target.value })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="donor_email" className="text-white">Your Email *</Label>
              <Input
                id="donor_email"
                type="email"
                value={donationData.email}
                onChange={(e) => setDonationData({ ...donationData, email: e.target.value })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-white">Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={donationData.amount || ''}
                onChange={(e) => setDonationData({ ...donationData, amount: parseFloat(e.target.value) || 0 })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
          </div>

          <Alert className="bg-[#023020] border-[#C5A14E]">
            <AlertDescription className="text-gray-300">
              <strong className="text-[#C5A14E]">Note:</strong> This is a placeholder donation interface for MVP. In production, this will integrate with Stripe or Daffy.org for secure payment processing.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            {hbcuPartners.map((partner) => (
              <Card key={partner.name} className="bg-[#111111] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-[#C5A14E]">{partner.name}</CardTitle>
                  <CardDescription className="text-gray-400">{partner.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleDonate(partner.name)}
                    disabled={isSubmitting}
                    className="w-full bg-[#C5A14E] text-black hover:bg-[#B39140]"
                  >
                    Donate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AngelInvestorTab() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AngelInvestorCreate>({
    name: '',
    email: '',
    company: '',
    accreditation_type: '',
    investment_range: '',
    interests: [],
    agreement_accepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = [
    'Technology', 'Healthcare', 'Finance', 'Real Estate', 
    'Consumer Products', 'Education', 'Media', 'Food & Beverage'
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreement_accepted) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createAngelInvestor(formData);
      toast({
        title: "Registration Successful!",
        description: "Welcome to the BlkXchange™ Angel Investor Network."
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        accreditation_type: '',
        investment_range: '',
        interests: [],
        agreement_accepted: false
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-[#1A1A1A] border-[#C5A14E]">
      <CardHeader>
        <CardTitle className="text-3xl text-[#C5A14E]">Angel Investor Registration</CardTitle>
        <CardDescription className="text-gray-300">
          Join our network of accredited investors supporting BIPOC entrepreneurs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="investor_name" className="text-white">Full Name *</Label>
              <Input
                id="investor_name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="investor_email" className="text-white">Email *</Label>
              <Input
                id="investor_email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-white">Company (optional)</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-[#111111] border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="accreditation_type" className="text-white">Accreditation Type *</Label>
              <select
                id="accreditation_type"
                required
                value={formData.accreditation_type}
                onChange={(e) => setFormData({ ...formData, accreditation_type: e.target.value })}
                className="w-full bg-[#111111] border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="">Select...</option>
                <option value="income">Income-based ($200k+ annually)</option>
                <option value="net_worth">Net Worth ($1M+ excluding primary residence)</option>
                <option value="professional">Professional Certification (Series 7, 65, 82)</option>
                <option value="entity">Entity Accreditation</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="investment_range" className="text-white">Investment Range *</Label>
              <select
                id="investment_range"
                required
                value={formData.investment_range}
                onChange={(e) => setFormData({ ...formData, investment_range: e.target.value })}
                className="w-full bg-[#111111] border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="">Select...</option>
                <option value="$10k-$50k">$10,000 - $50,000</option>
                <option value="$50k-$100k">$50,000 - $100,000</option>
                <option value="$100k-$250k">$100,000 - $250,000</option>
                <option value="$250k+">$250,000+</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-white mb-3 block">Investment Interests *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                    className="border-[#C5A14E] data-[state=checked]:bg-[#C5A14E]"
                  />
                  <Label htmlFor={interest} className="text-sm text-gray-300">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="investor_agreement"
              checked={formData.agreement_accepted}
              onCheckedChange={(checked) => setFormData({ ...formData, agreement_accepted: checked as boolean })}
              className="border-[#C5A14E] data-[state=checked]:bg-[#C5A14E]"
            />
            <Label htmlFor="investor_agreement" className="text-sm text-gray-300 leading-relaxed">
              I am an accredited investor and agree to the BlkXchange™ Investor Terms.
              <AngelInvestorTerms />
            </Label>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#C5A14E] text-black hover:bg-[#B39140] text-lg py-6"
          >
            {isSubmitting ? 'Registering...' : 'Register as Angel Investor'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function BlackBanksTab({ banks }: { banks: BlackBank[] }) {
  return (
    <div className="space-y-6">
      <Card className="bg-[#1A1A1A] border-[#C5A14E]">
        <CardHeader>
          <CardTitle className="text-3xl text-[#C5A14E]">Black-Owned Banks & Credit Unions</CardTitle>
          <CardDescription className="text-gray-300">
            Support Black-owned financial institutions and build community wealth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {banks.map((bank) => (
              <Card key={bank.id} className="bg-[#111111] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-[#C5A14E] flex items-center gap-2">
                    <Landmark className="w-5 h-5" />
                    {bank.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">{bank.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{bank.description}</p>
                  <a 
                    href={bank.affiliate_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="w-full bg-[#C5A14E] text-black hover:bg-[#B39140]">
                      Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ImpactDashboardTab({ stats }: { stats: InvestImpactStats | null }) {
  if (!stats) {
    return (
      <Card className="bg-[#1A1A1A] border-[#C5A14E]">
        <CardContent className="py-12 text-center">
          <p className="text-gray-400">Loading impact statistics...</p>
        </CardContent>
      </Card>
    );
  }

  const hasData = stats.total_funds_reinvested > 0 || stats.hbcu_donations > 0 || stats.startup_investments > 0;
  
  const chartData = hasData ? [
    { name: 'HBCU Donations', value: stats.hbcu_donations, color: '#C5A14E' },
    { name: 'Startup Investments', value: stats.startup_investments, color: '#023020' },
    { name: 'Platform Operations', value: stats.total_funds_reinvested - stats.hbcu_donations, color: '#1A1A1A' }
  ] : [
    { name: 'HBCU Donations', value: 30, color: '#C5A14E' },
    { name: 'Startup Investments', value: 60, color: '#023020' },
    { name: 'Platform Operations', value: 10, color: '#1A1A1A' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-[#1A1A1A] border-[#C5A14E]">
        <CardHeader>
          <CardTitle className="text-3xl text-[#C5A14E]">Community Impact Dashboard</CardTitle>
          <CardDescription className="text-gray-300">
            Real-time metrics showing how BlkXchange™ reinvests in the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#111111] border-[#C5A14E]">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Total Funds Reinvested</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#C5A14E]">
                  ${stats.total_funds_reinvested.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-[#C5A14E]">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">HBCU Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#C5A14E]">
                  ${stats.hbcu_donations.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-[#C5A14E]">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Startup Funding Sought</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#C5A14E]">
                  ${stats.startup_investments.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-[#C5A14E]">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Angel Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#C5A14E]">
                  {stats.angel_investors_count}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-[#C5A14E]">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Businesses Supported</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#C5A14E]">
                  {stats.businesses_supported}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-[#C5A14E]">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">3% Impact Fund</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-[#C5A14E]" />
                  <p className="text-xl font-bold text-[#C5A14E]">Active</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#111111] border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-[#C5A14E]">Fund Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsPieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="40%"
                    labelLine={true}
                    label={({ percent, x, y }) => {
                      if (percent === 0) return null;
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill="#FFFFFF" 
                          textAnchor="middle" 
                          dominantBaseline="central"
                          style={{ fontSize: '18px', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #C5A14E', color: '#FFFFFF' }}
                    labelStyle={{ color: '#C5A14E' }}
                  />
                  <Legend 
                    wrapperStyle={{ color: '#C5A14E', fontSize: '16px', fontWeight: 'bold' }}
                    iconType="circle"
                    formatter={(value) => <span style={{ color: '#C5A14E' }}>{value}</span>}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
