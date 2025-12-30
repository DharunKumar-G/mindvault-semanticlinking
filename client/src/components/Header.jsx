import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Brain, Sparkles, Moon, Sun } from 'lucide-react';
import { debounce } from '../utils/debounce';
import { useTheme } from '../contexts/ThemeContext';

export default function Header({ onSearch, searchQuery }) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const { isDark, toggleTheme } = useTheme();

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
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-vault-600 dark:text-vault-400 hover:text-vault-700 dark:hover:text-vault-300 transition-colors"
            onClick={() => onSearch('')}
          >
            <Brain className="w-8 h-8" />
            <span className="text-xl font-bold hidden sm:block">MindVault</span>
          </Link>

          {/* Semantic Search Bar */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search by meaning... try 'peaceful evening memories'"
                className="block w-full pl-10 pr-12 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl 
                         bg-slate-50 dark:bg-slate-700 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-600 
                         focus:ring-2 focus:ring-vault-500 dark:focus:ring-vault-400 
                         focus:border-transparent transition-all placeholder-slate-400 dark:placeholder-slate-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Sparkles className="h-4 w-4 text-vault-400 dark:text-vault-500" title="AI-Powered Semantic Search" />
              </div>
            </div>
          </form>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 
                     transition-colors text-slate-600 dark:text-slate-300"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* New Note Button */}
          <Link
            to="/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-vault-600 dark:bg-vault-500 text-white 
                     rounded-xl hover:bg-vault-700 dark:hover:bg-vault-600 transition-colors font-medium
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
