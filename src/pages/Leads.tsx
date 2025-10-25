import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { api } from '../api';
import { useToast } from '../hooks/use-toast';

const professionalCategories = [
  { value: 'coaching_consulting', label: 'Coaching & Consulting' },
  { value: 'education_tutoring', label: 'Education & Tutoring' },
  { value: 'event_hospitality', label: 'Event & Hospitality' },
  { value: 'finance_insurance', label: 'Finance & Insurance' },
  { value: 'health_medical', label: 'Health & Medical' },
  { value: 'legal_advocacy', label: 'Legal & Advocacy' },
  { value: 'media_marketing', label: 'Media & Marketing' },
  { value: 'nonprofits_community', label: 'Nonprofits & Community' },
  { value: 'real_estate_wealth', label: 'Real Estate & Wealth' },
  { value: 'technology_innovation', label: 'Technology & Innovation' },
  { value: 'trades_home', label: 'Trades & Home Services' },
  { value: 'transportation_logistics', label: 'Transportation & Logistics' },
  { value: 'arts_culture', label: 'Arts & Culture' }
];

const budgetRanges = [
  { value: 'under_500', label: 'Under $500' },
  { value: '500_1000', label: '$500 - $1,000' },
  { value: '1000_2500', label: '$1,000 - $2,500' },
  { value: '2500_5000', label: '$2,500 - $5,000' },
  { value: '5000_10000', label: '$5,000 - $10,000' },
  { value: 'over_10000', label: 'Over $10,000' }
];

export function Leads() {
  const [submitted, setSubmitted] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const { toast } = useToast();

  const [leadForm, setLeadForm] = useState({
    title: '',
    description: '',
    category: '',
    budget_range: '',
    location: '',
    city: '',
    state: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    deadline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadForm.title || !leadForm.description || !leadForm.category || !leadForm.budget_range || 
        !leadForm.location || !leadForm.contact_name || !leadForm.contact_email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await api.post('/api/leads', leadForm);
      setMatchCount(response.data.match_count);
      setSubmitted(true);
      toast({
        title: 'Success',
        description: 'Your service request has been submitted!'
      });
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit service request',
        variant: 'destructive'
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-ivory">
        <div className="bg-gradient-to-r from-brand-black to-brand-charcoal text-brand-ivory py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Request Submitted Successfully!
            </h1>
            <p className="text-xl text-gray-300">
              We've matched you with {matchCount} qualified {matchCount === 1 ? 'professional' : 'professionals'}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-2 border-brand-gold">
            <CardContent className="p-8">
              <h2 className="text-2xl font-heading font-bold text-brand-black mb-4">
                What Happens Next?
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-black flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black mb-1">Professionals Notified</h3>
                    <p className="text-gray-600">
                      Matched professionals in your area have been notified about your service request.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-black flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black mb-1">Review Responses</h3>
                    <p className="text-gray-600">
                      Interested professionals will reach out to you directly via email or phone.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-black flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black mb-1">Choose Your Professional</h3>
                    <p className="text-gray-600">
                      Compare proposals, check reviews, and select the best professional for your needs.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/professionals" className="flex-1">
                  <Button className="w-full bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-semibold">
                    Browse All Professionals
                  </Button>
                </Link>
                <Link to="/community" className="flex-1">
                  <Button className="w-full bg-white text-brand-black border-2 border-brand-black hover:bg-gray-50 font-semibold">
                    Back to Community
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-gradient-to-r from-brand-black to-brand-charcoal text-brand-ivory py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/community" className="text-brand-gold hover:underline mb-4 inline-block">
            ← Back to Community Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Find the Perfect Professional
          </h1>
          <p className="text-xl text-gray-300">
            Tell us what you need, and we'll match you with qualified Black professionals in your area
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mb-8 border-2 border-brand-gold/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-semibold text-brand-black mb-1">Describe Your Need</h3>
                <p className="text-sm text-gray-600">Tell us what service you're looking for</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-semibold text-brand-black mb-1">Get Matched</h3>
                <p className="text-sm text-gray-600">We'll find qualified professionals nearby</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-semibold text-brand-black mb-1">Receive Proposals</h3>
                <p className="text-sm text-gray-600">Compare and choose the best fit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submit Your Service Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-brand-black mb-2">
                  Project Title *
                </label>
                <Input
                  placeholder="e.g., Need a business consultant for startup strategy"
                  value={leadForm.title}
                  onChange={(e) => setLeadForm({ ...leadForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-black mb-2">
                  Service Category *
                </label>
                <Select value={leadForm.category} onValueChange={(value) => setLeadForm({ ...leadForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionalCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-black mb-2">
                  Project Description *
                </label>
                <Textarea
                  placeholder="Describe your project, timeline, and any specific requirements..."
                  value={leadForm.description}
                  onChange={(e) => setLeadForm({ ...leadForm, description: e.target.value })}
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-black mb-2">
                  Budget Range *
                </label>
                <Select value={leadForm.budget_range} onValueChange={(value) => setLeadForm({ ...leadForm, budget_range: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    City
                  </label>
                  <Input
                    placeholder="City"
                    value={leadForm.city}
                    onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    State
                  </label>
                  <Input
                    placeholder="State"
                    value={leadForm.state}
                    onChange={(e) => setLeadForm({ ...leadForm, state: e.target.value })}
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    ZIP Code *
                  </label>
                  <Input
                    placeholder="ZIP"
                    value={leadForm.location}
                    onChange={(e) => setLeadForm({ ...leadForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    Your Name *
                  </label>
                  <Input
                    placeholder="Full name"
                    value={leadForm.contact_name}
                    onChange={(e) => setLeadForm({ ...leadForm, contact_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={leadForm.contact_email}
                    onChange={(e) => setLeadForm({ ...leadForm, contact_email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    Phone Number (Optional)
                  </label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={leadForm.contact_phone}
                    onChange={(e) => setLeadForm({ ...leadForm, contact_phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    Deadline (Optional)
                  </label>
                  <Input
                    type="date"
                    value={leadForm.deadline}
                    onChange={(e) => setLeadForm({ ...leadForm, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="bg-brand-gold/10 border-2 border-brand-gold/20 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Privacy Note:</strong> Your contact information will only be shared with matched professionals. 
                  We'll connect you with verified Black-owned businesses and professionals in your area.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-semibold text-lg py-6"
              >
                Submit Request & Get Matched
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
