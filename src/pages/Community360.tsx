import { useState, useEffect } from 'react';
import { MessageSquare, Users } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author_name: string;
  views: number;
  reply_count: number;
  created_at: string;
}

const Community360 = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'business', label: 'Business' },
    { id: 'health', label: 'Health' },
    { id: 'faith', label: 'Faith' },
    { id: 'culture', label: 'Culture' },
    { id: 'tech', label: 'Tech' },
    { id: 'leadership', label: 'Leadership' },
  ];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      const url = selectedCategory === 'all'
        ? `${API_URL}/api/blk360/forum-posts`
        : `${API_URL}/api/blk360/forum-posts?category=${selectedCategory}`;
      const response = await axios.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading Community Forum...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 border-b border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
              Community Forum
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Connect with like-minded entrepreneurs, share insights, and build lasting relationships.
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

      {/* Posts List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700 hover:border-emerald-500 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white flex-1">{post.title}</h3>
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {post.category}
                </span>
              </div>
              <p className="text-gray-400 mb-4 line-clamp-2">{post.content}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{post.author_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.reply_count} replies</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Elite Lounge Teaser */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 rounded-2xl p-8 border-2 border-yellow-700 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Elite Lounge</h3>
          <p className="text-gray-300 mb-6">
            Exclusive forum for Elite members. Connect with top entrepreneurs and industry leaders.
          </p>
          <button className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
            Upgrade to Elite
          </button>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-4 text-center">
          <p className="text-emerald-400 text-sm">
            <strong>Demo Seed Data:</strong> 5 sample forum threads. Premium/Elite members can post and reply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Community360;
