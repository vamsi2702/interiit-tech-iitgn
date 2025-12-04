import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ShoppingCart, Building2, MapPin, Sparkles, Send, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import companiesData from '../data/companies.json';
import projectsData from '../data/projects.json';

const ReportPage = () => {
  const { id } = useParams();
  const [askInput, setAskInput] = React.useState('');
  
  // Check if it's a company or project
  const company = companiesData.find(c => c.id === id);
  const project = projectsData.find(p => p.id === id);
  const isCompany = !!company;
  const isProject = !!project;

  // Dummy data for charts
  const carbonEmissionsData = [
    { year: '2019', emissions: 850, target: 900, industry_avg: 920 },
    { year: '2020', emissions: 780, target: 850, industry_avg: 880 },
    { year: '2021', emissions: 720, target: 800, industry_avg: 840 },
    { year: '2022', emissions: 650, target: 750, industry_avg: 810 },
    { year: '2023', emissions: 580, target: 700, industry_avg: 780 },
    { year: '2024', emissions: 520, target: 650, industry_avg: 750 },
    { year: '2025', emissions: 450, target: 600, industry_avg: 720 },
  ];

  const esgScoresData = [
    { category: 'Environmental', score: 92, industry: 78 },
    { category: 'Social', score: 88, industry: 82 },
    { category: 'Governance', score: 85, industry: 80 },
    { category: 'Innovation', score: 94, industry: 75 },
    { category: 'Community', score: 87, industry: 81 },
  ];

  const renewableEnergyData = [
    { quarter: 'Q1 2024', renewable: 45, fossil: 55 },
    { quarter: 'Q2 2024', renewable: 52, fossil: 48 },
    { quarter: 'Q3 2024', renewable: 61, fossil: 39 },
    { quarter: 'Q4 2024', renewable: 68, fossil: 32 },
    { quarter: 'Q1 2025', renewable: 75, fossil: 25 },
  ];

  const energyMixData = [
    { name: 'Solar', value: 35, color: '#fbbf24' },
    { name: 'Wind', value: 28, color: '#34d399' },
    { name: 'Hydro', value: 12, color: '#60a5fa' },
    { name: 'Natural Gas', value: 18, color: '#f87171' },
    { name: 'Other', value: 7, color: '#a78bfa' },
  ];

  const stockPerformanceData = [
    { month: 'Jul', price: 245, esg_event: null },
    { month: 'Aug', price: 252, esg_event: null },
    { month: 'Sep', price: 268, esg_event: 'Green Bond' },
    { month: 'Oct', price: 271, esg_event: null },
    { month: 'Nov', price: 285, esg_event: 'Net Zero Pledge' },
    { month: 'Dec', price: 298, esg_event: null },
  ];

  const COLORS = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa'];

  if (!company && !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Not Found</h2>
          <p className="text-slate-400 mb-6">The requested company or project could not be found.</p>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleAsk = (e) => {
    e.preventDefault();
    if (!askInput.trim()) return;
    // TODO: Implement RAG query functionality
    console.log('Asking:', askInput);
    setAskInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {isCompany && (
          <>
            {/* COMPANY VIEW */}
            {/* Header Section */}
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8 border border-cyan-500/30 animate-slideIn">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Building2 className="w-10 h-10 text-cyan-400" />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">{company.name}</h1>
                    <span className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {company.id}
                    </span>
                  </div>
                  <p className="text-lg text-slate-400 mb-6">{company.industry}</p>
                  
                  <div className="flex items-center space-x-8">
                    <div>
                      <p className="text-sm text-slate-500">Stock Price</p>
                      <p className="text-3xl font-bold text-slate-200">${company.stock_price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Market Cap</p>
                      <p className="text-3xl font-bold text-slate-200">{company.market_cap}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">ESG Rating</p>
                      <p className="text-3xl font-bold text-cyan-400">{company.esg_rating}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ask About Company - Moved to Top */}
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 mb-8 animate-slideIn" style={{animationDelay: '0.1s'}}>
              <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                Ask about {company.name}
              </h2>
              <form onSubmit={handleAsk} className="flex gap-3">
                <input
                  type="text"
                  value={askInput}
                  onChange={(e) => setAskInput(e.target.value)}
                  placeholder={`Ask anything about ${company.name}...`}
                  className="flex-1 px-6 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200 placeholder-slate-500"
                />
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span className="font-semibold">Ask</span>
                </button>
              </form>
              <p className="text-slate-500 text-xs mt-3">Powered by RAG - Get instant insights about sustainability metrics, financials, and more</p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column - Company Description */}
              <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 animate-slideIn" style={{animationDelay: '0.2s'}}>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  Company Overview
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">{company.description}</p>
                
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>

              {/* Right Column - Insights */}
              <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 animate-slideIn" style={{animationDelay: '0.3s'}}>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">Sustainability Insights</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                    <h3 className="font-semibold text-cyan-300 mb-2">Latest Update</h3>
                    <p className="text-slate-300 text-sm">{company.sustainability_update}</p>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                    <h3 className="font-semibold text-slate-300 mb-2">General Business Insights</h3>
                    <p className="text-slate-400 text-sm">
                      {company.name} continues to demonstrate strong market performance with a focus on sustainable growth and innovation in the {company.industry} sector.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Carbon Emissions Trend */}
              <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 animate-slideIn" style={{animationDelay: '0.4s'}}>
                <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Carbon Emissions Trend
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={carbonEmissionsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #34d399', borderRadius: '8px' }}
                      labelStyle={{ color: '#cbd5e1' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="emissions" stroke="#34d399" strokeWidth={3} name="Actual" dot={{ fill: '#34d399', r: 5 }} />
                    <Line type="monotone" dataKey="target" stroke="#fbbf24" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                    <Line type="monotone" dataKey="industry_avg" stroke="#64748b" strokeWidth={2} name="Industry Avg" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-xs text-slate-400">2025 Emissions</p>
                    <p className="text-xl font-bold text-cyan-400">450M</p>
                    <p className="text-xs text-teal-400">↓ 47%</p>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-xs text-slate-400">vs Target</p>
                    <p className="text-xl font-bold text-cyan-400">75%</p>
                    <p className="text-xs text-slate-400">On Track</p>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-xs text-slate-400">Net Zero</p>
                    <p className="text-xl font-bold text-slate-200">2030</p>
                    <p className="text-xs text-slate-400">5 Years</p>
                  </div>
                </div>
              </div>

              {/* ESG Performance Radar */}
              <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 animate-slideIn" style={{animationDelay: '0.5s'}}>
                <h2 className="text-xl font-bold text-cyan-400 mb-4">ESG Performance Breakdown</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={esgScoresData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="category" stroke="#94a3b8" />
                    <PolarRadiusAxis stroke="#94a3b8" />
                    <Radar name="Company" dataKey="score" stroke="#34d399" fill="#34d399" fillOpacity={0.6} />
                    <Radar name="Industry Avg" dataKey="industry" stroke="#64748b" fill="#64748b" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #34d399', borderRadius: '8px' }}
                      labelStyle={{ color: '#cbd5e1' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Renewable Energy Progress */}
              <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 animate-slideIn" style={{animationDelay: '0.6s'}}>
                <h2 className="text-xl font-bold text-cyan-400 mb-4">Renewable Energy Transition</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={renewableEnergyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="quarter" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #34d399', borderRadius: '8px' }}
                      labelStyle={{ color: '#cbd5e1' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="renewable" stackId="1" stroke="#34d399" fill="#34d399" fillOpacity={0.8} name="Renewable %" />
                    <Area type="monotone" dataKey="fossil" stackId="1" stroke="#f87171" fill="#f87171" fillOpacity={0.6} name="Fossil %" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <p className="text-sm text-cyan-300 font-semibold">Q1 2025: 75% Renewable Energy</p>
                  <p className="text-xs text-slate-400 mt-1">67% increase since Q1 2024</p>
                </div>
              </div>

              {/* Energy Mix Pie Chart */}
              <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 animate-slideIn" style={{animationDelay: '0.7s'}}>
                <h2 className="text-xl font-bold text-cyan-400 mb-4">Current Energy Mix</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={energyMixData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, value}) => `${name}: ${value}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {energyMixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #34d399', borderRadius: '8px' }}
                      labelStyle={{ color: '#cbd5e1' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {energyMixData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                      <span className="text-slate-300">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Performance with ESG Events */}
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 animate-slideIn" style={{animationDelay: '0.8s'}}>
                <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Stock Performance & ESG Milestones
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stockPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #34d399', borderRadius: '8px' }}
                      labelStyle={{ color: '#cbd5e1' }}
                      formatter={(value, name, props) => {
                        if (props.payload.esg_event) {
                          return [value, `Price (ESG Event: ${props.payload.esg_event})`];
                        }
                        return [value, 'Price'];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="price" fill="#34d399" name="Stock Price ($)" radius={[8, 8, 0, 0]}>
                      {stockPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.esg_event ? '#fbbf24' : '#34d399'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-cyan-400"></div>
                    <span className="text-slate-300">Regular Trading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-400"></div>
                    <span className="text-slate-300">ESG Milestone Event</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Future Impact Analysis */}
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 mb-8 animate-slideIn" style={{animationDelay: '0.9s'}}>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Future Impact Analysis
              </h2>
              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl">
                <p className="text-slate-300 leading-relaxed mb-4">
                  Based on current regulatory trends and ESG policy developments, {company.name} is well-positioned to benefit from upcoming carbon pricing mechanisms and renewable energy incentives. Our AI-powered analysis suggests that stricter environmental regulations could positively impact the stock price by 8-12% over the next 18 months, as the company's strong ESG ratings provide competitive advantages in accessing green financing and attracting institutional investors.
                </p>
                <p className="text-slate-400 text-sm">
                  Key factors: Carbon border adjustment mechanisms, renewable energy mandates, and increased disclosure requirements are expected to favor companies with robust sustainability frameworks like {company.name}.
                </p>
              </div>
            </div>
          </>
        )}

        {isProject && (
          <>
            {/* PROJECT VIEW */}
            {/* Header Section */}
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8 border border-cyan-500/30 animate-slideIn">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">{project.name}</h1>
                    <span className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {project.id}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 text-sm font-semibold">
                        {project.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                      <span className="text-lg">{project.country}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Details Card */}
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 animate-slideIn" style={{animationDelay: '0.1s'}}>
                <h2 className="text-2xl font-bold text-cyan-400 mb-6">Project Details</h2>
                
                {project.image_url && (
                  <img 
                    src={project.image_url} 
                    alt={project.name}
                    className="w-full h-64 object-cover rounded-xl mb-6 border border-cyan-500/20"
                  />
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">Description</h3>
                    <p className="text-slate-300 leading-relaxed">{project.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Methodology</p>
                      <p className="text-lg font-semibold text-slate-200">{project.methodology}</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Vintage</p>
                      <p className="text-lg font-semibold text-slate-200">{project.vintage}</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Country</p>
                      <p className="text-lg font-semibold text-slate-200">{project.country}</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Category</p>
                      <p className="text-lg font-semibold text-slate-200">{project.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Data & Actions */}
              <div className="space-y-6">
                {/* Market Data */}
                <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 animate-slideIn" style={{animationDelay: '0.2s'}}>
                  <h2 className="text-xl font-bold text-cyan-400 mb-4">Market Data</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/40 rounded-xl">
                      <p className="text-sm text-slate-400 mb-1">Price per Credit</p>
                      <p className="text-4xl font-bold text-cyan-400">${project.price}</p>
                    </div>
                    
                    <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                      <p className="text-sm text-slate-400 mb-1">Available Credits</p>
                      <p className="text-2xl font-bold text-slate-200">{project.available_credits.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action Area */}
                <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 animate-slideIn" style={{animationDelay: '0.3s'}}>
                  <a 
                    href={project.buy_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <button className="w-full bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3 animate-glow">
                      <ShoppingCart className="w-6 h-6" />
                      <span>Buy/Sell on CarbonMarket</span>
                    </button>
                  </a>
                  <p className="text-slate-500 text-xs mt-3 text-center">Securely trade carbon credits on Carbonmark</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportPage;

