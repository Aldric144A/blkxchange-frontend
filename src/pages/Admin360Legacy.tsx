import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LegacyEntry {
  id: string;
  title: string;
  person_name: string;
  category: string;
  story: string;
  image_url?: string;
  submitted_by: string;
  status: string;
  created_at: string;
}

const Admin360Legacy = () => {
  const [entries, setEntries] = useState<LegacyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blk360/legacy-entries?status_filter=all`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API_URL}/api/blk360/legacy-entries/${id}/status`, { status });
      setEntries(entries.map(e => e.id === id ? { ...e, status } : e));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filteredEntries = filter === 'all' 
    ? entries 
    : entries.filter(e => e.status === filter);

  if (loading) {
    return <div className="text-center py-12">Loading entries...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Legacy Wall Moderation</h2>
          <p className="text-gray-600">Review and approve community-submitted tributes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All ({entries.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Pending ({entries.filter(e => e.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Approved ({entries.filter(e => e.status === 'approved').length})
          </button>
        </div>
      </div>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {entry.image_url && (
              <img
                src={entry.image_url}
                alt={entry.person_name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  entry.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {entry.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                  {entry.status === 'approved' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                  {entry.status === 'rejected' && <XCircle className="w-3 h-3 inline mr-1" />}
                  {entry.status.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500 capitalize">{entry.category}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{entry.person_name}</h3>
              <p className="text-sm font-semibold text-emerald-600 mb-2">{entry.title}</p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{entry.story}</p>
              <div className="text-xs text-gray-500 mb-3">
                Submitted by: {entry.submitted_by}
              </div>
              
              {entry.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(entry.id, 'approved')}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(entry.id, 'rejected')}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No {filter !== 'all' ? filter : ''} entries found.</p>
        </div>
      )}
    </div>
  );
};

export default Admin360Legacy;
