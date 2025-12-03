import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink, ShoppingCart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import companiesData from '../data/companies.json';
import projectsData from '../data/projects.json';

const ReportPage = () => {
  const { id } = useParams();
  const company = companiesData.find(c => c.id === id);
  
  // Get a relevant project (for demo, we'll pick one based on company's industry)
  const relevantProject = projectsData[Math.floor(Math.random() * projectsData.length)];

  // Generate dummy carbon emission data
  const carbonData = [
    { year: '2019', emissions: 850, target: 900 },
    { year: '2020', emissions: 780, target: 850 },
    { year: '2021', emissions: 720, target: 800 },
    { year: '2022', emissions: 650, target: 750 },
    { year: '2023', emissions: 580, target: 700 },
    { year: '2024', emissions: 520, target: 650 },
    { year: '2025', emissions: 450, target: 600 },
  ];

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h2>
          <Link to="/" className="text-forest-green hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Calculate market sentiment based on GII score
  const marketSentiment = company.gii_score >= 85 ? 'Positive' : company.gii_score >= 75 ? 'Neutral' : 'Negative';
  const sentimentColor = marketSentiment === 'Positive' ? 'bg-green-500' : marketSentiment === 'Neutral' ? 'bg-yellow-500' : 'bg-red-500';
  const trendIcon = marketSentiment === 'Positive' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-forest-green hover:text-eco-green mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">{company.name}</h1>
                <span className="bg-forest-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {company.id}
                </span>
              </div>
              <p className="text-lg text-gray-600 mb-4">{company.industry}</p>
              
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-sm text-gray-600">GII Score</p>
                  <p className="text-3xl font-bold text-forest-green">{company.gii_score}/100</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ESG Rating</p>
                  <p className="text-3xl font-bold text-gray-900">{company.esg_rating}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Market Cap</p>
                  <p className="text-3xl font-bold text-gray-900">${company.market_cap}</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">Market Sentiment</p>
              <div className={`${sentimentColor} text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-md`}>
                {trendIcon}
                <span className="font-bold text-lg">{marketSentiment}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Analysis */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Overview</h2>
              <p className="text-gray-700 leading-relaxed">{company.description}</p>
              
              <div className="mt-6 p-4 bg-green-50 border-l-4 border-forest-green rounded">
                <h3 className="font-semibold text-gray-900 mb-2">Latest Sustainability Update</h3>
                <p className="text-gray-700">{company.sustainability_update}</p>
              </div>
            </div>

            {/* Carbon Emissions Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Carbon Emission Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={carbonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: 'CO₂ (Million Tonnes)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="emissions" 
                    stroke="#228B22" 
                    strokeWidth={3}
                    name="Actual Emissions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target Emissions"
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">2025 Emissions</p>
                  <p className="text-2xl font-bold text-gray-900">450M</p>
                  <p className="text-xs text-green-600">↓ 13% YoY</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Target Achievement</p>
                  <p className="text-2xl font-bold text-forest-green">75%</p>
                  <p className="text-xs text-gray-600">On Track</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Net Zero Target</p>
                  <p className="text-2xl font-bold text-gray-900">2030</p>
                  <p className="text-xs text-gray-600">5 Years</p>
                </div>
              </div>
            </div>

            {/* Sustainability Insights */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI-Generated Sustainability Insights</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <h3 className="font-semibold text-gray-900 mb-2">🎯 Performance Analysis</h3>
                  <p className="text-gray-700">
                    {company.name} demonstrates exceptional commitment to sustainability with a GII score of {company.gii_score}. 
                    The company has successfully reduced carbon emissions by 47% since 2019, surpassing industry benchmarks 
                    and aligning with Paris Agreement targets.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                  <h3 className="font-semibold text-gray-900 mb-2">✅ Key Strengths</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Leading ESG rating of {company.esg_rating} in the {company.industry} sector</li>
                    <li>Comprehensive renewable energy transition strategy</li>
                    <li>Transparent carbon accounting and third-party verification</li>
                    <li>Active investment in carbon removal technologies</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <h3 className="font-semibold text-gray-900 mb-2">🔮 Future Outlook</h3>
                  <p className="text-gray-700">
                    Based on current trajectory and announced initiatives, {company.name} is well-positioned to achieve 
                    net-zero emissions by 2030. Continued focus on supply chain decarbonization and renewable energy 
                    procurement will be critical for maintaining leadership position.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Project Integration */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Offset Carbon Footprint</h2>
              
              <div className="mb-6">
                <img 
                  src={relevantProject.image_url} 
                  alt={relevantProject.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                
                <h3 className="font-bold text-gray-900 mb-2">{relevantProject.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{relevantProject.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold">{relevantProject.country}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold">{relevantProject.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Methodology:</span>
                    <span className="font-semibold">{relevantProject.methodology}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vintage:</span>
                    <span className="font-semibold">{relevantProject.vintage}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price per Credit</span>
                    <span className="text-2xl font-bold text-forest-green">${relevantProject.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Available Credits</span>
                    <span className="font-semibold text-gray-900">{relevantProject.available_credits.toLocaleString()}</span>
                  </div>
                </div>

                <button className="w-full bg-forest-green text-white py-3 rounded-lg font-semibold hover:bg-eco-green transition flex items-center justify-center space-x-2 shadow-md">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Buy Carbon Credits</span>
                </button>

                <a 
                  href={relevantProject.buy_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full flex items-center justify-center space-x-2 text-forest-green hover:text-eco-green transition"
                >
                  <span className="text-sm">View on Carbonmark</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span className="text-sm text-gray-700">Carbon Reduced</span>
                    <span className="font-bold text-forest-green">2.1M tonnes</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <span className="text-sm text-gray-700">Communities Served</span>
                    <span className="font-bold text-blue-700">35,000+</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                    <span className="text-sm text-gray-700">Project Duration</span>
                    <span className="font-bold text-purple-700">30 years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
