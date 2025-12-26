import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import SearchResults from './components/SearchResults';
import NoteDetail from './components/NoteDetail';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
      </div>
    </Router>
  );
}

export default App;
