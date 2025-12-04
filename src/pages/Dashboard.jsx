import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Plus, ExternalLink, Trash2, X } from 'lucide-react';
import companiesData from '../data/companies.json';
import newsData from '../data/news.json';
import DashboardChatSidebar from '../components/DashboardChatSidebar';
import { ThemeContext } from '../App';
import Fuse from 'fuse.js';

const Dashboard = () => {
  const { theme } = React.useContext(ThemeContext);
  const navigate = useNavigate();
  const allCompanies = companiesData;
  const news = newsData;

  // Initialize watchlist from localStorage or use defaults
  const [watchlist, setWatchlist] = React.useState(() => {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If saved list is empty array, return defaults instead
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Default companies to show initially (or if list was empty)
    const defaultIds = ['TSLA', 'MSFT', 'AAPL'];
    return companiesData.filter(c => defaultIds.includes(c.id));
  });

  // Persist watchlist to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Add Company Modal State
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [addSearchQuery, setAddSearchQuery] = React.useState('');
  const [addSuggestions, setAddSuggestions] = React.useState([]);

  // Initialize Fuse for fuzzy search
  const fuse = React.useMemo(() => {
    return new Fuse(allCompanies, {
      keys: ['name', 'id', 'industry'],
      threshold: 0.4,
      distance: 100,
    });
  }, [allCompanies]);

  // Main Search Effect (Navigation)
  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }
    const results = fuse.search(searchQuery);
    setSuggestions(results.map(result => result.item));
  }, [searchQuery, fuse]);

  // Add Modal Search Effect
  React.useEffect(() => {
    if (addSearchQuery.trim() === '') {
      setAddSuggestions([]);
      return;
    }
    const results = fuse.search(addSearchQuery);
    setAddSuggestions(results.map(result => result.item));
  }, [addSearchQuery, fuse]);

  const handleNavigateToCompany = (companyId) => {
    navigate(`/report/${companyId}`);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const addToWatchlist = (company) => {
    if (!watchlist.some(c => c.id === company.id)) {
      setWatchlist([...watchlist, company]);
    }
    setAddSearchQuery('');
    setAddSuggestions([]);
    setIsAddModalOpen(false);
  };

  const removeFromWatchlist = (e, companyId) => {
    e.preventDefault();
    e.stopPropagation();
    setWatchlist(watchlist.filter(c => c.id !== companyId));
  };

  // Simple sparkline component
  const Sparkline = ({ trend }) => {
    const points = trend === 'up' 
      ? [30, 25, 28, 22, 26, 20, 15, 18, 12, 10]
      : [10, 12, 15, 18, 16, 20, 22, 25, 28, 30];
    
    const max = Math.max(...points);
    const normalized = points.map(p => (p / max) * 30);
    const pathData = normalized.map((y, i) => `${i * 10},${30 - y}`).join(' L ');
    
    return (
      <svg className="w-20 h-8" viewBox="0 0 100 30">
        <polyline
          points={pathData}
          fill="none"
          stroke={trend === 'up' ? '#22c55e' : '#ef4444'}
          strokeWidth="2"
        />
      </svg>
    );
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-green-100 text-green-800';
      case 'Negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'} relative`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-white'} transform transition-all scale-100`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add to Watchlist</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="relative mb-6">
              <input
                type="text"
                value={addSearchQuery}
                onChange={(e) => setAddSearchQuery(e.target.value)}
                placeholder="Search company name or ticker..."
                autoFocus
                className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-green-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all`}
              />
            </div>

            <div className={`max-h-60 overflow-y-auto rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'} custom-scrollbar`}>
              {addSearchQuery && addSuggestions.length > 0 ? (
                addSuggestions.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => addToWatchlist(company)}
                    className={`w-full px-4 py-3 flex items-center justify-between group transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-gray-200 text-gray-700'}`}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{company.name}</div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{company.id} • {company.industry}</div>
                    </div>
                    {watchlist.some(c => c.id === company.id) ? (
                      <span className="text-xs text-green-500 font-medium px-2 py-1 bg-green-500/10 rounded">Added</span>
                    ) : (
                      <Plus className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))
              ) : addSearchQuery ? (
                <div className={`p-4 text-center ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>No companies found</div>
              ) : (
                <div className={`p-4 text-center ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>Type to search...</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_384px] gap-8 h-[calc(100vh-8rem)]">
          {/* Left Column - Chat Sidebar */}
          <DashboardChatSidebar />

          {/* Middle Column - Main Content */}
          <main className="col-span-1 flex flex-col h-full overflow-hidden">
            {/* Header Section */}
            <div className="flex-shrink-0 mb-6">
              <div className="flex items-center justify-between animate-slideIn mb-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 bg-clip-text text-transparent drop-shadow-2xl gradient-animate">Sustainability Watchlist</h1>
                  <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} mt-2 text-lg animate-fadeIn`} style={{animationDelay: '0.2s'}}>Top 10 Companies Leading in ESG & Innovation</p>
                </div>

                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="group relative flex items-center space-x-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-green-500/40 hover:shadow-2xl hover:shadow-green-500/60 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-semibold relative z-10">Add Company</span>
                </button>
              </div>

              {/* Dashboard Search Bar (Navigation) */}
              <div className="animate-slideIn relative group z-40" style={{animationDelay: '0.1s'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search companies to view report..."
                  className={`relative w-full px-6 py-3 ${theme === 'dark' ? 'text-slate-200 bg-slate-800/70 placeholder-slate-400 border-green-500/40' : 'text-slate-800 bg-white border-gray-300 placeholder-slate-500'} backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-lg transition-all duration-300 hover:border-green-500`}
                />
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchQuery && (
                  <div className={`absolute w-full mt-2 rounded-xl shadow-2xl border overflow-hidden max-h-60 overflow-y-auto ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
                    {suggestions.length > 0 ? (
                      suggestions.map((company) => (
                        <div
                          key={company.id}
                          onClick={() => handleNavigateToCompany(company.id)}
                          className={`px-6 py-3 cursor-pointer transition-colors duration-200 flex justify-between items-center ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-gray-50 text-slate-800'}`}
                        >
                          <div>
                            <span className="font-bold">{company.name}</span>
                            <span className={`ml-2 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>({company.id})</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-green-500" />
                        </div>
                      ))
                    ) : (
                      <div className={`px-6 py-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        No matches found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Companies Grid - Scrollable */}
            <div className={`flex-1 overflow-hidden rounded-2xl border ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white/50'} backdrop-blur-sm relative`}>
              <div className="absolute inset-0 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-transparent">
                {watchlist.length === 0 ? (
                  <div className={`flex flex-col items-center justify-center h-full ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    <p className="text-lg">Your watchlist is empty.</p>
                    <p className="text-sm mt-2">Search for companies above to add them.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {watchlist.map((company, idx) => (
                      <Link
                        key={company.id}
                        to={`/report/${company.id}`}
                        className={`group relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-green-500/30' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-green-500/40 transition-all duration-500 p-6 border hover:border-green-500 animate-slideIn hover-lift`}
                        style={{animationDelay: `${0.1 + idx * 0.1}s`}}
                      >
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-emerald-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-emerald-500/5 group-hover:to-green-500/10 transition-all duration-500"></div>
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        </div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-700'} group-hover:text-green-500 transition-all duration-300`}>
                              {company.name}
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} transition-colors duration-300`}>{company.industry}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-green-500/40 group-hover:shadow-green-500/60 transition-all duration-300 group-hover:scale-105">
                              {company.id}
                            </span>
                            <button
                              onClick={(e) => removeFromWatchlist(e, company.id)}
                              className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-red-500/20 text-slate-400 hover:text-red-400' : 'hover:bg-red-100 text-slate-400 hover:text-red-600'} transition-all duration-300 z-20`}
                              title="Remove from watchlist"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                          <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50' : 'bg-gray-50 border-gray-200'} border group-hover:border-green-500/40 transition-all duration-300`}>
                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'} mb-1 uppercase tracking-wider font-semibold`}>Stock Price</p>
                            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'} group-hover:text-green-600 transition-colors duration-300`}>${company.stock_price}</p>
                          </div>
                          <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50' : 'bg-gray-50 border-gray-200'} border group-hover:border-green-500/40 transition-all duration-300`}>
                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'} mb-1 uppercase tracking-wider font-semibold`}>GII Score</p>
                            <div className="flex items-center space-x-2">
                              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} transition-all duration-300`}>{company.gii_score}</p>
                              <span className={`text-xs ${theme === 'dark' ? 'bg-green-500/20 text-green-300 border-green-500/40' : 'bg-green-100 text-green-700 border-green-300'} px-2.5 py-1 rounded-md border font-semibold`}>
                                {company.esg_rating}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={`flex items-center justify-between pt-4 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'} group-hover:border-green-500/40 transition-colors duration-300 relative z-10`}>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} group-hover:scale-110 transition-transform duration-300`} />
                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} transition-colors duration-300 font-medium`}>Performance Trend</span>
                          </div>
                          <div className="transform group-hover:scale-110 transition-transform duration-300">
                            <Sparkline trend={company.gii_score > 85 ? 'up' : 'down'} />
                          </div>
                        </div>

                        <div className="mt-4 relative z-10">
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'} line-clamp-2 transition-colors duration-300 leading-relaxed`}>
                            {company.sustainability_update}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Right Column - Live News */}
          <aside className="w-full lg:w-auto animate-slideIn" style={{animationDelay: '0.3s'}}>
            <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border-green-500/30' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-2xl shadow-xl p-6 border`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent' : 'text-green-700'}`}>Live News Feed</h2>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-lg shadow-green-500/50"></span>
                </span>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-transparent">
                {news.map((article, idx) => (
                  <div
                    key={article.id}
                    className={`group relative p-4 ${theme === 'dark' ? 'bg-slate-800/60 border-green-500/30' : 'bg-gray-50 border-gray-200'} backdrop-blur-sm border rounded-xl hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 cursor-pointer animate-slideIn overflow-hidden hover-lift`}
                    style={{animationDelay: `${0.4 + idx * 0.05}s`}}
                  >
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    <div className="flex items-start justify-between mb-2 relative z-10">
                      <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all duration-300 ${article.sentiment === 'Positive' ? theme === 'dark' ? 'bg-green-500/20 text-green-300 border-green-500/40' : 'bg-green-100 text-green-700 border-green-300' : article.sentiment === 'Negative' ? theme === 'dark' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-red-100 text-red-700 border-red-300' : theme === 'dark' ? 'bg-slate-700/50 text-slate-300 border-slate-600/40' : 'bg-gray-200 text-gray-700 border-gray-300'}`}>
                        {article.sentiment}
                      </span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'} transition-colors duration-300`}>{formatDate(article.date)}</span>
                    </div>
                    
                    <h4 className={`font-bold ${theme === 'dark' ? 'text-slate-200 group-hover:text-green-300' : 'text-slate-800 group-hover:text-green-700'} mb-2 transition-colors duration-300 line-clamp-2 relative z-10`}>
                      {article.title}
                    </h4>
                    
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} mb-3 line-clamp-2 transition-colors duration-300 relative z-10`}>
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs relative z-10">
                      <span className={`${theme === 'dark' ? 'text-slate-500 group-hover:text-green-400' : 'text-slate-600 group-hover:text-green-600'} transition-colors duration-300 font-medium`}>{article.source}</span>
                      <ExternalLink className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


