import React, { useState } from 'react';
import { Search, Loader2, Hash, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { RecentSearches } from './RecentSearches';
import { RecentSearch } from '../types';

interface InputFormProps {
  onSubmit: (value: string, type: 'serial' | 'account') => void;
  isLoading: boolean;
  recentSearches?: RecentSearch[];
  onClearRecent?: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, recentSearches = [], onClearRecent = () => {} }) => {
  const [value, setValue] = useState('');
  const [searchType, setSearchType] = useState<'serial' | 'account'>('serial');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim(), searchType);
    }
  };

  const handleRecentSelect = (selectedValue: string, type: 'serial' | 'account') => {
    setValue(selectedValue);
    setSearchType(type);
    onSubmit(selectedValue, type);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20 backdrop-blur-sm relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full -ml-12 -mb-12 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
            Проверьте статус
          </h2>
          <p className="text-center text-muted-foreground mb-6">
            Введите данные прибора для получения информации
          </p>

          {/* Tabs */}
          <div className="flex p-1 bg-muted/50 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setSearchType('serial')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                searchType === 'serial' 
                  ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50"
              )}
            >
              <Hash className="w-4 h-4" />
              Серийный номер
            </button>
            <button
              type="button"
              onClick={() => setSearchType('account')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                searchType === 'account' 
                  ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50"
              )}
            >
              <FileText className="w-4 h-4" />
              Лицевой счёт
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                )}
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                placeholder={searchType === 'serial' ? "Например: 10743471" : "Например: 12345678"}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !value.trim()}
              className={cn(
                "w-full flex items-center justify-center py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg shadow-primary/25 transition-all duration-200",
                isLoading || !value.trim()
                  ? "bg-gray-300 cursor-not-allowed transform-none shadow-none"
                  : "bg-primary hover:bg-primary-hover hover:shadow-primary/40 active:scale-[0.98] active:translate-y-0.5"
              )}
            >
              {isLoading ? 'Поиск...' : 'ПОКАЗАТЬ СТАТУС'}
            </button>
          </form>

          <RecentSearches 
            searches={recentSearches} 
            onSelect={handleRecentSelect} 
            onClear={onClearRecent}
          />
        </div>
      </div>
    </div>
  );
};
