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
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl bg-opacity-90 shadow-2xl sticky top-0 z-50 border-b border-cyan-500/30 animate-fadeIn">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-cyan-500/5 opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-all duration-300 group relative">
            <div className="relative">
              <Leaf className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)] group-hover:rotate-12 transition-all duration-500" />
              <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity animate-pulse-slow"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-300 to-teal-400 bg-clip-text text-transparent drop-shadow-lg gradient-animate">EcoInvest</span>
          </Link>

          {/* Unified RAG Search Bar */}
          <div className="flex-1 max-w-2xl relative group">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  className="relative w-full px-6 py-3 pl-12 pr-12 text-slate-200 bg-slate-800/60 backdrop-blur-xl border border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-slate-800/80 placeholder-slate-400 shadow-xl transition-all duration-300 hover:border-cyan-400/60"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                {isSearching && (
                  <Sparkles className="absolute right-4 top-3.5 w-5 h-5 text-cyan-400 animate-spin drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </div>

              {/* RAG Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-slate-800/98 backdrop-blur-2xl border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden animate-scaleIn">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
                  <div className="relative p-3 border-b border-cyan-500/30 flex items-center gap-2 bg-slate-900/40">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">RAG-Powered Results</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => selectSuggestion(item.id)}
                        style={{ animationDelay: `${idx * 50}ms` }}
                        className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-teal-500/10 transition-all duration-300 border-b border-slate-700/40 last:border-b-0 group animate-slideInLeft relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <div className="flex items-start justify-between relative">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors duration-300">{item.name}</span>
                              <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-md border border-cyan-500/40 group-hover:bg-cyan-500/30 transition-colors duration-300">{item.id}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5 group-hover:text-slate-300 transition-colors duration-300">{item.description}</p>
                          </div>
                          <span className="text-xs text-slate-500 ml-2 px-2 py-0.5 bg-slate-700/40 rounded group-hover:bg-slate-700/60 transition-colors duration-300">{item.type}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-slate-300 hover:text-cyan-400 font-semibold transition-all duration-300 relative group px-2 py-1"
            >
              <span className="relative z-10">Dashboard</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              <span className="absolute inset-0 bg-cyan-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 blur-sm"></span>
            </Link>
            <Link
              to="/projects"
              className="text-slate-300 hover:text-cyan-400 font-semibold transition-all duration-300 relative group px-2 py-1"
            >
              <span className="relative z-10">Projects</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              <span className="absolute inset-0 bg-cyan-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 blur-sm"></span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
