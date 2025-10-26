import { useState, useEffect } from 'react';
import { Award, Heart, Plus } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LegacyEntry {
  id: string;
  title: string;
  honoree_name: string;
  photo_url?: string;
  story: string;
  category: string;
  status: string;
  featured: boolean;
}

const LegacyWall = () => {
  const [entries, setEntries] = useState<LegacyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blk360/legacy-entries?status=approved`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading Legacy Wall...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 border-b border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-emerald-400" />
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
                  Legacy Wall
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-3xl">
                Honor and preserve the stories of our ancestors, family members, and community heroes.
              </p>
            </div>
            <button
              onClick={() => alert("Submit form coming soon!")}
              className="bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Submit Tribute
            </button>
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="break-inside-avoid bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-emerald-500 transition-all duration-300"
            >
              {entry.photo_url && (
                <img
                  src={entry.photo_url}
                  alt={entry.honoree_name}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                {entry.featured && (
                  <div className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    <Heart className="w-3 h-3" />
                    Featured
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{entry.title}</h3>
                <p className="text-emerald-400 font-semibold mb-3">{entry.honoree_name}</p>
                <p className="text-gray-400 text-sm line-clamp-6">{entry.story}</p>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <span className="text-xs text-gray-500 uppercase">{entry.category.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-4 text-center">
          <p className="text-emerald-400 text-sm">
            <strong>Demo Seed Data:</strong> These are sample legacy entries. Submit your own tribute to honor your loved ones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegacyWall;
