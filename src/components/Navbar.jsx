import React from 'react';
import { Search, Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // In a real app, this would filter or navigate to search results
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <Leaf className="w-8 h-8 text-forest-green" />
            <span className="text-2xl font-bold text-forest-green">Our Kyzeel</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search company/project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-forest-green font-medium transition"
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className="text-gray-700 hover:text-forest-green font-medium transition"
            >
              Projects
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
