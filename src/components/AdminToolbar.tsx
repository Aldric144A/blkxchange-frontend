import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Download, BarChart3, Search } from 'lucide-react';
import { useState } from 'react';

interface AdminToolbarProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onSearch?: (query: string) => void;
  onViewMetrics?: () => void;
}

export function AdminToolbar({ onRefresh, onExport, onSearch, onViewMetrics }: AdminToolbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {onSearch && (
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 bg-white/10 border-brand-gold/30 text-white placeholder:text-gray-400"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black"
          >
            <Search className="w-4 h-4" />
          </Button>
        </form>
      )}
      
      {onRefresh && (
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      )}
      
      {onExport && (
        <Button
          onClick={onExport}
          variant="outline"
          size="sm"
          className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black"
          title="Export current table"
        >
          <Download className="w-4 h-4" />
        </Button>
      )}
      
      {onViewMetrics && (
        <Button
          onClick={onViewMetrics}
          variant="outline"
          size="sm"
          className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black"
          title="View metrics"
        >
          <BarChart3 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
