import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Store, Upload, X } from 'lucide-react';
import { ProductCategory, PriceRange, FulfillmentMethod, VendorApplicationCreate } from '@/types';

export default function VendorApply() {
  const [formData, setFormData] = useState<VendorApplicationCreate>({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    category: ProductCategory.OTHER,
    description: '',
    price_range: PriceRange.UNDER_25,
    fulfillment_method: FulfillmentMethod.SHIPPING,
    image_urls: [],
    agreement_accepted: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreement_accepted) {
      alert('Please accept the Vendor Agreement to continue');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to submit application'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles([...imageFiles, ...files]);
      
      const urls = files.map(file => URL.createObjectURL(file));
      setFormData({
        ...formData,
        image_urls: [...formData.image_urls, ...urls]
      });
    }
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newUrls = formData.image_urls.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setFormData({
      ...formData,
      image_urls: newUrls
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-brand-gold">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-brand-gold mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold mb-4 text-brand-black">
              Application Submitted Successfully!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Thank you for applying to become a vendor on BlkXchange™. Our admin team will review your 
              application and contact you within 2-3 business days.
            </p>
            <Alert className="bg-brand-gold border-brand-gold mb-6">
              <AlertDescription className="text-brand-black">
                You will receive an email confirmation shortly. Once approved, you'll get instructions 
                to set up your vendor account and start listing products.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-brand-black text-brand-ivory hover:bg-opacity-90"
            >
              Return to Home
            </Button>
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
            Vendor Application
          </h1>
          <p className="text-xl text-gray-300">
            Join The Internet's Black Wall Street
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-brand-gold mb-8">
          <CardHeader className="bg-brand-gold">
            <CardTitle className="text-2xl text-brand-black">Why Sell on BlkXchange™?</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span><strong>No upfront fees:</strong> Only pay when you make a sale (15% platform fee)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span><strong>Community impact:</strong> Portion of sales supports HBCUs and scholarships</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span><strong>Full dashboard:</strong> Manage products, orders, and track your sales</span>
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
            <CardTitle className="text-2xl text-brand-black">Application Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-black">Vendor Information</h3>
                
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
                  <Label htmlFor="contact_name" className="text-brand-black">Owner / Contact Name *</Label>
                  <Input
                    id="contact_name"
                    name="contact_name"
                    type="text"
                    required
                    value={formData.contact_name}
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
                  <Label htmlFor="phone" className="text-brand-black">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-brand-black">Business Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Street, City, State, ZIP"
                  />
                </div>

                <div>
                  <Label htmlFor="website" className="text-brand-black">Website / Social Media Links</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-brand-black">Product Information</h3>

                <div>
                  <Label htmlFor="category" className="text-brand-black">Product Category *</Label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  >
                    <option value={ProductCategory.APPAREL}>Clothing</option>
                    <option value={ProductCategory.BEAUTY}>Beauty</option>
                    <option value={ProductCategory.JEWELRY}>Jewelry</option>
                    <option value={ProductCategory.FOOD}>Food</option>
                    <option value={ProductCategory.ART}>Art</option>
                    <option value={ProductCategory.BOOKS}>Books</option>
                    <option value={ProductCategory.HOME}>Home Goods</option>
                    <option value={ProductCategory.WELLNESS}>Wellness</option>
                    <option value={ProductCategory.TECH}>Tech</option>
                    <option value={ProductCategory.OTHER}>Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-brand-black">
                    Product Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1"
                    rows={4}
                    placeholder="Describe the products you plan to sell..."
                  />
                </div>

                <div>
                  <Label htmlFor="price_range" className="text-brand-black">Typical Price Range *</Label>
                  <select
                    id="price_range"
                    name="price_range"
                    required
                    value={formData.price_range}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  >
                    <option value={PriceRange.UNDER_25}>&lt;$25</option>
                    <option value={PriceRange.RANGE_25_50}>$25-$50</option>
                    <option value={PriceRange.RANGE_50_100}>$50-$100</option>
                    <option value={PriceRange.OVER_100}>&gt;$100</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="fulfillment_method" className="text-brand-black">Fulfillment Method *</Label>
                  <select
                    id="fulfillment_method"
                    name="fulfillment_method"
                    required
                    value={formData.fulfillment_method}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  >
                    <option value={FulfillmentMethod.SHIPPING}>Vendor ships directly</option>
                    <option value={FulfillmentMethod.LOCAL}>Vendor delivers locally</option>
                  </select>
                </div>

                <div>
                  <Label className="text-brand-black">Product Images (Optional)</Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-brand-gold transition-colors">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">Click to upload sample product images</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {formData.image_urls.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {formData.image_urls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-brand-black">Agreement</h3>
                
                <Alert className="bg-brand-ivory border-brand-gold">
                  <AlertDescription className="text-gray-700">
                    Please review the{' '}
                    <a href="/vendor-agreement" target="_blank" className="text-brand-gold underline font-semibold">
                      BlkXchange™ Vendor Agreement
                    </a>
                    {' '}before submitting your application.
                  </AlertDescription>
                </Alert>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agreement_accepted"
                    checked={formData.agreement_accepted}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, agreement_accepted: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="agreement_accepted" className="text-sm text-gray-700 cursor-pointer">
                    I have read and agree to the BlkXchange™ Vendor Agreement and certify that my 
                    products are authentic and compliant with all applicable laws and regulations. *
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.agreement_accepted}
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
