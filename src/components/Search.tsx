
import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { COLORS } from '../constants';

interface SearchProps {
  onSearch: (query: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Doorzoek de kennisbank..."
        className="w-full bg-transparent border-2 border-black rounded-none py-3 pl-12 pr-16 text-lg font-mono placeholder-current transition-all duration-300 ease-in-out focus:outline-none focus:placeholder-transparent"
        style={{ color: COLORS.PRIMARY_GREEN }}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <SearchIcon size={24} strokeWidth={1.5} style={{ color: COLORS.PRIMARY_GREEN }} />
      </div>
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-12 flex items-center pr-4 transition-transform duration-200 ease-in-out transform hover:scale-110"
          aria-label="Clear search"
        >
          <X size={22} strokeWidth={1.5} className="text-gray-400" />
        </button>
      )}
      <button
        onClick={handleSearch}
        className="absolute inset-y-0 right-0 flex items-center pr-4 font-mono uppercase tracking-widest transition-transform duration-200 ease-in-out transform hover:scale-105"
        style={{ color: COLORS.PRIMARY_GREEN }}
      >
        Zoek
      </button>
    </div>
  );
};
