import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react';
import { api } from '../api';

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
  latest_news: 'Latest News',
  black_achievements: 'Black Achievements',
  entrepreneur_spotlight: 'Entrepreneur Spotlight',
  education_culture: 'Education & Culture',
  faith_resilience: 'Faith & Resilience',
};

export default function NewsArticle() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const article = await api.get(`/api/articles/slug/${slug}`);
      setArticle(article);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${article?.title}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#000000] to-[#0b1c0e] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A14E]"></div>
          <p className="text-white mt-4">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#000000] to-[#0b1c0e] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Article Not Found</h2>
          <Button
            onClick={() => navigate('/news')}
            className="bg-[#C5A14E] hover:bg-[#b39145] text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] to-[#0b1c0e]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button
          onClick={() => navigate('/news')}
          className="mb-8 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white border border-[#C5A14E]/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>

        <article className="bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#C5A14E]/20">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8 md:p-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-[#C5A14E] bg-[#C5A14E]/10 px-4 py-2 rounded-full">
                {categoryLabels[article.category as keyof typeof categoryLabels]}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {article.title}
            </h1>

            <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#C5A14E]/20">
              <div>
                <p className="text-white/80 text-lg">By {article.author}</p>
                <p className="text-white/60">{formatDate(article.created_at)}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm mr-2">Share:</span>
                <Button
                  onClick={shareOnFacebook}
                  size="sm"
                  className="bg-[#1877F2] hover:bg-[#1565D8] text-white"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  onClick={shareOnTwitter}
                  size="sm"
                  className="bg-[#1DA1F2] hover:bg-[#1A8CD8] text-white"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  onClick={shareOnLinkedIn}
                  size="sm"
                  className="bg-[#0A66C2] hover:bg-[#0952A5] text-white"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-xl text-white/90 mb-8 font-medium">
                {article.excerpt}
              </p>
              <div className="text-white/80 whitespace-pre-wrap leading-relaxed">
                {article.body}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[#C5A14E]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Written by</p>
                  <p className="text-white text-lg font-semibold">{article.author}</p>
                </div>
                <Button
                  onClick={() => navigate('/news')}
                  className="bg-[#C5A14E] hover:bg-[#b39145] text-black"
                >
                  Read More Stories
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
