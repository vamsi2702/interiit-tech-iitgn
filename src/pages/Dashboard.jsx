import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Plus, ExternalLink } from 'lucide-react';
import companiesData from '../data/companies.json';
import newsData from '../data/news.json';

const Dashboard = () => {
  const companies = companiesData;
  const news = newsData;

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content - Watchlist */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sustainability Watchlist</h1>
                <p className="text-gray-600 mt-1">Top 10 Companies Leading in ESG & Innovation</p>
              </div>
              <button className="flex items-center space-x-2 bg-forest-green text-white px-4 py-2 rounded-lg hover:bg-eco-green transition shadow-md">
                <Plus className="w-5 h-5" />
                <span>Add Company</span>
              </button>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  to={`/report/${company.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border border-gray-200 hover:border-forest-green group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-forest-green transition">
                        {company.name}
                      </h3>
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    </div>
                    <span className="bg-forest-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {company.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Stock Price</p>
                      <p className="text-2xl font-bold text-gray-900">${company.stock_price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">GII Score</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-forest-green">{company.gii_score}</p>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {company.esg_rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Performance Trend</span>
                    </div>
                    <Sparkline trend={company.gii_score > 85 ? 'up' : 'down'} />
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {company.sustainability_update}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar - Live News */}
          <div className="w-96">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Live News Feed</h2>
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {news.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-forest-green transition cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${getSentimentColor(article.sentiment)}`}>
                        {article.sentiment}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(article.date)}</span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-forest-green transition line-clamp-2">
                      {article.title}
                    </h4>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.source}</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
