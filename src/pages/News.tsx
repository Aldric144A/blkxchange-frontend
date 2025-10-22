import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Newspaper, TrendingUp, Users, GraduationCap, Heart } from 'lucide-react';
import { api } from '../api';
import { SidebarAd } from '../components/ads';

interface Article {
  id: string;
  title: string;
  author: string;
  email: string;
  category: string;
  excerpt: string;
  body: string;
  image_url: string | null;
  status: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

const categoryIcons = {
  latest_news: Newspaper,
  black_achievements: TrendingUp,
  entrepreneur_spotlight: Users,
  education_culture: GraduationCap,
  faith_resilience: Heart,
};

const categoryLabels = {
  latest_news: 'Latest News',
  black_achievements: 'Black Achievements',
  entrepreneur_spotlight: 'Entrepreneur Spotlight',
  education_culture: 'Education & Culture',
  faith_resilience: 'Faith & Resilience',
};

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('latest_news');

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const articles = await api.get(`/api/articles?status=published&category=${selectedCategory}`);
      setArticles(articles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSubmission = () => {
    document.getElementById('submission-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToArticles = () => {
    document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] to-[#0b1c0e]">
      <div className="relative bg-gradient-to-b from-[#000000] to-[#0b1c0e] py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              The Black Chronicle™
            </h1>
            <div className="h-1 w-32 bg-[#C5A14E] mx-auto mb-6"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#C5A14E] mb-6">
            Telling Our Stories. Building Our Legacy.
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
            The Black Chronicle™ spotlights Black brilliance, innovation, and empowerment from around the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={scrollToSubmission}
              className="bg-[#046C4E] hover:bg-[#035a40] text-white px-8 py-6 text-lg"
            >
              Submit an Article
            </Button>
            <Button
              onClick={scrollToArticles}
              className="bg-[#C5A14E] hover:bg-[#b39145] text-black px-8 py-6 text-lg"
            >
              Read Latest Stories
            </Button>
          </div>
        </div>
      </div>

      <div id="articles-section" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-[#1A1A1A] p-2 mb-8">
            {Object.entries(categoryLabels).map(([key, label]) => {
              const Icon = categoryIcons[key as keyof typeof categoryIcons];
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center gap-2 data-[state=active]:bg-[#C5A14E] data-[state=active]:text-black text-white"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.keys(categoryLabels).map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A14E]"></div>
                  <p className="text-white mt-4">Loading articles...</p>
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-12 bg-[#1A1A1A] rounded-lg">
                  <Newspaper className="w-16 h-16 text-[#C5A14E] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No Articles Yet</h3>
                  <p className="text-white/70 mb-6">
                    Be the first to share a story in this category!
                  </p>
                  <Button
                    onClick={scrollToSubmission}
                    className="bg-[#C5A14E] hover:bg-[#b39145] text-black"
                  >
                    Submit an Article
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
          </div>
          <aside className="hidden md:block">
            <SidebarAd page="news" />
          </aside>
        </div>
      </div>

      <div id="submission-form" className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-[#1A1A1A] rounded-lg p-8 border border-[#C5A14E]/20">
          <h2 className="text-3xl font-bold text-[#C5A14E] mb-6 text-center">
            Submit Your Story
          </h2>
          <p className="text-white/80 text-center mb-8">
            Share stories of Black excellence, innovation, and achievement with our community.
          </p>
          <ArticleSubmissionForm onSuccess={loadArticles} />
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#C5A14E]/20 hover:border-[#C5A14E] transition-all">
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-[#C5A14E] bg-[#C5A14E]/10 px-3 py-1 rounded-full">
            {categoryLabels[article.category as keyof typeof categoryLabels]}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-sm text-white/60 mb-4">
          <span>By {article.author}</span>
          <span>{formatDate(article.created_at)}</span>
        </div>
        <Button
          onClick={() => window.location.href = `/news/${article.slug}`}
          className="w-full bg-[#046C4E] hover:bg-[#035a40] text-white"
        >
          Read More
        </Button>
      </div>
    </div>
  );
}

function ArticleSubmissionForm({ onSuccess }: { onSuccess: () => void }) {
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
        setSuccess(false);
        onSuccess();
      }, 3000);
    } catch (error) {
      console.error('Error submitting article:', error);
      alert('Failed to submit article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-[#046C4E]/20 border border-[#046C4E] text-white p-4 rounded-lg">
          ✓ Article submitted successfully! It will be reviewed before publication.
        </div>
      )}

      <div>
        <label className="block text-white font-semibold mb-2">Full Name *</label>
        <input
          type="text"
          required
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="w-full px-4 py-2 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
        />
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
        />
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">Headline *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
        />
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">Category *</label>
        <select
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
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
          className="w-full px-4 py-2 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
        />
        <p className="text-white/60 text-sm mt-1">{formData.excerpt.length}/200 characters</p>
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">Article Body *</label>
        <textarea
          required
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          rows={10}
          className="w-full px-4 py-2 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
        />
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">Image URL (optional)</label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 bg-[#111111] border border-[#C5A14E]/30 rounded-lg text-white focus:outline-none focus:border-[#C5A14E]"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="agreement"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="agreement" className="text-white/80 text-sm">
          I certify this submission is original and accurate.
        </label>
      </div>

      <Button
        type="submit"
        disabled={submitting || !agreed}
        className="w-full bg-[#C5A14E] hover:bg-[#b39145] text-black py-6 text-lg font-semibold disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit for Review'}
      </Button>
    </form>
  );
}
