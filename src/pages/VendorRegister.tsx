import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Store } from 'lucide-react';

export default function VendorRegister() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    business_name: '',
    business_description: '',
    phone: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-brand-gold">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-brand-gold mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold mb-4 text-brand-black">
              Application Submitted!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Thank you for your interest in joining BlkXchange™. Our team will review your 
              application and contact you within 2-3 business days.
            </p>
            <Alert className="bg-brand-gold border-brand-gold">
              <AlertDescription className="text-brand-black">
                Check your email for next steps and information about setting up your vendor dashboard.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Store className="w-16 h-16 text-brand-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Become a Vendor
          </h1>
          <p className="text-xl text-gray-300">
            Join BlkXchange™ and start selling to our community
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-brand-gold mb-8">
          <CardHeader className="bg-brand-gold">
            <CardTitle className="text-2xl text-brand-black">Why Sell on BlkXchange™?</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span><strong>No upfront fees:</strong> Only pay when you make a sale (10% platform fee)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span><strong>Automatic payments:</strong> Get paid directly via Stripe Connect</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span><strong>Community impact:</strong> 3% of every sale supports HBCUs and scholarships</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span><strong>Full dashboard:</strong> Manage products, orders, and track your impact</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span><strong>Targeted audience:</strong> Reach customers actively seeking Black-owned businesses</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-brand-gold">
          <CardHeader>
            <CardTitle className="text-2xl text-brand-black">Vendor Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-brand-black">Your Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-brand-black">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-brand-black">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="business_name" className="text-brand-black">Business Name *</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="business_description" className="text-brand-black">
                  Business Description *
                </Label>
                <Textarea
                  id="business_description"
                  name="business_description"
                  required
                  value={formData.business_description}
                  onChange={handleChange}
                  className="mt-1"
                  rows={4}
                  placeholder="Tell us about your business, what you sell, and what makes you unique..."
                />
              </div>

              <Alert className="bg-brand-ivory border-brand-gold">
                <AlertDescription className="text-gray-700">
                  By submitting this application, you agree to our vendor terms and revenue sharing model 
                  (90% to you, 7% platform operations, 3% community impact).
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gold text-brand-black hover:bg-opacity-90 text-lg py-6"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
