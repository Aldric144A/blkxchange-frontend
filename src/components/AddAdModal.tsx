import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAdminHeaders } from '@/utils/auth';

interface AddAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  testMode?: boolean;
}

const adTypes = [
  { label: 'Sidebar', value: 'sidebar' },
  { label: 'Banner', value: 'banner' },
  { label: 'Carousel', value: 'carousel' },
  { label: 'Spotlight', value: 'spotlight' },
];

const placements = [
  { label: 'Marketplace', value: 'marketplace' },
  { label: 'Professionals', value: 'professionals' },
  { label: 'Landing', value: 'landing' },
  { label: 'Impact', value: 'impact' },
];

export function AddAdModal({ isOpen, onClose, onSuccess, testMode = false }: AddAdModalProps) {
  const [formData, setFormData] = useState({
    advertiser_name: '',
    tagline: '',
    asset_url: '',
    target_url: '',
    ad_type: 'banner',
    pages: ['marketplace'],
    start_date: '',
    end_date: '',
    status: 'live',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.advertiser_name || !formData.asset_url || !formData.target_url) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        advertiser_name: formData.advertiser_name,
        tagline: formData.tagline || null,
        asset_url: formData.asset_url,
        target_url: formData.target_url,
        ad_type: formData.ad_type,
        pages: formData.pages,
        status: formData.status,
      };

      if (formData.start_date) {
        payload.start_date = new Date(formData.start_date).toISOString();
      }
      if (formData.end_date) {
        payload.end_date = new Date(formData.end_date).toISOString();
      }

      const endpoint = testMode 
        ? `${import.meta.env.VITE_API_URL}/api/admin/test-mode/ads/manual`
        : `${import.meta.env.VITE_API_URL}/api/admin/ads/manual`;
      
      const headers = getAdminHeaders();
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create ad');
      }

      const successMessage = testMode 
        ? '✅ Test ad created successfully! (Not published to live site)'
        : '✅ Ad created successfully!';
      alert(successMessage);
      onSuccess();
      onClose();
      
      setFormData({
        advertiser_name: '',
        tagline: '',
        asset_url: '',
        target_url: '',
        ad_type: 'banner',
        pages: ['marketplace'],
        start_date: '',
        end_date: '',
        status: 'live',
      });
    } catch (err) {
      console.error('Error creating ad:', err);
      setError('Failed to create ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePage = (page: string) => {
    setFormData((prev) => {
      const pages = prev.pages.includes(page)
        ? prev.pages.filter((p) => p !== page)
        : [...prev.pages, page];
      return { ...prev, pages };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`p-6 rounded-t-xl flex justify-between items-center ${testMode ? 'bg-[#C5A14E]' : 'bg-emerald-600'}`}>
          <div>
            <h2 className={`text-2xl font-bold ${testMode ? 'text-black' : 'text-white'}`}>
              Add New Ad {testMode && '🧪'}
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
                Advertiser Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.advertiser_name}
                onChange={(e) => setFormData({ ...formData, advertiser_name: e.target.value })}
                placeholder="Company Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <Input
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Short tagline"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL <span className="text-red-500">*</span>
            </label>
            <Input
              type="url"
              value={formData.asset_url}
              onChange={(e) => setFormData({ ...formData, asset_url: e.target.value })}
              placeholder="https://example.com/ad-image.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target URL <span className="text-red-500">*</span>
            </label>
            <Input
              type="url"
              value={formData.target_url}
              onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
              placeholder="https://example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Type <span className="text-red-500">*</span>
            </label>
            <Select value={formData.ad_type} onValueChange={(value) => setFormData({ ...formData, ad_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {adTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placement (Pages)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {placements.map((placement) => (
                <label key={placement.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.pages.includes(placement.value)}
                    onChange={() => togglePage(placement.value)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{placement.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
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
                'Create Ad'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
