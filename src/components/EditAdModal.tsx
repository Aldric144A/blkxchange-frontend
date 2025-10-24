import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from '@/components/ImageUpload';
import { Loader2 } from 'lucide-react';

interface AdCreative {
  id: string;
  advertiser_id: string;
  advertiser_name: string;
  asset_url: string;
  ad_type: string;
  pages: string[];
  start_date: string;
  end_date: string;
  price_tier: string;
  link_url?: string;
  status: string;
  created_at: string;
}

interface EditAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ad: AdCreative;
}

export function EditAdModal({ isOpen, onClose, onSuccess, ad }: EditAdModalProps) {
  const [formData, setFormData] = useState({
    advertiser_name: ad.advertiser_name,
    asset_url: ad.asset_url,
    ad_type: ad.ad_type,
    pages: ad.pages,
    start_date: ad.start_date.split('T')[0],
    end_date: ad.end_date.split('T')[0],
    price_tier: ad.price_tier,
    link_url: ad.link_url || '',
    status: ad.status,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      advertiser_name: ad.advertiser_name,
      asset_url: ad.asset_url,
      ad_type: ad.ad_type,
      pages: ad.pages,
      start_date: ad.start_date.split('T')[0],
      end_date: ad.end_date.split('T')[0],
      price_tier: ad.price_tier,
      link_url: ad.link_url || '',
      status: ad.status,
    });
  }, [ad]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const adminSecret = localStorage.getItem('admin_secret');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ad-creatives/${ad.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Secret': adminSecret || '',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update ad');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ad');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, asset_url: url });
  };

  const togglePage = (page: string) => {
    const newPages = formData.pages.includes(page)
      ? formData.pages.filter(p => p !== page)
      : [...formData.pages, page];
    setFormData({ ...formData, pages: newPages });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-black">
            Edit Ad Campaign
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Ad Image */}
          <div>
            <Label className="text-brand-black">Ad Creative Image</Label>
            {formData.asset_url && (
              <div className="mt-2 mb-4">
                <img
                  src={formData.asset_url}
                  alt="Ad preview"
                  className="w-full max-w-md h-48 object-cover rounded border-2 border-gray-200"
                />
              </div>
            )}
            <ImageUpload
              section="ads"
              imageType="ad"
              isVerified={formData.status === 'live'}
              testMode={false}
              onUploadSuccess={handleImageUpload}
              currentImage={formData.asset_url}
              label="Upload Ad Image"
            />
          </div>

          {/* Advertiser Name */}
          <div>
            <Label htmlFor="advertiser_name" className="text-brand-black">Advertiser Name *</Label>
            <Input
              id="advertiser_name"
              value={formData.advertiser_name}
              onChange={(e) => setFormData({ ...formData, advertiser_name: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          {/* Ad Type and Price Tier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ad_type" className="text-brand-black">Ad Type *</Label>
              <Select
                value={formData.ad_type}
                onValueChange={(value) => setFormData({ ...formData, ad_type: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price_tier" className="text-brand-black">Price Tier *</Label>
              <Select
                value={formData.price_tier}
                onValueChange={(value) => setFormData({ ...formData, price_tier: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Link URL */}
          <div>
            <Label htmlFor="link_url" className="text-brand-black">Link URL</Label>
            <Input
              id="link_url"
              type="url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              className="mt-1"
              placeholder="https://example.com"
            />
          </div>

          {/* Start and End Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-brand-black">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="end_date" className="text-brand-black">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Pages */}
          <div>
            <Label className="text-brand-black">Display on Pages *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {['landing', 'marketplace', 'professionals', 'invest', 'about'].map((page) => (
                <div key={page} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`page-${page}`}
                    checked={formData.pages.includes(page)}
                    onChange={() => togglePage(page)}
                    className="w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold"
                  />
                  <Label htmlFor={`page-${page}`} className="text-brand-black capitalize cursor-pointer">
                    {page}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status" className="text-brand-black">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-brand-gold text-brand-black hover:bg-brand-gold/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
