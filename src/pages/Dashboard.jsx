import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Plus, ExternalLink } from 'lucide-react';
import companiesData from '../data/companies.json';
import newsData from '../data/news.json';
import DashboardChatSidebar from '../components/DashboardChatSidebar';
import { ThemeContext } from '../App';

const Dashboard = () => {
  const { theme } = React.useContext(ThemeContext);
  const companies = companiesData;
  const news = newsData;

  const [searchQuery, setSearchQuery] = React.useState('');

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

  const filteredCompanies = companies.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      (c.industry || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'} relative`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_384px] gap-8">
          {/* Left Column - Chat Sidebar */}
          <DashboardChatSidebar />

          {/* Middle Column - Main Content */}
          <main className="col-span-1">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between animate-slideIn mb-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 bg-clip-text text-transparent drop-shadow-2xl gradient-animate">Sustainability Watchlist</h1>
                  <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} mt-2 text-lg animate-fadeIn`} style={{animationDelay: '0.2s'}}>Top 10 Companies Leading in ESG & Innovation</p>
                </div>

                <button className="group relative flex items-center gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-green-500/50 hover:shadow-2xl hover:shadow-green-500/70 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] overflow-hidden border border-green-500/50">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                  
                  {/* Icon with enhanced animation */}
                  <div className="relative z-10 bg-white/20 p-1 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                    <Plus className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                  
                  <span className="relative z-10 tracking-wide">Add Company</span>
                  
                  {/* Pulse effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-green-400/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                </button>
              </div>

              {/* Dashboard Search Bar */}
              <div className="animate-slideIn relative group" style={{animationDelay: '0.1s'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search companies or industries..."
                  className={`relative w-full px-6 py-3 ${theme === 'dark' ? 'text-slate-200 bg-slate-800/70 placeholder-slate-400 border-green-500/40' : 'text-slate-800 bg-white border-gray-300 placeholder-slate-500'} backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-lg transition-all duration-300 hover:border-green-500`}
                />
              </div>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 gap-6">
              {filteredCompanies.map((company, idx) => (
                <Link
                  key={company.id}
                  to={`/report/${company.id}`}
                  className={`group relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-green-500/30' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-green-500/40 transition-all duration-500 p-6 border hover:border-green-500 animate-slideIn hover-lift`}
                  style={{animationDelay: `${0.2 + idx * 0.1}s`}}
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
                    <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-green-500/40 group-hover:shadow-green-500/60 transition-all duration-300 group-hover:scale-105">
                      {company.id}
                    </span>
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

              <div className="space-y-4">
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


