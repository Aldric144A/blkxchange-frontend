import { useState, useEffect } from 'react';
import { 
  History, ChevronLeft, ChevronRight, ExternalLink, Search, 
  Upload, Download
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface HistoryEntry {
  id: string;
  name: string;
  field: string;
  decade: string;
  biography: string;
  photo_url?: string;
  source_url?: string;
  year?: number;
  location?: string;
  likes?: number;
  featured?: boolean;
  tags?: string[];
}

const HistoryWindow = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDecade, setSelectedDecade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterField, setFilterField] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'liked' | 'featured'>('featured');
  const [showImportModal, setShowImportModal] = useState(false);

  const decades = [
    { id: 'all', label: 'All Eras' },
    { id: 'pre_1900', label: 'Pre-1900' },
    { id: '1900_1950', label: '1900-1950' },
    { id: '1950_2000', label: '1950-2000' },
    { id: '2000_today', label: '2000-Today' },
  ];

  const fields = [
    { id: 'all', label: 'All Fields' },
    { id: 'business', label: 'Business' },
    { id: 'science', label: 'Science' },
    { id: 'arts', label: 'Arts & Culture' },
    { id: 'politics', label: 'Politics' },
    { id: 'education', label: 'Education' },
    { id: 'sports', label: 'Sports' },
    { id: 'civil_rights', label: 'Civil Rights' },
  ];

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

  const handleImport = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post(`${API_URL}/api/blk360/history-entries/import`, formData);
      alert('Import successful!');
      fetchEntries();
      setShowImportModal(false);
    } catch (error) {
      console.error('Error importing:', error);
      alert('Import feature coming soon!');
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blk360/history-entries/export`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'history-entries.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Export feature coming soon!');
    }
  };

  let filteredEntries = entries;
  
  if (selectedDecade !== 'all') {
    filteredEntries = filteredEntries.filter(e => e.decade === selectedDecade);
  }
  
  if (filterField !== 'all') {
    filteredEntries = filteredEntries.filter(e => 
      e.field.toLowerCase().includes(filterField.toLowerCase())
    );
  }
  
  if (searchQuery) {
    filteredEntries = filteredEntries.filter(e =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.biography.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.field.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (sortBy === 'featured') {
    filteredEntries = [...filteredEntries].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  } else if (sortBy === 'liked') {
    filteredEntries = [...filteredEntries].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  const currentEntry = filteredEntries[currentIndex];

  const nextEntry = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredEntries.length);
  };

  const prevEntry = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredEntries.length) % filteredEntries.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading History Window...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 border-b border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <History className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
              History Window 2.0
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mb-6">
            Explore and preserve the rich history of Black excellence, innovation, and resilience.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Import Entries
            </button>
            <button
              onClick={handleExport}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, biography, or field..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="liked">Most Liked</option>
            </select>
          </div>

          {/* Field Filter */}
          <div>
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
            >
              {fields.map((field) => (
                <option key={field.id} value={field.id}>{field.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Decade Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3">
          {decades.map((decade) => (
            <button
              key={decade.id}
              onClick={() => {
                setSelectedDecade(decade.id);
                setCurrentIndex(0);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedDecade === decade.id
                  ? 'bg-gradient-to-r from-emerald-600 to-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {decade.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Display */}
      {currentEntry && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              <div className="h-96 bg-gradient-to-br from-emerald-900 to-gray-900">
                {currentEntry.photo_url ? (
                  <img
                    src={currentEntry.photo_url}
                    alt={currentEntry.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <History className="w-24 h-24 text-emerald-600" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{currentEntry.name}</h2>
                  <p className="text-emerald-400 font-semibold mb-4">{currentEntry.field}</p>
                  <p className="text-gray-300 mb-6">{currentEntry.biography}</p>
                </div>

                {currentEntry.source_url && (
                  <a
                    href={currentEntry.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Learn More
                  </a>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-gray-800 px-8 py-4 flex items-center justify-between">
              <button
                onClick={prevEntry}
                className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              <span className="text-gray-400">
                {currentIndex + 1} of {filteredEntries.length}
              </span>
              <button
                onClick={nextEntry}
                className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-4 text-center">
          <p className="text-emerald-400 text-sm">
            <strong>Demo Seed Data:</strong> 30 historical entries manually seeded. Import/Export + community submissions coming soon.
          </p>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border-2 border-emerald-700">
            <h2 className="text-2xl font-bold text-white mb-6">Import History Entries</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Upload CSV or JSON file</p>
                <p className="text-gray-500 text-sm mb-4">
                  Supported formats: .csv, .json (max 10MB)
                </p>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImport(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Required Fields:</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• name (string)</li>
                  <li>• field (string)</li>
                  <li>• decade (string)</li>
                  <li>• biography (string)</li>
                  <li>• year (number, optional)</li>
                  <li>• location (string, optional)</li>
                  <li>• photo_url (string, optional)</li>
                  <li>• source_url (string, optional)</li>
                </ul>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryWindow;
