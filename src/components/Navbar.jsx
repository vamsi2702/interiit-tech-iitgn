import React from 'react';
import { Leaf, Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Mock RAG search - replace with actual API call later
  const performRAGSearch = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock suggestions based on query
    const mockCompanies = [
      { id: 'TSLA', name: 'Tesla Inc.', type: 'Company', description: 'Electric vehicles and clean energy' },
      { id: 'AAPL', name: 'Apple Inc.', type: 'Company', description: 'Technology and consumer electronics' },
      { id: 'MSFT', name: 'Microsoft Corp.', type: 'Company', description: 'Software and cloud services' },
      { id: 'GOOGL', name: 'Alphabet Inc.', type: 'Company', description: 'Search and advertising' },
      { id: 'AMZN', name: 'Amazon Inc.', type: 'Company', description: 'E-commerce and cloud computing' },
    ];

    const filtered = mockCompanies.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
    setIsSearching(false);
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        performRAGSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && suggestions.length > 0) {
      // Navigate to first suggestion
      navigate(`/report/${suggestions[0].id}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (companyId) => {
    navigate(`/report/${companyId}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl bg-opacity-80 shadow-2xl sticky top-0 z-50 border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform group">
            <div className="relative">
              <Leaf className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] group-hover:animate-spin" />
              <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-50 group-hover:opacity-75 transition"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">Our Kyzeel</span>
          </Link>

          {/* Unified RAG Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search companies, reports, ESG data..."
                  className="w-full px-6 py-2.5 pl-12 pr-12 text-slate-200 bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 placeholder-slate-500 shadow-lg transition-all"
                />
                <Search className="absolute left-4 top-3 w-5 h-5 text-emerald-400" />
                {isSearching && (
                  <Sparkles className="absolute right-4 top-3 w-5 h-5 text-emerald-400 animate-spin" />
                )}
              </div>

              {/* RAG Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-slate-800/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden animate-slideIn">
                  <div className="p-2 border-b border-emerald-500/20 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-semibold">RAG-Powered Results</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-slate-800/50">
                    {suggestions.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => selectSuggestion(item.id)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-700/50 transition-all border-b border-slate-700/30 last:border-b-0 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-200 group-hover:text-emerald-400 transition">{item.name}</span>
                              <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">{item.id}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                          </div>
                          <span className="text-xs text-slate-500 ml-2">{item.type}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-slate-300 hover:text-emerald-400 font-medium transition relative group"
            >
              <span className="relative z-10">Dashboard</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
            <Link
              to="/projects"
              className="text-slate-300 hover:text-emerald-400 font-medium transition relative group"
            >
              <span className="relative z-10">Projects</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
