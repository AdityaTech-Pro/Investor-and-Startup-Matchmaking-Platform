import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
const InvestorForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    organization: '',
    
    // Investor Type
    investorType: '',
    isAccredited: '',
    
    // Investment Preferences
    preferredIndustries: [],
    preferredStages: [],
    ticketSize: '',
    preferredGeographies: [],
    investmentModel: '',
    coInvestmentInterest: '',
    
    // Past Investment Experience
    hasInvestedBefore: '',
    numberOfInvestments: '',
    portfolioHighlights: '',
    portfolioLink: '',
    
    // Risk & Strategy Preferences
    riskAppetite: '',
    investmentHorizon: '',
    esgInterest: '',
    
    // Optional
    availability: [],
    preferredCommunication: '',
    comments: ''
  });

  // Prefill fullName and email from localStorage's currentUser
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
      }));
    }
  }, []);

  const investorTypes = [
    'Angel', 'VC', 'PE', 'Family Office', 'Corporate', 'Syndicate', 'HNI', 'Other'
  ];

  const industries = [
    'Fintech', 'AI', 'HealthTech', 'EdTech', 'E-commerce', 'SaaS', 
    'Blockchain', 'CleanTech', 'AgriTech', 'Consumer', 'Other'
  ];

  const stages = [
    'Idea', 'MVP', 'Early Traction', 'Growth', 'Scale-up'
  ];

  const geographies = [
    'India', 'US', 'SE Asia', 'Europe', 'Global', 'Tier-1 cities', 'Emerging markets'
  ];

  const investmentModels = [
    'Equity', 'SAFE', 'Convertible Note', 'Revenue Sharing', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const { name, value, checked } = e.target;
      setFormData(prev => {
        const currentValues = prev[name];
        if (checked) {
          return { ...prev, [name]: [...currentValues, value] };
        } else {
          return { ...prev, [name]: currentValues.filter(item => item !== value) };
        }
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return toast.error('User not logged in');

    try {
      await axios.post('http://localhost:5000/api/forms/investor-form', {
        ...formData,
        userId: user._id
      });

      // update localStorage
      localStorage.setItem('currentUser', JSON.stringify({ ...user, hasFilledForm: true }));
      toast.success('Form submitted successfully!');
      setTimeout(() => {
        navigate('/investor-dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error('Submission failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        
        {/* Foreground Content */}
        <div className="flex items-center justify-center p-4">
          {/* Main Form Container */}
          <div className="border-2 bg-white/10 backdrop-blur-2xl text-white border-white/20 p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">Investor Onboarding Form</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Information */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-violet-300">1. Basic Information</h2>
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="fullName" className="block text-sm font-medium text-white mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="linkedIn" className="block text-sm font-medium text-white mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedIn"
                    id="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="organization" className="block text-sm font-medium text-white mb-1">
                    Organization / Firm Name
                  </label>
                  <input
                    type="text"
                    name="organization"
                    id="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Investor Type */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-violet-300">2. Investor Type</h2>
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="investorType" className="block text-sm font-medium text-white mb-1">
                    Type of Investor *
                  </label>
                  <select
                    id="investorType"
                    name="investorType"
                    required
                    value={formData.investorType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
                  >
                    <option value="" disabled className="bg-gray-800 text-white/50">Select an option</option>
                    {investorTypes.map(type => (
                      <option key={type} value={type} className="bg-gray-800 text-white">{type}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-white mb-1">
                    Are you an Accredited Investor?
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="accreditedYes"
                        name="isAccredited"
                        value="Yes"
                        onChange={handleChange}
                        className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20"
                      />
                      <label htmlFor="accreditedYes" className="ml-2 block text-sm text-white">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="accreditedNo"
                        name="isAccredited"
                        value="No"
                        onChange={handleChange}
                        className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20"
                      />
                      <label htmlFor="accreditedNo" className="ml-2 block text-sm text-white">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Investment Preferences */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-violet-300">3. Investment Preferences</h2>
              
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                {/* Preferred Industries */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-white mb-2">
                    Preferred Industries / Sectors
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {industries.map(industry => (
                      <div key={industry} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`industry-${industry}`}
                          name="preferredIndustries"
                          value={industry}
                          onChange={handleChange}
                          checked={formData.preferredIndustries.includes(industry)}
                          className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20 rounded"
                        />
                        <label htmlFor={`industry-${industry}`} className="ml-2 block text-sm text-white">
                          {industry}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Stages */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-white mb-2">
                    Preferred Startup Stages
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {stages.map(stage => (
                      <div key={stage} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`stage-${stage}`}
                          name="preferredStages"
                          value={stage}
                          onChange={handleChange}
                          checked={formData.preferredStages.includes(stage)}
                          className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20 rounded"
                        />
                        <label htmlFor={`stage-${stage}`} className="ml-2 block text-sm text-white">
                          {stage}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ticket Size */}
                <div className="sm:col-span-6">
                  <label htmlFor="ticketSize" className="block text-sm font-medium text-white mb-1">
                    Investment Ticket Size (INR) *
                  </label>
                  <select
                    id="ticketSize"
                    name="ticketSize"
                    value={formData.ticketSize}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
                  >
                    <option value="" disabled className="bg-gray-800 text-white/50">Select an option</option>
                    <option value="Under ₹5L" className="bg-gray-800 text-white">Under ₹5L</option>
                    <option value="₹5L–₹25L" className="bg-gray-800 text-white">₹5L–₹25L</option>
                    <option value="₹25L–₹1Cr" className="bg-gray-800 text-white">₹25L–₹1Cr</option>
                    <option value="₹1Cr–₹5Cr" className="bg-gray-800 text-white">₹1Cr–₹5Cr</option>
                    <option value="Above ₹5Cr" className="bg-gray-800 text-white">Above ₹5Cr</option>
                  </select>
                </div>

                {/* Preferred Geographies */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-white mb-2">
                    Preferred Geographies
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {geographies.map(geo => (
                      <div key={geo} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`geo-${geo}`}
                          name="preferredGeographies"
                          value={geo}
                          onChange={handleChange}
                          checked={formData.preferredGeographies.includes(geo)}
                          className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20 rounded"
                        />
                        <label htmlFor={`geo-${geo}`} className="ml-2 block text-sm text-white">
                          {geo}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment Model */}
                <div className="sm:col-span-3">
                  <label htmlFor="investmentModel" className="block text-sm font-medium text-white mb-1">
                    Investment Model *
                  </label>
                  <select
                    id="investmentModel"
                    name="investmentModel"
                    value={formData.investmentModel}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
                  >
                    <option value="" disabled className="bg-gray-800 text-white/50">Select an option</option>
                    {investmentModels.map(model => (
                      <option key={model} value={model} className="bg-gray-800 text-white">{model}</option>
                    ))}
                  </select>
                </div>

                {/* Co-Investment Interest */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-white mb-1">
                    Co-Investment Interest
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="coInvestYes"
                        name="coInvestmentInterest"
                        value="Yes"
                        onChange={handleChange}
                        className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20"
                      />
                      <label htmlFor="coInvestYes" className="ml-2 block text-sm text-white">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="coInvestNo"
                        name="coInvestmentInterest"
                        value="No"
                        onChange={handleChange}
                        className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20"
                      />
                      <label htmlFor="coInvestNo" className="ml-2 block text-sm text-white">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Past Investment Experience */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-violet-300">4. Past Investment Experience</h2>
              
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                {/* Has invested before */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-white mb-1">
                    Have you invested in startups before?
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="investedYes"
                        name="hasInvestedBefore"
                        value="Yes"
                        onChange={handleChange}
                        checked={formData.hasInvestedBefore === 'Yes'}
                        className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20"
                      />
                      <label htmlFor="investedYes" className="ml-2 block text-sm text-white">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="investedNo"
                        name="hasInvestedBefore"
                        value="No"
                        onChange={e => {
                          handleChange(e);
                          setFormData(prev => ({ ...prev, numberOfInvestments: '' }));
                        }}
                        checked={formData.hasInvestedBefore === 'No'}
                        className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20"
                      />
                      <label htmlFor="investedNo" className="ml-2 block text-sm text-white">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* Number of investments */}
                <div className="sm:col-span-3">
                  <label htmlFor="numberOfInvestments" className="block text-sm font-medium text-white mb-1">
                    Number of Investments Made
                  </label>
                  <input
                    type="number"
                    name="numberOfInvestments"
                    id="numberOfInvestments"
                    min="0"
                    value={formData.numberOfInvestments}
                    onChange={handleChange}
                    disabled={formData.hasInvestedBefore !== 'Yes'}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Portfolio Highlights */}
                <div className="sm:col-span-6">
                  <label htmlFor="portfolioHighlights" className="block text-sm font-medium text-white mb-1">
                    Portfolio Highlights
                  </label>
                  <textarea
                    id="portfolioHighlights"
                    name="portfolioHighlights"
                    rows={3}
                    value={formData.portfolioHighlights}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                {/* Portfolio Link */}
                <div className="sm:col-span-6">
                  <label htmlFor="portfolioLink" className="block text-sm font-medium text-white mb-1">
                    Link to Portfolio Website / AngelList
                  </label>
                  <input
                    type="url"
                    name="portfolioLink"
                    id="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Risk & Strategy Preferences */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-violet-300">5. Risk & Strategy Preferences</h2>
              
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                {/* Risk Appetite */}
                <div className="sm:col-span-3">
                  <label htmlFor="riskAppetite" className="block text-sm font-medium text-white mb-1">
                    Risk Appetite *
                  </label>
                  <select
                    id="riskAppetite"
                    name="riskAppetite"
                    value={formData.riskAppetite}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
                  >
                    <option value="" disabled className="bg-gray-800 text-white/50">Select an option</option>
                    <option value="Low" className="bg-gray-800 text-white">Low</option>
                    <option value="Moderate" className="bg-gray-800 text-white">Moderate</option>
                    <option value="High" className="bg-gray-800 text-white">High</option>
                  </select>
                </div>

                {/* Investment Horizon */}
                <div className="sm:col-span-3">
                  <label htmlFor="investmentHorizon" className="block text-sm font-medium text-white mb-1">
                    Investment Horizon *
                  </label>
                  <select
                    id="investmentHorizon"
                    name="investmentHorizon"
                    value={formData.investmentHorizon}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
                  >
                    <option value="" disabled className="bg-gray-800 text-white/50">Select an option</option>
                    <option value="Short-term" className="bg-gray-800 text-white">Short-term (1-3 years)</option>
                    <option value="Medium" className="bg-gray-800 text-white">Medium (3-5 years)</option>
                    <option value="Long-term" className="bg-gray-800 text-white">Long-term (5+ years)</option>
                  </select>
                </div>

                {/* ESG Interest */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-white mb-1">
                    Interest in ESG / Impact Startups?
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="esgYes"
                        name="esgInterest"
                        value="Yes"
                        onChange={handleChange}
                        className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20"
                      />
                      <label htmlFor="esgYes" className="ml-2 block text-sm text-white">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="esgNo"
                        name="esgInterest"
                        value="No"
                        onChange={handleChange}
                        className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20"
                      />
                      <label htmlFor="esgNo" className="ml-2 block text-sm text-white">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Optional */}
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-violet-300">6. Additional Information</h2>
              
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                {/* Preferred Communication */}
                <div className="sm:col-span-3">
                  <label htmlFor="preferredCommunication" className="block text-sm font-medium text-white mb-1">
                    Preferred Communication Method *
                  </label>
                  <select
                    id="preferredCommunication"
                    name="preferredCommunication"
                    value={formData.preferredCommunication}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
                  >
                    <option value="" disabled className="bg-gray-800 text-white/50">Select an option</option>
                    <option value="Email" className="bg-gray-800 text-white">Email</option>
                    <option value="WhatsApp" className="bg-gray-800 text-white">WhatsApp</option>
                    <option value="Phone" className="bg-gray-800 text-white">Phone</option>
                    <option value="Zoom" className="bg-gray-800 text-white">Zoom</option>
                  </select>
                </div>

                {/* Comments */}
                <div className="sm:col-span-6">
                  <label htmlFor="comments" className="block text-sm font-medium text-white mb-1">
                    Comments / Additional Notes
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows={3}
                    value={formData.comments}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white font-medium rounded-md hover:from-purple-500 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorForm;