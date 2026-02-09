import React from 'react';
import { Clock } from 'lucide-react';
import { RecentSearch } from '../types';

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSelect: (value: string, type: 'serial' | 'account') => void;
  onClear: () => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSelect, onClear }) => {
  if (searches.length === 0) return null;

  return (
    <div className="mt-6 w-full animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Недавние запросы</span>
        </div>
        <button 
          onClick={onClear}
          className="text-[10px] text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded hover:bg-destructive/10"
        >
          Очистить
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <button
            key={`${search.value}-${index}`}
            onClick={() => onSelect(search.value, search.type)}
            className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 text-sm text-foreground shadow-sm hover:shadow hover:border-primary/30 hover:text-primary transition-all active:scale-95"
          >
            <span className="font-medium">{search.value}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {search.type === 'serial' ? '№' : 'Л/С'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
