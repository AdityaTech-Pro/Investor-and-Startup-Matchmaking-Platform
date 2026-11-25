import { useParams, useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function InvestorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvestor = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:5000/api/forms/investor-form/${id}`);
        setInvestor(res.data);
      } catch (err) {
        setError('Failed to load investor details.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvestor();
  }, [id]);

  if (loading) {
    return <div className="text-center text-lg text-gray-300 min-h-screen flex items-center justify-center">Loading investor details...</div>;
  }
  if (error || !investor) {
    return <div className="text-center text-lg text-red-400 min-h-screen flex items-center justify-center">{error || 'Investor not found.'}</div>;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <Navbar userType="startup" />

        {/* Breadcrumb */}
        <div className="breadcrumb bg-white/10 py-4 border-b border-gray-700 px-4">
          <div className="container mx-auto">
            <button onClick={() => navigate('/startup-dashboard')} className="text-indigo-300 hover:underline mr-2 bg-transparent">Home</button>
            <span className="text-gray-400">/</span>
            <button onClick={() => navigate('/investor-search')} className="text-indigo-300 hover:underline mx-2 bg-transparent">Investors</button>
            <span className="text-gray-400">/</span>
            <span className="ml-2 text-white font-semibold">{investor.fullName}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="investor-hero py-12 border-b border-gray-700">
          <div className="container mx-auto grid md:grid-cols-3 gap-12 items-start px-4">
            {/* Main Info */}
            <div className="md:col-span-2">
              <div className="investor-logo w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl mb-6">
                {investor.fullName ? investor.fullName.split(' ').map(word => word[0]).join('') : 'I'}
              </div>
              <div className="investor-title text-3xl font-bold mb-2 text-white">{investor.fullName}</div>
              <div className="investor-focus text-lg text-purple-300 mb-2">{investor.investorType}</div>
              <div className="investor-description text-gray-300 mb-6">{investor.organization}</div>
              <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{investor.location || '-'}</div>
                  <div className="stat-label text-gray-300 mt-1">Location</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{investor.ticketSize || '-'}</div>
                  <div className="stat-label text-gray-300 mt-1">Ticket Size</div>
                </div>
                <div className="stat-item text-center bg-white/10 rounded-lg p-4">
                  <div className="stat-value text-xl font-bold text-indigo-300">{investor.numberOfInvestments || 0}</div>
                  <div className="stat-label text-gray-300 mt-1"># Investments</div>
                </div>
              </div>
            </div>
            {/* Action Card */}
            <div className="action-card bg-white/10 border-2 border-gray-700 rounded-xl p-8 shadow-md sticky top-8">
              <div className="action-title text-lg font-semibold mb-4 text-white">Request Meeting</div>
              <button className="w-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition mb-4">
                Apply for Meeting
              </button>
              <div className="contact-info">
                <div className="text-sm text-gray-300 mb-2">Contact:</div>
                <div className="text-indigo-300">{investor.email}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="content-section bg-white/10 my-8 p-8 rounded-xl shadow-md container mx-auto">
          <div className="section-title text-2xl font-semibold mb-4 text-white">About</div>
          <div className="section-content text-gray-200 mb-8">{investor.bio || '-'}</div>
          <div className="section-title text-2xl font-semibold mb-4 text-white">Investment Preferences</div>
          <div className="section-content text-gray-200 mb-8">{investor.preferredIndustries && investor.preferredIndustries.join(', ')}</div>
          <div className="section-title text-2xl font-semibold mb-4 text-white">Portfolio Highlights</div>
          <div className="section-content text-gray-200 mb-8">{investor.portfolioHighlights || '-'}</div>
        </section>
      </div>
      {/* Footer */}
      <footer className="text-center text-sm py-6 bg-black/70 border-t border-gray-700 relative z-10">
        © {new Date().getFullYear()} Chatiao. All rights reserved.
      </footer>
    </div>
  );
}

export default InvestorDetails;