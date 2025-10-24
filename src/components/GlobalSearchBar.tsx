import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getAdminHeaders } from '@/utils/auth';

interface SearchResult {
  id: string;
  type: 'vendor' | 'professional' | 'product' | 'ad';
  name: string;
  email?: string;
  category?: string;
  status?: string;
  created_at: string;
}

interface GlobalSearchBarProps {
  onResultClick?: (result: SearchResult) => void;
}

const typeIcons = {
  vendor: '🏪',
  professional: '👤',
  product: '📦',
  ad: '📢',
};

const typeLabels = {
  vendor: 'Vendor',
  professional: 'Professional',
  product: 'Product',
  ad: 'Advertisement',
};

export function GlobalSearchBar({ onResultClick }: GlobalSearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const headers = getAdminHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/search?q=${encodeURIComponent(searchQuery)}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setShowResults(true);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    }
    setShowResults(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search across all sections (vendors, professionals, products, ads)..."
          className="pl-10 pr-10 py-6 text-base border-2 border-gray-300 focus:border-[#C5A14E] rounded-lg"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No results found</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-start gap-3"
                >
                  <span className="text-2xl">{typeIcons[result.type]}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{result.name}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {typeLabels[result.type]}
                      </span>
                      {result.status && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          result.status === 'approved' || result.status === 'active' ? 'bg-green-100 text-green-700' :
                          result.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {result.status}
                        </span>
                      )}
                    </div>
                    {result.email && (
                      <p className="text-sm text-gray-600 mt-1">📧 {result.email}</p>
                    )}
                    {result.category && (
                      <p className="text-sm text-gray-500 mt-1">Category: {result.category}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(result.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
