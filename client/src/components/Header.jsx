import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Brain, Sparkles } from 'lucide-react';
import { debounce } from '../utils/debounce';

export default function Header({ onSearch, searchQuery }) {
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-vault-600 hover:text-vault-700 transition-colors"
            onClick={() => onSearch('')}
          >
            <Brain className="w-8 h-8" />
            <span className="text-xl font-bold hidden sm:block">MindVault</span>
          </Link>

          {/* Semantic Search Bar */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search by meaning... try 'peaceful evening memories'"
                className="block w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-xl 
                         bg-slate-50 focus:bg-white focus:ring-2 focus:ring-vault-500 
                         focus:border-transparent transition-all text-slate-800 placeholder-slate-400"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Sparkles className="h-4 w-4 text-vault-400" title="AI-Powered Semantic Search" />
              </div>
            </div>
          </form>

          {/* New Note Button */}
          <Link
            to="/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-vault-600 text-white 
                     rounded-xl hover:bg-vault-700 transition-colors font-medium
                     shadow-sm hover:shadow-md"
          >
            <span className="text-lg leading-none">+</span>
            <span className="hidden sm:block">New Note</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
