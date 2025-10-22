import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Newspaper } from 'lucide-react';
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

export default function NewsAll() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllArticles();
  }, []);

  const loadAllArticles = async () => {
    try {
      setLoading(true);
      const allArticles = await api.get('/api/articles?status=published');
      setArticles(allArticles);
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
              All Stories
            </h1>
            <div className="h-1 w-32 bg-[#C5A14E] mx-auto mb-6"></div>
          </div>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
            Explore every story from The Black Chronicle™ in one continuous feed.
          </p>
          
          <Button
            onClick={() => navigate('/news')}
            className="bg-[#C5A14E] hover:bg-[#b39145] text-black px-8 py-4 text-lg font-semibold"
          >
            Back to Categories
          </Button>
        </div>
      </div>

      {/* All Articles Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A14E]"></div>
                <p className="text-white mt-4">Loading all stories...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-[#1A1A1A] to-[#0b1c0e] rounded-lg border border-[#C5A14E]/20">
                <Newspaper className="w-16 h-16 text-[#C5A14E] mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  📰 No stories yet.
                </h3>
                <p className="text-white/70 mb-6 text-lg">
                  Be the first to spotlight Black brilliance.
                </p>
                <Button
                  onClick={() => navigate('/submit-story')}
                  className="bg-[#C5A14E] hover:bg-[#b39145] text-black px-8 py-4 text-lg font-semibold"
                >
                  Submit an Article
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {articles.length} {articles.length === 1 ? 'Story' : 'Stories'} Published
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
                
                {/* Submit CTA at bottom */}
                <div className="mt-12 text-center bg-gradient-to-r from-[#1A1A1A] to-[#0b1c0e] rounded-lg p-8 border border-[#C5A14E]/20">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Have a Story to Share?
                  </h3>
                  <p className="text-white/70 mb-6">
                    Submit your article and inspire the BlkXchange™ community.
                  </p>
                  <Button
                    onClick={() => navigate('/submit-story')}
                    className="bg-[#C5A14E] hover:bg-[#b39145] text-black px-8 py-4 text-lg font-semibold"
                  >
                    Submit an Article
                  </Button>
                </div>
              </>
            )}
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
