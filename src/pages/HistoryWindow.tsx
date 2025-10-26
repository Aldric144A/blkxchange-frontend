import { useState, useEffect } from 'react';
import { History, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
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
}

const HistoryWindow = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDecade, setSelectedDecade] = useState<string>('all');

  const decades = [
    { id: 'all', label: 'All Eras' },
    { id: 'pre_1900', label: 'Pre-1900' },
    { id: '1900_1950', label: '1900-1950' },
    { id: '1950_2000', label: '1950-2000' },
    { id: '2000_today', label: '2000-Today' },
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

  const filteredEntries = selectedDecade === 'all'
    ? entries
    : entries.filter(e => e.decade === selectedDecade);

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
              History Window
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Explore an interactive timeline of Black history, achievements, and contributions to the world.
          </p>
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
            <strong>Demo Seed Data:</strong> 30 historical entries manually seeded. Future: AI crawler + community submissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryWindow;
