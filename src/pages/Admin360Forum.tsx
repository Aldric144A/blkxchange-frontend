import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Flag, Trash2, Eye } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  likes: number;
  reply_count: number;
  flagged: boolean;
  created_at: string;
}

const Admin360Forum = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blk360/forum-posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/blk360/forum-posts/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const toggleFlag = async (id: string) => {
    try {
      const post = posts.find(p => p.id === id);
      if (!post) return;
      
      await axios.put(`${API_URL}/api/blk360/forum-posts/${id}`, {
        ...post,
        flagged: !post.flagged
      });
      setPosts(posts.map(p => p.id === id ? { ...p, flagged: !p.flagged } : p));
    } catch (error) {
      console.error('Error toggling flag:', error);
      alert('Failed to update flag status');
    }
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : filter === 'flagged' 
    ? posts.filter(p => p.flagged)
    : posts.filter(p => p.category === filter);

  if (loading) {
    return <div className="text-center py-12">Loading forum posts...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Forum Moderation</h2>
          <p className="text-gray-600">Monitor and moderate community discussions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setFilter('flagged')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === 'flagged' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Flagged ({posts.filter(p => p.flagged).length})
          </button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <tr key={post.id} className={`hover:bg-gray-50 ${post.flagged ? 'bg-red-50' : ''}`}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{post.content}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {post.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 capitalize">
                    {post.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {post.reply_count}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {post.flagged && (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      <Flag className="w-3 h-3 mr-1" />
                      Flagged
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => alert('View details coming soon')}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleFlag(post.id)}
                    className={`${post.flagged ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'} mr-3`}
                    title={post.flagged ? 'Unflag' : 'Flag'}
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No {filter !== 'all' ? filter : ''} posts found.</p>
        </div>
      )}
    </div>
  );
};

export default Admin360Forum;
