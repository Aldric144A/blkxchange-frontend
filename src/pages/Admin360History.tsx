import { useState, useEffect } from 'react';
import { Upload, Calendar, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface HistoryEntry {
  id: string;
  title: string;
  date: string;
  era: string;
  description: string;
  image_url?: string;
  source?: string;
  created_at: string;
}

const Admin360History = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blk360/history-entries`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this history entry?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/blk360/history-entries/${id}`);
      setEntries(entries.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  const groupedByEra = entries.reduce((acc, entry) => {
    if (!acc[entry.era]) acc[entry.era] = [];
    acc[entry.era].push(entry);
    return acc;
  }, {} as Record<string, HistoryEntry[]>);

  const eraOrder = ['Pre-1900', '1900-1950', '1950-2000', '2000-Today'];

  if (loading) {
    return <div className="text-center py-12">Loading history entries...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">History Import</h2>
          <p className="text-gray-600">Upload and manage historical timeline entries</p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Entry
        </button>
      </div>

      {/* Upload Form Placeholder */}
      {showUploadForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Upload History Entry</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSV/JSON Upload
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Drag and drop your file here, or click to browse</p>
                <p className="text-sm text-gray-500">Supported formats: CSV, JSON</p>
                <input type="file" className="hidden" accept=".csv,.json" />
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">Expected Format:</p>
              <code className="text-xs">
                title, date, era, description, image_url, source
              </code>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => alert('Upload functionality coming soon')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                Upload
              </button>
              <button
                onClick={() => setShowUploadForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries by Era */}
      {eraOrder.map((era) => {
        const eraEntries = groupedByEra[era] || [];
        if (eraEntries.length === 0) return null;

        return (
          <div key={era} className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-600" />
              {era} ({eraEntries.length} entries)
            </h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eraEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{entry.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">{entry.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.source || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => alert('Edit functionality coming soon')}
                          className="text-emerald-600 hover:text-emerald-900 mr-3"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {entries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No history entries found. Click "Upload Entry" to add your first one.</p>
        </div>
      )}
    </div>
  );
};

export default Admin360History;
