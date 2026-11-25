import { useParams, useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function StartupsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStartup = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:5000/api/forms/startup-form/${id}`);
        setStartup(res.data);
      } catch (err) {
        setError('Failed to load startup details.');
      } finally {
        setLoading(false);
      }
    };
    fetchStartup();
  }, [id]);

  if (loading) {
    return <div className="text-center text-lg text-gray-300 min-h-screen flex items-center justify-center">Loading startup details...</div>;
  }
  if (error || !startup) {
    return <div className="text-center text-lg text-red-400 min-h-screen flex items-center justify-center">{error || 'Startup not found.'}</div>;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <Navbar userType="investor" />

        {/* Breadcrumb */}
        <div className="breadcrumb bg-white/10 py-4 border-b border-gray-700 px-4">
          <div className="container mx-auto">
            <button onClick={() => navigate('/investor-dashboard')} className="text-indigo-300 hover:underline mr-2 bg-transparent">Home</button>
            <span className="text-gray-400">/</span>
            <span className="ml-2 text-white font-semibold">{startup.startupName}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="startup-hero py-12 border-b border-gray-700">
          <div className="container mx-auto grid md:grid-cols-3 gap-12 items-start px-4">
            {/* Main Info */}
            <div className="md:col-span-2">
              <div className="startup-logo w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl mb-6">
                {startup.startupName ? startup.startupName.split(' ').map(word => word[0]).join('') : 'S'}
              </div>
              <div className="startup-title text-3xl font-bold mb-2 text-white">{startup.startupName}</div>
              <div className="startup-tagline text-lg text-gray-300 mb-6">{startup.problemStatement}</div>
              <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.startupStage}</div>
                  <div className="stat-label text-gray-300 mt-1">Stage</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.headquarters}</div>
                  <div className="stat-label text-gray-300 mt-1">Location</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.teamSize}</div>
                  <div className="stat-label text-gray-300 mt-1">Team Size</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{startup.monthlyRevenue}</div>
                  <div className="stat-label text-gray-300 mt-1">Monthly Revenue</div>
                </div>
              </div>
            </div>
            {/* Investment Card */}
            <div className="investment-card bg-white/10 border-2 border-gray-700 rounded-xl p-8 shadow-md sticky top-8">
              <div className="investment-title text-lg font-semibold mb-4 text-white">Investment Opportunity</div>
              <div className="funding-progress mb-6">
                <div className="funding-stats flex justify-between mb-2">
                  <div className="funding-stat text-center">
                    <div className="funding-value text-lg font-bold text-white">{startup.fundingAmount}</div>
                    <div className="funding-label text-gray-300 text-xs">Funding Needed</div>
                  </div>
                  <div className="funding-stat text-center">
                    <div className="funding-value text-lg font-bold text-white">{startup.fundingRoundType}</div>
                    <div className="funding-label text-gray-300 text-xs">Round Type</div>
                  </div>
                </div>
              </div>
              <button className="interest-btn w-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition mb-2">Express Interest</button>
              <div className="investment-info text-xs text-gray-300 text-center">No commitment required. Expressing interest helps us connect you with the startup.</div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="content-section bg-white/10 my-8 p-8 rounded-xl shadow-md container mx-auto">
          <div className="section-title text-2xl font-semibold mb-4 text-white">About</div>
          <div className="section-content text-gray-200 mb-8">{startup.productDescription}</div>
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Problem Statement</div>
          <div className="section-content text-gray-200 mb-8">{startup.problemStatement}</div>
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Business Model</div>
          <div className="section-content text-gray-200 mb-8">{startup.businessModel}</div>

          {/* Pitch Deck Section */}
          {startup.pitchDeck && (
            <div className="mb-8">
              <div className="section-title text-2xl font-semibold mb-4 text-white">Pitch Deck</div>
              <div className="bg-white/5 border border-white/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">{startup.pitchDeck.originalName}</div>
                      <div className="text-gray-400 text-sm">
                        {(startup.pitchDeck.size / 1024 / 1024).toFixed(2)} MB •
                        Uploaded {new Date(startup.pitchDeck.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`http://localhost:5000/api/forms/startup-form/${startup._id}/pitch-deck`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-violet-700 transition flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          )}
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Industry</div>
          <div className="section-content text-gray-200 mb-8">{startup.industry && startup.industry.join(', ')}</div>
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Team</div>
          <div className="section-content text-gray-200 mb-8">
            <p><strong>Founders:</strong> {startup.founderNames}</p>
            <p><strong>Team Size:</strong> {startup.teamSize}</p>
            <p><strong>Number of Founders:</strong> {startup.numberOfFounders}</p>
          </div>
          
          <div className="section-title text-2xl font-semibold mb-4 text-white">Traction</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.monthlyRevenue}</div>
              <div className="text-xs text-gray-300 mt-1">Monthly Revenue</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.activeUsers}</div>
              <div className="text-xs text-gray-300 mt-1">Active Users</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.growthRate}</div>
              <div className="text-xs text-gray-300 mt-1">Growth Rate</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-indigo-300">{startup.customerRetention}</div>
              <div className="text-xs text-gray-300 mt-1">Customer Retention</div>
            </div>
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

export default StartupsDetails; 