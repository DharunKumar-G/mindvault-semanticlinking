import { useState, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import Header from './components/Header';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import SearchResults from './components/SearchResults';
import NoteDetail from './components/NoteDetail';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setIsSearching(!!query);
  }, []);

  const handleNoteChange = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      meta: true,
      callback: () => {
        const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]');
        searchInput?.focus();
      }
    },
    {
      key: 'n',
      ctrl: true,
      meta: true,
      callback: () => {
        navigate('/new');
      }
    },
    {
      key: '/',
      ctrl: true,
      meta: true,
      callback: () => {
        setShowShortcuts(true);
      }
    },
    {
      key: 'e',
      ctrl: true,
      meta: true,
      callback: () => {
        const match = location.pathname.match(/\/note\/([^/]+)/);
        if (match) {
          navigate(`/edit/${match[1]}`);
        }
      }
    },
    {
      key: 'Escape',
      callback: () => {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else if (location.pathname !== '/') {
          navigate('/');
        }
      },
      allowInInput: true
    }
  ]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
        <Header onSearch={handleSearch} searchQuery={searchQuery} />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route 
              path="/" 
              element={
                isSearching ? (
                  <SearchResults 
                    query={searchQuery} 
                    onClearSearch={handleClearSearch}
                  />
                ) : (
                  <NotesList 
                    key={refreshKey} 
                    onNoteChange={handleNoteChange} 
                  />
                )
              } 
            />
            <Route 
              path="/new" 
              element={<NoteEditor onSave={handleNoteChange} />} 
            />
            <Route 
              path="/note/:id" 
              element={<NoteDetail onNoteChange={handleNoteChange} />} 
            />
            <Route 
              path="/edit/:id" 
              element={<NoteEditor onSave={handleNoteChange} />} 
            />
          </Routes>
        </main>

        {/* Help button */}
        <button
          onClick={() => setShowShortcuts(true)}
          className="fixed bottom-6 right-6 p-3 bg-vault-600 dark:bg-vault-500 text-white rounded-full 
                   shadow-lg hover:bg-vault-700 dark:hover:bg-vault-600 transition-colors"
          title="Keyboard shortcuts (Ctrl+/)"
        >
          <span className="text-lg">?</span>
        </button>
      </div>

      <KeyboardShortcutsModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
