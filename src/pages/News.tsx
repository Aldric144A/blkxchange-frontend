import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '../api';
import { SidebarAd } from '../components/ads';
import { useNavigate, Link } from 'react-router-dom';

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
  const [categoryArticles, setCategoryArticles] = useState<Article[]>([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('latest_news');

  useEffect(() => {
    loadCategoryArticles();
    setCurrentArticleIndex(0);
  }, [selectedCategory]);

  const loadCategoryArticles = async () => {
    try {
      setLoading(true);
      let url = '/api/articles?status=published';
      if (selectedCategory !== 'latest_news') {
        url += `&category=${selectedCategory}`;
      }
      const articles = await api.get(url);
      
      if (selectedCategory === 'latest_news' && articles.length > 0) {
        setCategoryArticles([articles[0]]);
      } else {
        setCategoryArticles(articles);
      }
    } catch (error) {
      console.error('Error loading category articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextArticle = () => {
    if (categoryArticles.length > 0) {
      setCurrentArticleIndex((prevIndex) => 
        prevIndex === categoryArticles.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const currentArticle = categoryArticles[currentArticleIndex];

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

      {/* Article Display Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A14E]"></div>
                <p className="text-white mt-4">Loading articles...</p>
              </div>
            ) : !currentArticle ? (
              <div className="text-center py-16 bg-gradient-to-br from-[#1A1A1A] to-[#0b1c0e] rounded-lg border border-[#C5A14E]/20">
                <h3 className="text-2xl font-bold text-[#C5A14E] mb-3">
                  No stories yet in this section.
                </h3>
                <p className="text-white/70 mb-6 text-lg">
                  Be the first to spotlight Black brilliance.
                </p>
              </div>
            ) : (
              <div className="mb-8">
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0b1c0e] rounded-xl overflow-hidden border border-[#C5A14E]/30 hover:border-[#C5A14E] transition-all">
                  <div className="grid md:grid-cols-2 gap-0">
                    {currentArticle.image_url && (
                      <div className="relative h-64 md:h-full">
                        <img
                          src={currentArticle.image_url}
                          alt={currentArticle.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#C5A14E] text-black px-4 py-2 rounded-full text-sm font-bold">
                            {selectedCategory === 'latest_news' ? 'LATEST ARTICLE' : categoryLabels[selectedCategory as keyof typeof categoryLabels].toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <span className="text-[#C5A14E] text-sm font-semibold mb-3">
                        {categoryLabels[currentArticle.category as keyof typeof categoryLabels]}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {currentArticle.title}
                      </h2>
                      <p className="text-white/80 text-lg mb-6">
                        {currentArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
                        <span>By {currentArticle.author}</span>
                        <span>•</span>
                        <span>{new Date(currentArticle.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => navigate(`/news/${currentArticle.slug}`)}
                          className="bg-[#C5A14E] hover:bg-[#b39145] text-black px-8 py-4 text-lg font-semibold"
                        >
                          Read Full Story
                        </Button>
                        {categoryArticles.length > 1 && (
                          <Button
                            onClick={handleNextArticle}
                            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white border border-[#C5A14E]/30 px-6 py-4 text-lg font-semibold"
                          >
                            Next Article →
                          </Button>
                        )}
                      </div>
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

      {/* Partner Banner */}
      <div className="bg-[#000000] py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white text-xl font-bold mb-4">
            Are you a Black business, creator, or professional? Partner with BlkXchange™ and be part of our legacy.
          </p>
          <Link to="/partner">
            <Button className="bg-[#C5A14E] text-white hover:bg-opacity-90 hover:shadow-2xl rounded-full px-10 py-4 text-lg font-semibold shadow-lg transition-all">
              Join the Movement
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
