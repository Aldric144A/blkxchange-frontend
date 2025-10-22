import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Newspaper, Sparkles } from 'lucide-react';
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
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
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
      
      if (selectedCategory === 'latest_news' && articles.length > 0) {
        setFeaturedArticle(articles[0]);
      } else {
        setFeaturedArticle(null);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] to-[#0b1c0e]">
      {/* Header */}
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
          
          <Button
            onClick={() => navigate('/news/all')}
            className="bg-[#C5A14E] hover:bg-[#b39145] text-black px-8 py-6 text-lg font-semibold"
          >
            Read Latest Stories
          </Button>
        </div>
      </div>

      {/* Featured Story Block */}
      {selectedCategory === 'latest_news' && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          {featuredArticle ? (
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0b1c0e] rounded-xl overflow-hidden border border-[#C5A14E]/30 hover:border-[#C5A14E] transition-all">
              <div className="grid md:grid-cols-2 gap-0">
                {featuredArticle.image_url && (
                  <div className="relative h-64 md:h-full">
                    <img
                      src={featuredArticle.image_url}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#C5A14E] text-black px-4 py-2 rounded-full text-sm font-bold">
                        FEATURED STORY
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-[#C5A14E] text-sm font-semibold mb-3">
                    {categoryLabels[featuredArticle.category as keyof typeof categoryLabels]}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-white/80 text-lg mb-6">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
                    <span>By {featuredArticle.author}</span>
                    <span>•</span>
                    <span>{new Date(featuredArticle.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <Button
                    onClick={() => navigate(`/news/${featuredArticle.slug}`)}
                    className="bg-[#C5A14E] hover:bg-[#b39145] text-black px-8 py-4 text-lg font-semibold w-fit"
                  >
                    Read Full Story
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2A1810] rounded-xl p-10 text-center border border-[#C5A14E]/30">
              <Sparkles className="w-12 h-12 text-[#C5A14E] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#C5A14E] mb-4">
                ✨ No Featured Story Yet
              </h3>
              <p className="text-white/70 text-base mb-6">
                Submit one to inspire the community.
              </p>
              <Button
                onClick={() => navigate('/submit-story')}
                className="bg-[#C5A14E] hover:bg-[#b39145] text-black px-6 py-3 text-base font-semibold"
              >
                Submit an Article
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Articles Section */}
      <div id="articles-section" className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {/* Category Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center md:justify-start gap-6 border-b border-[#C5A14E]/20 pb-1">
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

            {/* Articles Grid */}
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A14E]"></div>
                <p className="text-white mt-4">Loading articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-[#1A1A1A] to-[#0b1c0e] rounded-lg border border-[#C5A14E]/20">
                <Newspaper className="w-16 h-16 text-[#C5A14E] mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-bold text-[#C5A14E] mb-3">
                  📰 No stories yet in this section.
                </h3>
                <p className="text-white/70 mb-6 text-lg">
                  Be the first to spotlight Black brilliance.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* Single Submit CTA at bottom */}
            <div className="mt-16 pt-10 text-center">
              <Button
                onClick={() => navigate('/submit-story')}
                className="bg-[#C5A14E] hover:bg-[#b39145] text-black px-10 py-5 text-lg font-semibold shadow-lg"
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

function ArticleCard({ article }: { article: Article }) {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#C5A14E]/20 hover:border-[#C5A14E] transition-all group">
      {article.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-[#C5A14E] bg-[#C5A14E]/10 px-3 py-1 rounded-full">
            {categoryLabels[article.category as keyof typeof categoryLabels]}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#C5A14E] transition-colors">
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
          onClick={() => navigate(`/news/${article.slug}`)}
          className="w-full bg-[#046C4E] hover:bg-[#035a40] text-white"
        >
          Read More
        </Button>
      </div>
    </div>
  );
}
