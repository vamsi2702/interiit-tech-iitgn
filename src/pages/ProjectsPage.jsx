import React from 'react';
import { ExternalLink, MapPin, DollarSign } from 'lucide-react';
import projectsData from '../data/projects.json';

const ProjectsPage = () => {
  const projects = projectsData;

  const getCategoryColor = (category) => {
    const colors = {
      'Forestry': 'bg-green-100 text-green-800',
      'Renewable Energy': 'bg-blue-100 text-blue-800',
      'Blue Carbon': 'bg-cyan-100 text-cyan-800',
      'Community Projects': 'bg-purple-100 text-purple-800',
      'Grassland Conservation': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carbon Credit Projects</h1>
          <p className="text-gray-600 mt-2">
            Browse verified carbon offset projects from around the world. Support sustainable development while reducing your carbon footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200"
            >
              <img 
                src={project.image_url} 
                alt={project.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${getCategoryColor(project.category)}`}>
                    {project.category}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">{project.id}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {project.name}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{project.country}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-gray-500 mr-2">Standard:</span>
                    <span className="font-semibold">{project.methodology}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Price per Credit</span>
                    <span className="text-xl font-bold text-forest-green">${project.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Available</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {project.available_credits.toLocaleString()} credits
                    </span>
                  </div>
                </div>

                <a
                  href={project.buy_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-forest-green text-white py-2 rounded-lg font-semibold hover:bg-eco-green transition flex items-center justify-center space-x-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Purchase Credits</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
