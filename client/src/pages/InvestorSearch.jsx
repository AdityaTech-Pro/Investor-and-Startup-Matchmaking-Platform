import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import Navbar from '../components/Navbar';
import axios from 'axios';
import AIMatchingResults from '../components/AIMatchingResults';

const industries = [
  { label: 'All', value: 'all' },
  { label: 'Fintech', value: 'fintech' },
  { label: 'HealthTech', value: 'healthtech' },
  { label: 'AI', value: 'ai' },
  { label: 'EdTech', value: 'edtech' },
  { label: 'E-commerce', value: 'ecommerce' },
  { label: 'SaaS', value: 'saas' },
  { label: 'Blockchain', value: 'blockchain' },
  { label: 'CleanTech', value: 'cleantech' },
  { label: 'AgriTech', value: 'agritech' },
  { label: 'Consumer', value: 'consumer' },
  { label: 'Web3', value: 'web3' },
  { label: 'IoT', value: 'iot' },
];

function InvestorSearch() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('all');
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiMatching, setAiMatching] = useState(false);
  const [aiMatches, setAiMatches] = useState(null);
  const [showMatches, setShowMatches] = useState(false);
  const [totalProfilesAnalyzed, setTotalProfilesAnalyzed] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestors = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/forms/investor-form');
        setInvestors(res.data);
      } catch (err) {
        setError('Failed to load investors.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvestors();
  }, []);

  const filteredInvestors = investors.filter((investor) => {
    // Industry filter - check if any of the investor's preferred industries match the selected industry
    const matchesIndustry = industry === 'all' || 
      (investor.preferredIndustries && 
       investor.preferredIndustries.some(invIndustry => 
         invIndustry.toLowerCase().includes(industry.toLowerCase())
       ));
    
    // Search filter - check name, type, and organization
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (investor.fullName && investor.fullName.toLowerCase().includes(searchLower)) ||
      (investor.investorType && investor.investorType.toLowerCase().includes(searchLower)) ||
      (investor.organization && investor.organization.toLowerCase().includes(searchLower)) ||
      (investor.preferredIndustries && 
       investor.preferredIndustries.some(invIndustry => 
         invIndustry.toLowerCase().includes(searchLower)
       ));
    
    return matchesIndustry && matchesSearch;
  });

  const handleAIMatching = async () => {
    setAiMatching(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user || !user._id) {
        setError('Please log in to use AI matchmaking');
        return;
      }

      console.log('Attempting AI matching for user:', user._id);
      
      // Use the correct endpoint that works with startup profiles
      const response = await axios.get(`http://localhost:5000/api/forms/matched-investors/${user._id}`);
      
      console.log('AI matching response:', response.data);
      
      if (response.data.success) {
        setAiMatches(response.data.matches);
        setTotalProfilesAnalyzed(response.data.totalProfilesAnalyzed || response.data.matches.length);
        setShowMatches(true);
      } else {
        setError(response.data.message || 'AI matchmaking failed');
      }
    } catch (err) {
      console.error('AI Matching failed:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      if (err.response?.status === 404) {
        setError('Server endpoint not found. Please check if the server is running.');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please ensure the server is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'AI matchmaking failed. Please try again.');
      }
    } finally {
      setAiMatching(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <Navbar userType="startup" />

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">Discover Potential Investors</h1>
          <p className="text-lg text-gray-300 mb-8">Connect with investors who match your startup's needs and vision.</p>
          <div className="search-bar max-w-xl mx-auto flex bg-white rounded-full overflow-hidden shadow-lg mb-6">
            <input
              type="text"
              className="flex-1 px-6 py-3 text-gray-700 outline-none"
              placeholder="Search investors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="bg-indigo-700 text-white px-6 py-3 font-bold hover:bg-indigo-900 transition">Search</button>
          </div>

          {/* AI Matchmaking Button */}
          <button
            onClick={handleAIMatching}
            disabled={aiMatching}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {aiMatching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                AI Analyzing...
              </>
            ) : (
              <>
                🤖 Find My Perfect Investors with AI
              </>
            )}
          </button>
        </section>

        {/* Filters */}
        <section className="filters bg-white/10 py-8 border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="filter-buttons flex gap-4 flex-wrap justify-center">
              {industries.map((item) => (
                <button
                  key={item.value}
                  className={`filter-btn px-4 py-2 rounded-full border text-sm font-medium transition ${industry === item.value ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                  onClick={() => setIndustry(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* AI Matching Results Modal */}
        {showMatches && aiMatches && (
          <AIMatchingResults
            matches={aiMatches}
            userRole="startup"
            onClose={() => setShowMatches(false)}
            totalProfilesAnalyzed={totalProfilesAnalyzed}
          />
        )}

        {/* Investors Grid */}
        <section className="investors-grid py-12">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-3xl font-semibold mb-8 text-white">
              {showMatches ? 'All Investors' : 'Featured Investors'}
            </h2>
            {loading ? (
              <div className="text-center text-lg text-gray-300">Loading investors...</div>
            ) : error ? (
              <div className="text-center text-lg text-red-400">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredInvestors.map((investor) => (
                  <div key={investor._id} className="investor-card bg-white/10 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden">
                    <div className="card-image h-48 flex items-center justify-center bg-gradient-to-r from-indigo-400 to-purple-500 text-white text-2xl font-bold">
                      {investor.fullName ? investor.fullName.split(' ').map(word => word[0]).join('') : 'I'}
                    </div>
                    <div className="card-content p-6">
                      <div className="card-title text-xl font-semibold mb-2 text-white">{investor.fullName}</div>
                      <div className="card-focus text-purple-300 mb-2">{investor.investorType}</div>
                      <div className="card-description text-gray-300 mb-4">{investor.organization}</div>
                      <div className="card-meta flex justify-between items-center mb-4">
                        <span className="industry-tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">{investor.preferredIndustries && investor.preferredIndustries.join(', ')}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/investordetails/${investor._id}`)}
                        className="view-details-btn w-full bg-indigo-700 text-white py-2 rounded-lg font-semibold hover:bg-indigo-900 transition block text-center mt-2"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      {/* Footer */}
      <footer className="text-center text-sm py-6 bg-black/70 border-t border-gray-700 relative z-10">
        © {new Date().getFullYear()} Chatiao. All rights reserved.
      </footer>
    </div>
  );
}

export default InvestorSearch;