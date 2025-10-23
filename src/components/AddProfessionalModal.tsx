import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  adminSecret: string;
}

const categories = [
  { label: 'Accounting & Finance', value: 'accounting_finance' },
  { label: 'Business Consulting', value: 'business_consulting' },
  { label: 'Coaching & Mentorship', value: 'coaching_mentorship' },
  { label: 'Creative Services', value: 'creative_services' },
  { label: 'Education & Tutoring', value: 'education_tutoring' },
  { label: 'Event Planning', value: 'event_planning' },
  { label: 'Healthcare & Wellness', value: 'healthcare_wellness' },
  { label: 'IT & Technology', value: 'it_technology' },
  { label: 'Legal Services', value: 'legal_services' },
  { label: 'Marketing & PR', value: 'marketing_pr' },
  { label: 'Real Estate', value: 'real_estate' },
  { label: 'Trades & Skilled Labor', value: 'trades_skilled_labor' },
];

export function AddProfessionalModal({ isOpen, onClose, onSuccess, adminSecret }: AddProfessionalModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    business_name: '',
    tagline: '',
    bio: '',
    email: '',
    website: '',
    phone: '',
    zip: '',
    image_url: '',
    credentials: 'Admin Verified',
    status: 'approved',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.category || !formData.bio || !formData.email || !formData.zip) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/professionals/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': adminSecret,
        },
        body: JSON.stringify({
          ...formData,
          business_name: formData.business_name || null,
          tagline: formData.tagline || null,
          website: formData.website || null,
          phone: formData.phone || null,
          image_url: formData.image_url || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create professional');
      }

      alert('✅ Professional created successfully!');
      onSuccess();
      onClose();
      
      setFormData({
        name: '',
        category: '',
        business_name: '',
        tagline: '',
        bio: '',
        email: '',
        website: '',
        phone: '',
        zip: '',
        image_url: '',
        credentials: 'Admin Verified',
        status: 'approved',
      });
    } catch (err) {
      console.error('Error creating professional:', err);
      setError('Failed to create professional. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-emerald-600 p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add New Professional</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
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
                Professional Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Jane Smith"
                required
              />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business/Organization Name
              </label>
              <Input
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                placeholder="Smith & Associates"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <Input
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Expert Legal Counsel"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Professional background and expertise"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="professional@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
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
              Profile Image URL
            </label>
            <Input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credentials
            </label>
            <Input
              value={formData.credentials}
              onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
              placeholder="Admin Verified"
            />
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
                'Create Professional'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
