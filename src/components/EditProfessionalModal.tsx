import { useState, useEffect } from 'react';
import { X, Loader2, History, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAdminHeaders } from '@/utils/auth';
import ImageUpload from './ImageUpload';

interface EditProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  professional: any;
  testMode?: boolean;
}

const categories = [
  { label: 'Coaching & Consulting', value: 'coaching_consulting' },
  { label: 'Education & Tutoring', value: 'education_tutoring' },
  { label: 'Event & Hospitality', value: 'event_hospitality' },
  { label: 'Finance & Insurance', value: 'finance_insurance' },
  { label: 'Health & Medical', value: 'health_medical' },
  { label: 'Legal & Advocacy', value: 'legal_advocacy' },
  { label: 'Media & Marketing', value: 'media_marketing' },
  { label: 'Nonprofits & Community', value: 'nonprofits_community' },
  { label: 'Real Estate & Wealth', value: 'real_estate_wealth' },
  { label: 'Technology & Innovation', value: 'technology_innovation' },
  { label: 'Trades & Home', value: 'trades_home' },
  { label: 'Transportation & Logistics', value: 'transportation_logistics' },
  { label: 'Arts & Culture', value: 'arts_culture' },
  { label: 'Black Media', value: 'black_media' },
  { label: 'Faith & Resilience', value: 'faith_resilience' },
  { label: 'HBCUs & Education', value: 'hbcus_education' },
  { label: 'Travel & Heritage', value: 'travel_heritage' },
  { label: 'Other', value: 'other' },
];

export function EditProfessionalModal({ isOpen, onClose, onSuccess, professional, testMode = false }: EditProfessionalModalProps) {
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
    credentials: '',
    status: 'approved',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (professional) {
      setFormData({
        name: professional.name || '',
        category: professional.category || '',
        business_name: professional.business_name || '',
        tagline: professional.tagline || '',
        bio: professional.bio || '',
        email: professional.email || '',
        website: professional.website || '',
        phone: professional.phone || '',
        zip: professional.zip || '',
        image_url: professional.image_url || '',
        credentials: professional.credentials || '',
        status: professional.status || 'approved',
      });
    }
  }, [professional]);

  useEffect(() => {
    if (isOpen && professional) {
      loadVersionHistory();
    }
  }, [isOpen, professional]);

  const loadVersionHistory = async () => {
    try {
      const headers = getAdminHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/version-history/professional/${professional.id}`,
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

    if (!formData.name || !formData.category || !formData.bio || !formData.email || !formData.phone) {
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

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/professionals/${professional.id}`,
        {
          method: 'PUT',
          headers: headersWithEmail,
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid admin password. Please reload the page and enter the correct password.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update professional');
      }

      alert('✅ Professional updated successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating professional:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update professional. Please try again.';
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
        `${import.meta.env.VITE_API_URL}/api/admin/rollback/professional/${professional.id}/${versionNumber}`,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`p-6 rounded-t-xl flex justify-between items-center ${testMode ? 'bg-[#C5A14E]' : 'bg-emerald-600'}`}>
          <div>
            <h2 className={`text-2xl font-bold ${testMode ? 'text-black' : 'text-white'}`}>
              Edit Professional {testMode && '🧪'}
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
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <Input
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  placeholder="Enter business name"
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
                  placeholder="professional@example.com"
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
                Tagline
              </label>
              <Input
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Professional tagline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Professional bio and expertise"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credentials
              </label>
              <Input
                value={formData.credentials}
                onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                placeholder="e.g., MBA, CFP, Licensed Attorney"
              />
            </div>

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
              <ImageUpload
                section="professionals"
                imageType="profile"
                isVerified={formData.status === 'approved'}
                testMode={testMode}
                onUploadSuccess={(url) => setFormData({ ...formData, image_url: url })}
                onUploadError={(error) => setError(error)}
                currentImage={formData.image_url}
                label="Upload Profile Photo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <Input
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                placeholder="12345"
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
                    Updating...
                  </>
                ) : (
                  'Update Professional'
                )}
              </Button>
            </div>
          </form>

          {showPreview && (
            <div className="w-1/2 p-6 border-l border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <div className="bg-white rounded-lg shadow p-4 space-y-3">
                {formData.image_url && (
                  <img src={formData.image_url} alt="Profile" className="w-24 h-24 object-cover rounded-full" />
                )}
                <h4 className="text-xl font-bold text-gray-900">{formData.name || 'Professional Name'}</h4>
                {formData.business_name && (
                  <p className="text-sm font-medium text-gray-700">{formData.business_name}</p>
                )}
                {formData.tagline && (
                  <p className="text-sm text-emerald-600 italic">{formData.tagline}</p>
                )}
                <p className="text-sm text-gray-600">{formData.category ? categories.find(c => c.value === formData.category)?.label : 'Category'}</p>
                <p className="text-gray-700">{formData.bio || 'Bio will appear here...'}</p>
                {formData.credentials && (
                  <p className="text-sm font-medium text-gray-600">📜 {formData.credentials}</p>
                )}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📧 {formData.email || 'email@example.com'}</p>
                  <p>📞 {formData.phone || '(555) 123-4567'}</p>
                  {formData.website && <p>🌐 {formData.website}</p>}
                  {formData.zip && <p>📍 ZIP: {formData.zip}</p>}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  formData.status === 'approved' ? 'bg-green-100 text-green-800' :
                  formData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
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
