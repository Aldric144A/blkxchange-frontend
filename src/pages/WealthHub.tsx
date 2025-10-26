import { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, Lock, Play } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface WealthModule {
  id: string;
  title: string;
  category: string;
  description: string;
  video_url?: string;
  article_url?: string;
  pdf_url?: string;
  thumbnail_url?: string;
  access_level: string;
  published: boolean;
  views: number;
}

const WealthHub = () => {
  const [modules, setModules] = useState<WealthModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userTier] = useState<string>('free'); // In real app, get from auth context

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'entrepreneurship', label: 'Entrepreneurship' },
    { id: 'investing', label: 'Investing' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'financial_literacy', label: 'Financial Literacy' },
    { id: 'mindset', label: 'Mindset' },
  ];

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blk360/wealth-modules`);
      setModules(response.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredModules = selectedCategory === 'all'
    ? modules
    : modules.filter(m => m.category === selectedCategory);

  const canAccess = (accessLevel: string) => {
    if (accessLevel === 'free') return true;
    if (accessLevel === 'premium' && (userTier === 'premium' || userTier === 'elite')) return true;
    if (accessLevel === 'elite' && userTier === 'elite') return true;
    return false;
  };

  const getAccessBadge = (accessLevel: string) => {
    const badges = {
      free: { text: 'Free', color: 'bg-gray-600' },
      premium: { text: 'Premium', color: 'bg-emerald-600' },
      elite: { text: 'Elite', color: 'bg-yellow-600' },
    };
    const badge = badges[accessLevel as keyof typeof badges];
    return (
      <span className={`${badge.color} text-white px-2 py-1 rounded text-xs font-semibold`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading Wealth Hub...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 border-b border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
              Wealth Hub
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Master the skills needed to build generational wealth. Learn from experts in entrepreneurship, investing, leadership, and more.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-emerald-600 to-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredModules.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No modules found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => {
              const hasAccess = canAccess(module.access_level);
              return (
                <div
                  key={module.id}
                  className={`bg-gray-900 rounded-xl overflow-hidden border-2 ${
                    hasAccess ? 'border-gray-700 hover:border-emerald-500' : 'border-gray-800'
                  } transition-all duration-300 ${hasAccess ? 'hover:scale-105' : ''} relative`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-emerald-900 to-gray-900">
                    {module.thumbnail_url ? (
                      <img
                        src={module.thumbnail_url}
                        alt={module.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-emerald-600" />
                      </div>
                    )}
                    {!hasAccess && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <Lock className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {getAccessBadge(module.access_level)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{module.description}</p>

                    {/* Resources */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      {module.video_url && (
                        <div className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          <span>Video</span>
                        </div>
                      )}
                      {module.article_url && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>Article</span>
                        </div>
                      )}
                      {module.pdf_url && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>PDF</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {hasAccess ? (
                      <button className="w-full bg-gradient-to-r from-emerald-600 to-yellow-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Learning
                      </button>
                    ) : (
                      <button
                        onClick={() => window.location.href = '/blkxchange360/upgrade'}
                        className="w-full bg-gray-700 text-gray-300 py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
                      >
                        Upgrade to Access
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Demo Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-4 text-center">
          <p className="text-emerald-400 text-sm">
            <strong>Demo Seed Data:</strong> These are sample modules. Editable via Admin 360 Manager.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WealthHub;
