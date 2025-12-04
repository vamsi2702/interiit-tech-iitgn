import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Plus, ExternalLink } from 'lucide-react';
import companiesData from '../data/companies.json';
import newsData from '../data/news.json';
import DashboardChatSidebar from '../components/DashboardChatSidebar';

const Dashboard = () => {
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
        return 'bg-cyan-100 text-cyan-800';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_384px] gap-8">
          {/* Left Column - Chat Sidebar */}
          <DashboardChatSidebar />

          {/* Middle Column - Main Content */}
          <main className="col-span-1">
            <div className="sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-slate-800/50 pr-2">
            <div className="mb-6 flex items-center justify-between animate-slideIn">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 bg-clip-text text-transparent drop-shadow-2xl gradient-animate">Sustainability Watchlist</h1>
                <p className="text-slate-400 mt-2 text-lg animate-fadeIn" style={{animationDelay: '0.2s'}}>Top 10 Companies Leading in ESG & Innovation</p>
              </div>

              <button className="group relative flex items-center space-x-2 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/60 transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold relative z-10">Add Company</span>
              </button>
            </div>

            {/* Dashboard Search Bar */}
            <div className="mb-6 animate-slideIn relative group" style={{animationDelay: '0.1s'}}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies or industries..."
                className="relative w-full px-6 py-3 text-slate-200 bg-slate-800/60 backdrop-blur-xl border border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-slate-800/80 placeholder-slate-400 shadow-xl transition-all duration-300 hover:border-cyan-400/60"
              />
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 gap-6">
              {filteredCompanies.map((company, idx) => (
                <Link
                  key={company.id}
                  to={`/report/${company.id}`}
                  className="group relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 p-6 border border-cyan-500/30 hover:border-cyan-400/60 animate-slideIn hover-lift"
                  style={{animationDelay: `${0.2 + idx * 0.1}s`}}
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-teal-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:via-teal-500/5 group-hover:to-cyan-500/10 transition-all duration-500"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-cyan-300 group-hover:text-cyan-400 transition-all duration-300 drop-shadow-lg group-hover:drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">
                        {company.name}
                      </h3>
                      <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{company.industry}</p>
                    </div>
                    <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-cyan-500/40 group-hover:shadow-cyan-500/60 transition-all duration-300 group-hover:scale-105 animate-pulse-slow">
                      {company.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 group-hover:border-cyan-500/30 transition-all duration-300">
                      <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Stock Price</p>
                      <p className="text-2xl font-bold text-slate-200 group-hover:text-cyan-300 transition-colors duration-300">${company.stock_price}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 group-hover:border-cyan-500/30 transition-all duration-300">
                      <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">GII Score</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-cyan-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(52,211,153,0.8)] transition-all duration-300">{company.gii_score}</p>
                        <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-md border border-cyan-500/40 group-hover:bg-cyan-500/30 transition-colors duration-300 font-semibold">
                          {company.esg_rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 group-hover:border-cyan-500/30 transition-colors duration-300 relative z-10">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)] group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 font-medium">Performance Trend</span>
                    </div>
                    <div className="transform group-hover:scale-110 transition-transform duration-300">
                      <Sparkline trend={company.gii_score > 85 ? 'up' : 'down'} />
                    </div>
                  </div>

                  <div className="mt-4 relative z-10">
                    <p className="text-xs text-slate-500 group-hover:text-slate-400 line-clamp-2 transition-colors duration-300 leading-relaxed">
                      {company.sustainability_update}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            </div>
          </main>

          {/* Right Column - Live News */}
          <aside className="w-full lg:w-auto animate-slideIn" style={{animationDelay: '0.3s'}}>
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sticky top-24 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Live News Feed</h2>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-lg shadow-cyan-500/50"></span>
                </span>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-slate-800/50">
                {news.map((article, idx) => (
                  <div
                    key={article.id}
                    className="group relative p-4 bg-slate-800/60 backdrop-blur-sm border border-cyan-500/30 rounded-xl hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer animate-slideIn overflow-hidden hover-lift"
                    style={{animationDelay: `${0.4 + idx * 0.05}s`}}
                  >
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    <div className="flex items-start justify-between mb-2 relative z-10">
                      <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all duration-300 ${article.sentiment === 'Positive' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 group-hover:bg-cyan-500/30' : article.sentiment === 'Negative' ? 'bg-red-500/20 text-red-300 border-red-500/40 group-hover:bg-red-500/30' : 'bg-slate-700/50 text-slate-300 border-slate-600/40 group-hover:bg-slate-700/70'}`}>
                        {article.sentiment}
                      </span>
                      <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">{formatDate(article.date)}</span>
                    </div>
                    
                    <h4 className="font-bold text-slate-200 mb-2 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2 relative z-10">
                      {article.title}
                    </h4>
                    
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 mb-3 line-clamp-2 transition-colors duration-300 relative z-10">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs relative z-10">
                      <span className="text-slate-500 group-hover:text-cyan-400 transition-colors duration-300 font-medium">{article.source}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(52,211,153,0.6)]" />
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

