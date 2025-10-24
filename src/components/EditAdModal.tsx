import { useState, useEffect } from 'react';
import { X, Loader2, History, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAdminHeaders } from '@/utils/auth';
import ImageUpload from './ImageUpload';

interface EditAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ad: any;
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

export function EditAdModal({ isOpen, onClose, onSuccess, ad, testMode = false }: EditAdModalProps) {
  const [formData, setFormData] = useState({
    advertiser_name: '',
    tagline: '',
    asset_url: '',
    target_url: '',
    ad_type: 'banner',
    pages: [] as string[],
    start_date: '',
    end_date: '',
    status: 'live',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (ad) {
      setFormData({
        advertiser_name: ad.advertiser_name || '',
        tagline: ad.tagline || '',
        asset_url: ad.asset_url || '',
        target_url: ad.target_url || '',
        ad_type: ad.ad_type || 'banner',
        pages: ad.pages || [],
        start_date: ad.start_date ? new Date(ad.start_date).toISOString().split('T')[0] : '',
        end_date: ad.end_date ? new Date(ad.end_date).toISOString().split('T')[0] : '',
        status: ad.status || 'live',
      });
    }
  }, [ad]);

  useEffect(() => {
    if (isOpen && ad) {
      loadVersionHistory();
    }
  }, [isOpen, ad]);

  const loadVersionHistory = async () => {
    try {
      const headers = getAdminHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/version-history/ad/${ad.id}`,
        { headers }
      );
      if (response.ok) {
        const history = await response.json();
        setVersionHistory(history);
      }
    } catch (err) {
      console.error('Error loading version history:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.advertiser_name || !formData.asset_url || !formData.target_url) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const headers = getAdminHeaders();
      const headersWithEmail = {
        ...headers,
        'X-Admin-Email': localStorage.getItem('admin_email') || 'admin@blkxchange.com',
      };

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

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/ads/${ad.id}`,
        {
          method: 'PUT',
          headers: headersWithEmail,
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid admin password. Please reload the page and enter the correct password.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update ad');
      }

      alert('✅ Ad updated successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating ad:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update ad. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (versionNumber: number) => {
    if (!confirm(`Are you sure you want to rollback to version ${versionNumber}?`)) {
      return;
    }

    try {
      const headers = getAdminHeaders();
      const headersWithEmail = {
        ...headers,
        'X-Admin-Email': localStorage.getItem('admin_email') || 'admin@blkxchange.com',
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/rollback/ad/${ad.id}/${versionNumber}`,
        {
          method: 'POST',
          headers: headersWithEmail,
        }
      );

      if (response.ok) {
        alert('✅ Rolled back successfully!');
        onSuccess();
        loadVersionHistory();
      } else {
        throw new Error('Failed to rollback');
      }
    } catch (err) {
      console.error('Error rolling back:', err);
      alert('Failed to rollback. Please try again.');
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
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`p-6 rounded-t-xl flex justify-between items-center ${testMode ? 'bg-[#C5A14E]' : 'bg-emerald-600'}`}>
          <div>
            <h2 className={`text-2xl font-bold ${testMode ? 'text-black' : 'text-white'}`}>
              Edit Ad {testMode && '🧪'}
            </h2>
            {testMode && (
              <p className="text-sm text-black mt-1">Test Mode - Changes will not affect live site</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              className={`${testMode ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'} transition-colors`}
              title="Version History"
            >
              <History className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`${testMode ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'} transition-colors`}
              title="Preview Changes"
            >
              <Eye className="w-6 h-6" />
            </button>
            <button onClick={onClose} className={`${testMode ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-200'} transition-colors`}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex">
          <form onSubmit={handleSubmit} className={`p-6 space-y-4 ${showPreview ? 'w-1/2' : 'w-full'}`}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {showVersionHistory && versionHistory.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">Version History (Last 5 edits)</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {versionHistory.map((version) => (
                    <div key={version.id} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                      <div>
                        <span className="font-medium">v{version.version_number}</span> - {version.edited_by} 
                        <span className="text-gray-500 ml-2">{new Date(version.edited_at).toLocaleString()}</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRollback(version.version_number)}
                      >
                        Rollback
                      </Button>
                    </div>
                  ))}
                </div>
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
              <ImageUpload
                section="ads"
                imageType="ad"
                isVerified={false}
                testMode={testMode}
                onUploadSuccess={(url) => setFormData({ ...formData, asset_url: url })}
                onUploadError={(error) => setError(error)}
                currentImage={formData.asset_url}
                label="Upload Ad Banner/Creative"
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
                    Updating...
                  </>
                ) : (
                  'Update Ad'
                )}
              </Button>
            </div>
          </form>

          {showPreview && (
            <div className="w-1/2 p-6 border-l border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <div className="bg-white rounded-lg shadow p-4 space-y-3">
                {formData.asset_url && (
                  <img src={formData.asset_url} alt="Ad Creative" className="w-full h-auto rounded border" />
                )}
                <h4 className="text-xl font-bold text-gray-900">{formData.advertiser_name || 'Advertiser Name'}</h4>
                {formData.tagline && (
                  <p className="text-sm text-gray-600 italic">{formData.tagline}</p>
                )}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>🔗 Target: {formData.target_url || 'https://example.com'}</p>
                  <p>📐 Type: {adTypes.find(t => t.value === formData.ad_type)?.label || 'Banner'}</p>
                  <p>📍 Pages: {formData.pages.length > 0 ? formData.pages.map(p => placements.find(pl => pl.value === p)?.label).join(', ') : 'None selected'}</p>
                  {formData.start_date && <p>📅 Start: {new Date(formData.start_date).toLocaleDateString()}</p>}
                  {formData.end_date && <p>📅 End: {new Date(formData.end_date).toLocaleDateString()}</p>}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  formData.status === 'live' ? 'bg-green-100 text-green-800' :
                  formData.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {formData.status.toUpperCase()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
