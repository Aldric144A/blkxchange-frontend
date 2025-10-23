import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAdminHeaders } from '@/utils/auth';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  testMode?: boolean;
}

const categories = [
  { label: 'Apparel & Accessories', value: 'apparel_accessories' },
  { label: 'Art & Collectibles', value: 'art_collectibles' },
  { label: 'Automotive & Transportation', value: 'automotive_transportation' },
  { label: 'Beauty & Wellness', value: 'beauty_wellness' },
  { label: 'Books & Stationery', value: 'books_stationery' },
  { label: 'Food & Beverage', value: 'food_beverage' },
  { label: 'Health & Pharmacy', value: 'health_pharmacy' },
  { label: 'Home & Living', value: 'home_living' },
  { label: 'Manufacturing & Trades', value: 'manufacturing_trades' },
  { label: 'Technology & Gadgets', value: 'technology_gadgets' },
];

export function AddVendorModal({ isOpen, onClose, onSuccess, testMode = false }: AddVendorModalProps) {
  const [formData, setFormData] = useState({
    business_name: '',
    owner_name: '',
    email: '',
    phone: '',
    description: '',
    category: '',
    website: '',
    logo_url: '',
    address: '',
    zip: '',
    status: 'approved',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.business_name || !formData.owner_name || !formData.email || !formData.phone || !formData.description || !formData.category || !formData.address || !formData.zip) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const endpoint = testMode 
        ? `${import.meta.env.VITE_API_URL}/api/admin/test-mode/vendors/manual`
        : `${import.meta.env.VITE_API_URL}/api/admin/vendors/manual`;
      
      const headers = getAdminHeaders();
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid admin password. Please reload the page and enter the correct password.');
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('Backend error response:', errorData);
        console.error('Status code:', response.status);
        console.error('Endpoint:', endpoint);
        console.error('Payload:', formData);
        
        let errorMessage = 'Failed to create vendor';
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => `${err.loc?.join('.')||'field'}: ${err.msg}`).join(', ');
          }
        }
        throw new Error(errorMessage);
      }

      const successMessage = testMode 
        ? '✅ Test vendor created successfully! (Not published to live site)'
        : '✅ Vendor created successfully!';
      alert(successMessage);
      onSuccess();
      onClose();
      
      setFormData({
        business_name: '',
        owner_name: '',
        email: '',
        phone: '',
        description: '',
        category: '',
        website: '',
        logo_url: '',
        address: '',
        zip: '',
        status: 'approved',
      });
    } catch (err) {
      console.error('Error creating vendor:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create vendor. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`p-6 rounded-t-xl flex justify-between items-center ${testMode ? 'bg-[#C5A14E]' : 'bg-emerald-600'}`}>
          <div>
            <h2 className={`text-2xl font-bold ${testMode ? 'text-black' : 'text-white'}`}>
              Add New Vendor {testMode && '🧪'}
            </h2>
            {testMode && (
              <p className="text-sm text-black mt-1">Test Mode - Entry will not be published to live site</p>
            )}
          </div>
          <button onClick={onClose} className={`${testMode ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'} transition-colors`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                placeholder="Enter business name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.owner_name}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                placeholder="Enter owner name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="vendor@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Describe the business"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <Input
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St, City, State"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                placeholder="12345"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Vendor'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
