import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Professional, ProfessionalCategory } from '@/types';
import ImageUpload from '@/components/ImageUpload';
import { Loader2 } from 'lucide-react';

interface EditProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  professional: Professional;
}

export function EditProfessionalModal({ isOpen, onClose, onSuccess, professional }: EditProfessionalModalProps) {
  const [formData, setFormData] = useState({
    name: professional.name,
    title: professional.title,
    category: professional.category,
    bio: professional.bio,
    credentials: professional.credentials,
    hourly_rate: professional.hourly_rate || 0,
    phone: professional.phone || '',
    website: professional.website || '',
    email: professional.email,
    image_url: professional.image_url || '',
    city: professional.city || '',
    state: professional.state || '',
    zip: professional.zip || '',
    verified: professional.verified,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      name: professional.name,
      title: professional.title,
      category: professional.category,
      bio: professional.bio,
      credentials: professional.credentials,
      hourly_rate: professional.hourly_rate || 0,
      phone: professional.phone || '',
      website: professional.website || '',
      email: professional.email,
      image_url: professional.image_url || '',
      city: professional.city || '',
      state: professional.state || '',
      zip: professional.zip || '',
      verified: professional.verified,
    });
  }, [professional]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const adminSecret = localStorage.getItem('admin_secret');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/professionals/${professional.id}`,
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
        throw new Error('Failed to update professional');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update professional');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, image_url: url });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-black">
            Edit Professional
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <Label className="text-brand-black">Profile Image</Label>
            <ImageUpload
              section="professionals"
              imageType="profile"
              isVerified={formData.verified}
              testMode={false}
              onUploadSuccess={handleImageUpload}
              currentImage={formData.image_url}
              label="Upload Profile Image"
            />
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-brand-black">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="title" className="text-brand-black">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Category and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-brand-black">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as ProfessionalCategory })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProfessionalCategory.HEALTH}>Health & Medical</SelectItem>
                  <SelectItem value={ProfessionalCategory.LEGAL}>Legal & Advocacy</SelectItem>
                  <SelectItem value={ProfessionalCategory.FINANCE}>Finance & Insurance</SelectItem>
                  <SelectItem value={ProfessionalCategory.COACHING}>Coaching</SelectItem>
                  <SelectItem value={ProfessionalCategory.CONSULTING}>Consulting</SelectItem>
                  <SelectItem value={ProfessionalCategory.EDUCATION}>Education & Tutoring</SelectItem>
                  <SelectItem value={ProfessionalCategory.REAL_ESTATE}>Real Estate & Wealth</SelectItem>
                  <SelectItem value={ProfessionalCategory.BARBERS_BEAUTY}>Barbers & Beauty</SelectItem>
                  <SelectItem value={ProfessionalCategory.PHOTOGRAPHY_DESIGN}>Photography & Design</SelectItem>
                  <SelectItem value={ProfessionalCategory.AUTOMOTIVE_HOUSING}>Automotive & Housing Finance</SelectItem>
                  <SelectItem value={ProfessionalCategory.MEDIA_MARKETING}>Media & Marketing</SelectItem>
                  <SelectItem value={ProfessionalCategory.NONPROFITS}>Nonprofits & Community</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email" className="text-brand-black">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio" className="text-brand-black">Bio *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Credentials */}
          <div>
            <Label htmlFor="credentials" className="text-brand-black">Credentials *</Label>
            <Input
              id="credentials"
              value={formData.credentials}
              onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
              required
              className="mt-1"
              placeholder="e.g., MD, JD, CPA, MBA"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-brand-black">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="website" className="text-brand-black">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Hourly Rate */}
          <div>
            <Label htmlFor="hourly_rate" className="text-brand-black">Hourly Rate ($)</Label>
            <Input
              id="hourly_rate"
              type="number"
              min="0"
              step="0.01"
              value={formData.hourly_rate}
              onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) || 0 })}
              className="mt-1"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-brand-black">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="state" className="text-brand-black">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1"
                maxLength={2}
                placeholder="CA"
              />
            </div>

            <div>
              <Label htmlFor="zip" className="text-brand-black">ZIP Code</Label>
              <Input
                id="zip"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Verified Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verified"
              checked={formData.verified}
              onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
              className="w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold"
            />
            <Label htmlFor="verified" className="text-brand-black cursor-pointer">
              Verified Professional
            </Label>
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
