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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_384px] gap-8">
          {/* Left Column - Chat Sidebar */}
          <DashboardChatSidebar />

          {/* Middle Column - Main Content */}
          <main className="col-span-1">
            <div className="sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-slate-800/50 pr-2">
            <div className="mb-6 flex items-center justify-between animate-slideIn">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl">Sustainability Watchlist</h1>
                <p className="text-slate-400 mt-2 text-lg">Top 10 Companies Leading in ESG & Innovation</p>
              </div>

              <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-105 animate-glow">
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Company</span>
              </button>
            </div>

            {/* Dashboard Search Bar */}
            <div className="mb-6 animate-slideIn" style={{animationDelay: '0.1s'}}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies or industries..."
                className="w-full px-6 py-3 text-slate-200 bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 placeholder-slate-500 shadow-lg transition-all"
              />
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 gap-6">
              {filteredCompanies.map((company, idx) => (
                <Link
                  key={company.id}
                  to={`/report/${company.id}`}
                  className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-emerald-500/20 transition-all p-6 border border-emerald-500/20 hover:border-emerald-400/50 group relative overflow-hidden animate-slideIn"
                  style={{animationDelay: `${0.2 + idx * 0.1}s`}}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/5 group-hover:to-green-500/5 transition-all"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="text-xl font-bold text-emerald-300 group-hover:text-emerald-400 transition drop-shadow-lg">
                        {company.name}
                      </h3>
                      <p className="text-sm text-slate-400">{company.industry}</p>
                    </div>
                    <span className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg shadow-emerald-500/30">
                      {company.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                    <div>
                      <p className="text-sm text-slate-500">Stock Price</p>
                      <p className="text-2xl font-bold text-slate-200">${company.stock_price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">GII Score</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">{company.gii_score}</p>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">
                          {company.esg_rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 relative z-10">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                      <span className="text-sm text-slate-400">Performance Trend</span>
                    </div>
                    <Sparkline trend={company.gii_score > 85 ? 'up' : 'down'} />
                  </div>

                  <div className="mt-4 relative z-10">
                    <p className="text-xs text-slate-500 line-clamp-2">
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
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sticky top-24 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Live News Feed</h2>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
                </span>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-slate-800/50">
                {news.map((article, idx) => (
                  <div
                    key={article.id}
                    className="p-4 bg-slate-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-xl hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer group animate-slideIn"
                    style={{animationDelay: `${0.4 + idx * 0.05}s`}}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded-lg border ${article.sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : article.sentiment === 'Negative' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-slate-700/50 text-slate-300 border-slate-600/30'}`}>
                        {article.sentiment}
                      </span>
                      <span className="text-xs text-slate-500">{formatDate(article.date)}</span>
                    </div>
                    
                    <h4 className="font-semibold text-slate-200 mb-2 group-hover:text-emerald-400 transition line-clamp-2">
                      {article.title}
                    </h4>
                    
                    <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{article.source}</span>
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
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
