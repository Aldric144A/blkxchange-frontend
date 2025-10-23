import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfessionalCategory } from '@/types';

interface SubmitProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  { label: 'Trades & Home Services', value: 'trades_home' },
  { label: 'Transportation & Logistics', value: 'transportation_logistics' },
  { label: 'Arts & Culture Education', value: 'arts_culture' },
  { label: 'Black Media & Publications', value: 'black_media' },
  { label: 'Faith & Resilience', value: 'faith_resilience' },
  { label: 'HBCUs & Educational Partners', value: 'hbcus_education' },
  { label: 'Travel & Heritage Experiences', value: 'travel_heritage' },
];

export function SubmitProfessionalModal({ isOpen, onClose }: SubmitProfessionalModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '' as ProfessionalCategory,
    tagline: '',
    description: '',
    website: '',
    logo_url: '',
    zip: '',
    email: '',
    agreement_accepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.category || !formData.description || !formData.zip || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.agreement_accepted) {
      setError('You must confirm that this submission is accurate and authorized');
      return;
    }

    if (formData.description.length > 500) {
      setError('Description must be 500 characters or less');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/professionals/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit professional');
      }

      alert('Thank you! Your professional submission has been received and is pending review. If approved, it will appear on BlkXchange™ within 48 hours.');
      onClose();
      
      setFormData({
        name: '',
        category: '' as ProfessionalCategory,
        tagline: '',
        description: '',
        website: '',
        logo_url: '',
        zip: '',
        email: '',
        agreement_accepted: false,
      });
    } catch (err) {
      console.error('Error submitting professional:', err);
      setError('Failed to submit professional. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-brand-charcoal rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-emerald-600 p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Submit a Professional</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Business / Professional Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-gold mb-2">
              Business / Professional Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/10 border-brand-gold/30 text-white placeholder:text-gray-400"
              placeholder="Enter business or professional name"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-brand-gold mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as ProfessionalCategory })}
            >
              <SelectTrigger className="bg-white/10 border-brand-gold/30 text-white">
                <SelectValue placeholder="Select a category" />
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

          {/* Tagline */}
          <div>
            <label htmlFor="tagline" className="block text-sm font-medium text-brand-gold mb-2">
              Tagline (Optional)
            </label>
            <Input
              id="tagline"
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="bg-white/10 border-brand-gold/30 text-white placeholder:text-gray-400"
              placeholder="Brief tagline or title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-brand-gold mb-2">
              Description <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 ml-2">({formData.description.length}/500 characters)</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/10 border border-brand-gold/30 rounded-md px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              placeholder="Describe the business or professional services"
              rows={4}
              maxLength={500}
              required
            />
          </div>

          {/* Website URL */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-brand-gold mb-2">
              Website URL (Optional)
            </label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="bg-white/10 border-brand-gold/30 text-white placeholder:text-gray-400"
              placeholder="https://example.com"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label htmlFor="logo_url" className="block text-sm font-medium text-brand-gold mb-2">
              Logo URL (Optional)
            </label>
            <div className="flex gap-2">
              <Input
                id="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="bg-white/10 border-brand-gold/30 text-white placeholder:text-gray-400"
                placeholder="https://example.com/logo.png"
              />
              <Button
                type="button"
                variant="outline"
                className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Paste image URL or upload file</p>
          </div>

          {/* ZIP Code */}
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-brand-gold mb-2">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <Input
              id="zip"
              type="text"
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              className="bg-white/10 border-brand-gold/30 text-white placeholder:text-gray-400"
              placeholder="Enter ZIP code"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-gold mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white/10 border-brand-gold/30 text-white placeholder:text-gray-400"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreement"
              checked={formData.agreement_accepted}
              onChange={(e) => setFormData({ ...formData, agreement_accepted: e.target.checked })}
              className="mt-1 w-4 h-4 rounded border-brand-gold/30 bg-white/10 text-brand-gold focus:ring-brand-gold"
              required
            />
            <label htmlFor="agreement" className="text-sm text-gray-300">
              I confirm this submission is accurate and authorized. <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit for Review'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
