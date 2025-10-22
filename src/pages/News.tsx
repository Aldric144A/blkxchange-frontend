import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '../api';
import { SidebarAd } from '../components/ads';
import { useNavigate } from 'react-router-dom';

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

const categoryLabels = {
  latest_news: 'Latest',
  black_achievements: 'Achievements',
  entrepreneur_spotlight: 'Entrepreneurs',
  education_culture: 'Education',
  faith_resilience: 'Faith',
};

export default function News() {
  const navigate = useNavigate();
  const [latestArticle, setLatestArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('latest_news');

  useEffect(() => {
    loadLatestArticle();
  }, []);

  const loadLatestArticle = async () => {
    try {
      const allArticles = await api.get('/api/articles?status=published');
      if (allArticles.length > 0) {
        setLatestArticle(allArticles[0]);
      }
    } catch (error) {
      console.error('Error loading latest article:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] to-[#0b1c0e]">
      {/* Header with Category Tabs */}
      <div className="relative bg-gradient-to-b from-[#000000] to-[#0b1c0e] py-20 px-4">
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

          {/* Category Tabs */}
          <div className="py-6">
            <div className="flex flex-wrap justify-center gap-6 border-b border-[#C5A14E]/20 pb-1 max-w-4xl mx-auto">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-3 text-base font-semibold transition-all relative ${
                    selectedCategory === key
                      ? 'text-[#C5A14E]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {label}
                  {selectedCategory === key && (
                    <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-[#C5A14E] rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Article / Articles Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {/* Latest Article Box */}
            {latestArticle && (
              <div className="mb-8">
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0b1c0e] rounded-xl overflow-hidden border border-[#C5A14E]/30 hover:border-[#C5A14E] transition-all">
                  <div className="grid md:grid-cols-2 gap-0">
                    {latestArticle.image_url && (
                      <div className="relative h-64 md:h-full">
                        <img
                          src={latestArticle.image_url}
                          alt={latestArticle.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#C5A14E] text-black px-4 py-2 rounded-full text-sm font-bold">
                            LATEST ARTICLE
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <span className="text-[#C5A14E] text-sm font-semibold mb-3">
                        {categoryLabels[latestArticle.category as keyof typeof categoryLabels]}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {latestArticle.title}
                      </h2>
                      <p className="text-white/80 text-lg mb-6">
                        {latestArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
                        <span>By {latestArticle.author}</span>
                        <span>•</span>
                        <span>{new Date(latestArticle.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <Button
                        onClick={() => navigate(`/news/${latestArticle.slug}`)}
                        className="bg-[#C5A14E] hover:bg-[#b39145] text-black px-8 py-4 text-lg font-semibold w-fit"
                      >
                        Read Full Story
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Single Submit CTA at bottom */}
            <div className="mt-16 pt-10 text-center">
              <Button
                onClick={() => navigate('/submit-story')}
                className="bg-[#C5A14E] hover:bg-[#b39145] text-black px-10 py-5 text-lg font-semibold rounded-lg shadow-lg"
              >
                Submit an Article
              </Button>
            </div>
          </div>
          
          {/* Sidebar Ad */}
          <aside className="hidden md:block">
            <SidebarAd page="news" />
          </aside>
        </div>
      </div>
    </div>
  );
}
