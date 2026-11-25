import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

const StartupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Information
    startupName: '',
    websiteUrl: '',
    founderNames: '',
    email: '',
    phone: '',
    linkedinProfiles: '',
    
    // Team & Founder Details
    numberOfFounders: '',
    teamSize: '',
    founderBackground: '',
    previousStartupExperience: false,
    teamSkills: [],
    
    // Startup Profile
    industry: [],
    problemStatement: '',
    productDescription: '',
    businessModel: '',
    techStack: '',
    startupStage: '',
    
    // Traction & Metrics
    monthlyRevenue: '',
    activeUsers: '',
    fundingRaised: '',
    customerRetention: '',
    growthRate: '',
    
    // Funding Needs
    fundingAmount: '',
    useOfFunds: [],
    fundingRoundType: '',
    equityOffering: '',
    pitchDeck: null,
    
    // Geography & Expansion
    headquarters: '',
    operatingMarkets: [],
    expansionPlan: ''
  });

  // Prefill founderNames and email from localStorage's currentUser
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setFormData(prev => ({
        ...prev,
        founderNames: user.fullName || '',
        email: user.email || '',
      }));
    }
  }, []);

  const industries = ['Fintech', 'HealthTech', 'AI/ML', 'Web3', 'EdTech', 'E-commerce', 'SaaS', 'IoT', 'CleanTech', 'Other'];
  const businessModels = ['B2B', 'B2C', 'B2G', 'Marketplace', 'SaaS', 'Other'];
  const startupStages = ['Idea', 'MVP', 'Early Traction', 'Growth', 'Scale-up'];
  const teamSkillsOptions = ['Tech', 'Marketing', 'Sales', 'Operations', 'Finance', 'Product', 'Design', 'Data Science'];
  const useOfFundsOptions = ['Hiring', 'Tech Development', 'Marketing', 'Operations', 'Expansion', 'R&D', 'Customer Acquisition'];
  const fundingRoundTypes = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      if (name === 'previousStartupExperience') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        setFormData(prev => {
          const currentValues = [...prev[name]];
          if (checked) {
            return { ...prev, [name]: [...currentValues, value] };
          } else {
            return { ...prev, [name]: currentValues.filter(item => item !== value) };
          }
        });
      }
    } else if (type === 'file') {
      const file = files[0];
      if (file) {
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast.error('File size must be less than 10MB');
          e.target.value = ''; // Clear the input
          return;
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('Only PDF and PowerPoint files are allowed');
          e.target.value = ''; // Clear the input
          return;
        }

        setFormData(prev => ({ ...prev, [name]: file }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return toast.error('User not logged in');

  // Create FormData to handle file upload
  const formDataToSend = new FormData();

  // Add all form fields to FormData
  Object.keys(formData).forEach(key => {
    if (key === 'pitchDeck' && formData[key]) {
      // Add file directly
      formDataToSend.append('pitchDeck', formData[key]);
    } else if (Array.isArray(formData[key])) {
      // Handle arrays by converting to JSON string
      formDataToSend.append(key, JSON.stringify(formData[key]));
    } else if (formData[key] !== null && formData[key] !== '') {
      // Add other fields as strings
      formDataToSend.append(key, formData[key]);
    }
  });

  // Add userId
  formDataToSend.append('userId', user._id);

  try {
    await axios.post('http://localhost:5000/api/forms/startup-form', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    localStorage.setItem('currentUser', JSON.stringify({ ...user, hasFilledForm: true }));
    toast.success('Form submitted successfully!');
    setTimeout(() => navigate('/startup-dashboard'), 1500);
  } catch (err) {
    toast.error('Submission failed');
    console.error(err);
  }
};

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
          <div className="border-2 bg-white/10 backdrop-blur-2xl text-white border-gray-500 p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">Startup Onboarding Form</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <h2 className="text-xl font-semibold mb-4 text-violet-300">1. Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Startup Name *</label>
                  <input
                    type="text"
                    name="startupName"
                    value={formData.startupName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Website/App URL *</label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Founder's Name(s) *</label>
                  <input
                    type="text"
                    name="founderNames"
                    value={formData.founderNames}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">LinkedIn Profile(s)</label>
                  <input
                    type="url"
                    name="linkedinProfiles"
                    value={formData.linkedinProfiles}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
              </div>
            </motion.section>

            {/* Team & Founder Details */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              transition={{ delay: 0.1 }}
              className="p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <h2 className="text-xl font-semibold mb-4 text-violet-300">2. Team & Founder Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Number of Founders *</label>
                  <input
                    type="number"
                    name="numberOfFounders"
                    min="1"
                    value={formData.numberOfFounders}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Team Size *</label>
                  <input
                    type="number"
                    name="teamSize"
                    min="1"
                    value={formData.teamSize}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-1">Founder Background *</label>
                  <textarea
                    name="founderBackground"
                    value={formData.founderBackground}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="Briefly describe your background, experience, and relevant skills"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="previousStartupExperience"
                    id="previousStartupExperience"
                    checked={formData.previousStartupExperience}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20 rounded"
                  />
                  <label htmlFor="previousStartupExperience" className="ml-2 block text-sm text-white">
                    Previous Startup Experience
                  </label>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-white mb-2">Key Team Skills/Roles *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {teamSkillsOptions.map(skill => (
                    <div key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`skill-${skill}`}
                        name="teamSkills"
                        value={skill}
                        checked={formData.teamSkills.includes(skill)}
                        onChange={handleChange}
                        className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20 rounded"
                      />
                      <label htmlFor={`skill-${skill}`} className="ml-2 text-sm text-white">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Startup Profile */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <h2 className="text-xl font-semibold mb-4 text-violet-300">3. Startup Profile</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Industry/Sector *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {industries.map(industry => (
                      <div key={industry} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`industry-${industry}`}
                          name="industry"
                          value={industry}
                          checked={formData.industry.includes(industry)}
                          onChange={handleChange}
                          className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20 rounded"
                        />
                        <label htmlFor={`industry-${industry}`} className="ml-2 text-sm text-white">
                          {industry}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">What problem are you solving? *</label>
                  <textarea
                    name="problemStatement"
                    value={formData.problemStatement}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="Describe the problem your startup is addressing"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Describe your product/service *</label>
                  <textarea
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="Explain your product or service in detail"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Current Business Model *</label>
                    <select
                      name="businessModel"
                      value={formData.businessModel}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
                    >
                      <option value="" disabled className="bg-gray-800 text-white/50">Select business model</option>
                      {businessModels.map(model => (
                        <option key={model} value={model} className="bg-gray-800 text-white">{model}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Tech Stack Used (if any)</label>
                    <input
                      type="text"
                      name="techStack"
                      value={formData.techStack}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                      placeholder="e.g., React, Node.js, Python, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Startup Stage *</label>
                    <select
                      name="startupStage"
                      value={formData.startupStage}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
                    >
                      <option value="" disabled className="bg-gray-800 text-white/50">Select stage</option>
                      {startupStages.map(stage => (
                        <option key={stage} value={stage} className="bg-gray-800 text-white">{stage}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Traction & Metrics */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              transition={{ delay: 0.3 }}
              className="p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <h2 className="text-xl font-semibold mb-4 text-violet-300">4. Traction & Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Monthly Revenue (MRR)</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-300 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="monthlyRevenue"
                      value={formData.monthlyRevenue}
                      onChange={handleChange}
                      min="0"
                      className="w-full pl-7 pr-12 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Number of Active Users/Customers</label>
                  <input
                    type="number"
                    name="activeUsers"
                    value={formData.activeUsers}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Funding Raised So Far ($)</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-300 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="fundingRaised"
                      value={formData.fundingRaised}
                      onChange={handleChange}
                      min="0"
                      className="w-full pl-7 pr-12 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Customer Retention (%)</label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="customerRetention"
                      value={formData.customerRetention}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full pr-12 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-300 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Growth Rate (%)</label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="growthRate"
                      value={formData.growthRate}
                      onChange={handleChange}
                      min="0"
                      className="w-full pr-12 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-300 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Funding Needs */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              transition={{ delay: 0.4 }}
              className="p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <h2 className="text-xl font-semibold mb-4 text-violet-300">5. Funding Needs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Funding Amount Seeking ($) *</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-300 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="fundingAmount"
                      value={formData.fundingAmount}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full pl-7 pr-12 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Expected Funding Round Type *</label>
                  <select
                    name="fundingRoundType"
                    value={formData.fundingRoundType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
                  >
                    <option value="" disabled className="bg-gray-800 text-white/50">Select round type</option>
                    {fundingRoundTypes.map(type => (
                      <option key={type} value={type} className="bg-gray-800 text-white">{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Equity Offering (%)</label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="equityOffering"
                      value={formData.equityOffering}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full pr-12 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-300 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-white mb-2">Use of Funds *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {useOfFundsOptions.map(use => (
                    <div key={use} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`use-${use}`}
                        name="useOfFunds"
                        value={use}
                        checked={formData.useOfFunds.includes(use)}
                        onChange={handleChange}
                        className="h-4 w-4 text-violet-400 focus:ring-violet-400 border-white/20 rounded"
                      />
                      <label htmlFor={`use-${use}`} className="ml-2 text-sm text-white">
                        {use}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-white mb-1">Pitch Deck Upload</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    name="pitchDeck"
                    onChange={handleChange}
                    accept=".pdf,.ppt,.pptx"
                    className="py-2 px-3 bg-white/5 border border-white/20 rounded-md text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  />
                </div>
                {formData.pitchDeck && (
                  <p className="mt-1 text-xs text-green-300">
                    Selected: {formData.pitchDeck.name} ({(formData.pitchDeck.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-300">Upload your pitch deck (PDF or PowerPoint, max 10MB)</p>
              </div>
            </motion.section>

            {/* Geography & Expansion */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              transition={{ delay: 0.5 }}
              className="p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <h2 className="text-xl font-semibold mb-4 text-violet-300">6. Geography & Expansion</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Headquartered In *</label>
                  <input
                    type="text"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="City, Country"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Operating Markets</label>
                  <input
                    type="text"
                    name="operatingMarkets"
                    value={formData.operatingMarkets}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="List countries or regions separated by commas"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-1">Expansion Plan (Next 12 months)</label>
                  <textarea
                    name="expansionPlan"
                    value={formData.expansionPlan}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="Describe your expansion plans for the next year"
                  />
                </div>
              </div>
            </motion.section>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white font-medium rounded-md hover:from-purple-500 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                Submit Application
              </motion.button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default StartupForm;