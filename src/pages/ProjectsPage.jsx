import React from 'react';
import { ExternalLink, MapPin, DollarSign, Search, Sparkles, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import projectsData from '../data/projects.json';

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  
  const projects = projectsData;

  // Mock semantic search - replace with actual vector DB search later
  const performSemanticSearch = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Semantic search simulation - matches against description, category, location, methodology
    const searchTerms = query.toLowerCase().split(' ');
    const scored = projects.map(project => {
      let score = 0;
      const searchableText = `${project.name} ${project.description} ${project.category} ${project.country} ${project.methodology}`.toLowerCase();
      
      searchTerms.forEach(term => {
        if (searchableText.includes(term)) {
          score += 1;
          // Boost for exact matches in name or category
          if (project.name.toLowerCase().includes(term)) score += 2;
          if (project.category.toLowerCase().includes(term)) score += 1.5;
        }
      });
      
      return { ...project, score };
    });

    const filtered = scored
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setSuggestions(filtered);
    setIsSearching(false);
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        performSemanticSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const categories = ['All', ...new Set(projects.map(p => p.category))];

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      'Forestry': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'Renewable Energy': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Blue Carbon': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Community Projects': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Grassland Conservation': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };
    return colors[category] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slideIn">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent mb-3">
            Carbon Credit Projects
          </h1>
          <p className="text-slate-400 text-lg">
            Browse verified carbon offset projects from around the world. Support sustainable development while reducing your carbon footprint.
          </p>
        </div>

        {/* Semantic Search Bar */}
        <div className="mb-8 animate-slideIn" style={{animationDelay: '0.1s'}}>
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-emerald-500/30">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h2 className="text-xl font-bold text-emerald-400">Find Your Perfect Carbon Project</h2>
            </div>
            
            <div className="relative">
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
                  placeholder="Search by project type, location, methodology, or keywords..."
                  className="w-full px-6 py-3 pl-12 pr-12 text-slate-200 bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 placeholder-slate-500 shadow-lg transition-all"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-emerald-400" />
                {isSearching && (
                  <Sparkles className="absolute right-4 top-3.5 w-5 h-5 text-emerald-400 animate-spin" />
                )}
              </div>

              {/* Semantic Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-slate-800/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden animate-slideIn z-50">
                  <div className="p-2 border-b border-emerald-500/20 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-semibold">Semantic Search Results</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-slate-800/50">
                    {suggestions.map((project) => (
                      <Link
                        key={project.id}
                        to={`/report/${project.id}`}
                        className="block px-4 py-3 hover:bg-slate-700/50 transition-all border-b border-slate-700/30 last:border-b-0 group"
                      >
                        <div className="flex items-start gap-3">
                          <img 
                            src={project.image_url} 
                            alt={project.name}
                            className="w-16 h-16 object-cover rounded-lg border border-emerald-500/20"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-slate-200 group-hover:text-emerald-400 transition line-clamp-1">
                                {project.name}
                              </h3>
                              <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 whitespace-nowrap">
                                {project.id}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryColor(project.category)}`}>
                                {project.category}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <MapPin className="w-3 h-3" />
                                {project.country}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{project.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm font-bold text-emerald-400">${project.price}/credit</span>
                              <span className="text-xs text-slate-500">{project.available_credits.toLocaleString()} available</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-900/50 border-t border-emerald-500/20 text-center">
                    <p className="text-xs text-slate-500">Click on a project to view full details and purchase on Carbonmark</p>
                  </div>
                </div>
              )}
            </div>

            <p className="text-slate-500 text-xs mt-3">Powered by semantic search - searches across project descriptions, locations, and methodologies</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-3 animate-slideIn" style={{animationDelay: '0.2s'}}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat 
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/30' 
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-emerald-500/30 hover:text-emerald-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-emerald-500/20 transition-all overflow-hidden border border-emerald-500/20 hover:border-emerald-400/50 group animate-slideIn"
              style={{animationDelay: `${0.3 + idx * 0.05}s`}}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image_url} 
                  alt={project.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-emerald-500/30">
                  <span className="text-xs text-slate-300 font-mono">{project.id}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-3 py-1 rounded-lg font-semibold border ${getCategoryColor(project.category)}`}>
                    {project.category}
                  </span>
                  <span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded">
                    {project.vintage}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-200 group-hover:text-emerald-400 transition mb-2 line-clamp-2">
                  {project.name}
                </h3>

                <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-300">
                    <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                    <span>{project.country}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Award className="w-4 h-4 mr-2 text-emerald-400" />
                    <span className="font-semibold">{project.methodology}</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-emerald-500/20 p-4 rounded-xl mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Price per Credit</span>
                    <span className="text-2xl font-bold text-emerald-400">${project.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Available</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {project.available_credits.toLocaleString()} credits
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/report/${project.id}`}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-600 text-slate-200 py-2.5 rounded-lg font-semibold hover:from-slate-600 hover:to-slate-500 transition-all flex items-center justify-center space-x-2 border border-slate-600"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>View Full Details</span>
                  </Link>

                  <a
                    href={project.buy_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center space-x-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Buy on Carbonmark</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
