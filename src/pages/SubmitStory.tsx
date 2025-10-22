import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const categoryLabels = {
  latest_news: 'Latest News',
  black_achievements: 'Black Achievements',
  entrepreneur_spotlight: 'Entrepreneur Spotlight',
  education_culture: 'Education & Culture',
  faith_resilience: 'Faith & Resilience',
};

export default function SubmitStory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    email: '',
    category: 'latest_news',
    excerpt: '',
    body: '',
    image_url: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please certify that your submission is original and accurate.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/api/articles', formData);
      setSuccess(true);
      setFormData({
        title: '',
        author: '',
        email: '',
        category: 'latest_news',
        excerpt: '',
        body: '',
        image_url: '',
      });
      setAgreed(false);
      setTimeout(() => {
        navigate('/news');
      }, 2000);
    } catch (error) {
      console.error('Error submitting article:', error);
      alert('Failed to submit article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] to-[#0b1c0e]">
      <div className="relative bg-gradient-to-b from-[#000000] to-[#0b1c0e] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Submit Your Story
            </h1>
            <div className="h-1 w-24 bg-[#C5A14E] mx-auto mb-6"></div>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Share stories of Black excellence, innovation, and achievement with our community.
            </p>
          </div>

          <div className="bg-[#1A1A1A] rounded-lg p-8 border border-[#C5A14E]/20">
            {success && (
              <div className="bg-[#046C4E]/20 border border-[#046C4E] text-white p-4 rounded-lg mb-6">
                ✓ Article submitted successfully! Redirecting to The Black Chronicle™...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Headline *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Excerpt (150-200 characters) *</label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
                />
                <p className="text-white/60 text-sm mt-1">{formData.excerpt.length}/200 characters</p>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Article Body *</label>
                <textarea
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
                  placeholder="Share your story in detail..."
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
                />
              </div>

              <div className="flex items-start gap-3 bg-[#111111] p-4 rounded-lg border border-[#C5A14E]/20">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#C5A14E]"
                />
                <label htmlFor="agreement" className="text-white/80 text-sm">
                  I certify this submission is original and accurate, and I grant BlkXchange™ permission to publish this content on The Black Chronicle™.
                </label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => navigate('/news')}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white border border-[#C5A14E]/30 py-6 text-lg font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || !agreed}
                  className="flex-1 bg-[#C5A14E] hover:bg-[#b39145] text-black py-6 text-lg font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
