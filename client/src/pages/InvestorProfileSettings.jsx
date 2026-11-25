import React, { useState, useEffect } from 'react'
import assets from '../assets/assets'
import axios from 'axios'
import Navbar from '../components/Navbar'

const investorTypes = [
  'Angel', 'VC', 'PE', 'Family Office', 'Corporate', 'Syndicate', 'HNI', 'Other'
]
const industries = [
  'Fintech', 'AI', 'HealthTech', 'EdTech', 'E-commerce', 'SaaS', 
  'Blockchain', 'CleanTech', 'AgriTech', 'Consumer', 'Other'
]
const stages = [
  'Idea', 'MVP', 'Early Traction', 'Growth', 'Scale-up'
]
const geographies = [
  'India', 'US', 'SE Asia', 'Europe', 'Global', 'Tier-1 cities', 'Emerging markets'
]
const investmentModels = [
  'Equity', 'SAFE', 'Convertible Note', 'Revenue Sharing', 'Other'
]
const communicationMethods = [
  'Email', 'WhatsApp', 'Phone', 'Zoom'
]
const ticketSizes = [
  'Under ₹5L', '₹5L–₹25L', '₹25L–₹1Cr', '₹1Cr–₹5Cr', 'Above ₹5Cr'
]
const riskAppetites = ['Low', 'Moderate', 'High']
const investmentHorizons = ['Short-term', 'Medium', 'Long-term']
const availabilityOptions = [
  'Weekdays', 'Weekends', 'Mornings', 'Afternoons', 'Evenings'
]

const InvestorProfileSettings = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    organization: '',
    investorType: '',
    isAccredited: '',
    preferredIndustries: [],
    preferredStages: [],
    ticketSize: '',
    preferredGeographies: [],
    investmentModel: '',
    coInvestmentInterest: '',
    hasInvestedBefore: '',
    numberOfInvestments: '',
    portfolioHighlights: '',
    portfolioLink: '',
    riskAppetite: '',
    investmentHorizon: '',
    esgInterest: '',
    availability: [],
    preferredCommunication: '',
    comments: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    if (user && user._id) {
      axios.get(`http://localhost:5000/api/forms/investor-form/user/${user._id}`)
        .then(res => {
          // Always set email from user data
          setProfile(prev => ({
            ...prev,
            ...res.data,
            email: user.email || '' // Always prefill email from user data
          }))
        })
        .catch(() => {
          // Fallback: just set email if request fails
          setProfile(prev => ({
            ...prev,
            email: user.email || ''
          }))
        })
    } else if (user && user.email) {
      setProfile(prev => ({
        ...prev,
        email: user.email
      }))
    }
  }, [])

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setProfile(prev => {
        const arr = prev[name] || []
        if (checked) {
          return { ...prev, [name]: [...arr, value] }
        } else {
          return { ...prev, [name]: arr.filter(item => item !== value) }
        }
      })
    } else {
      setProfile(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    const user = JSON.parse(localStorage.getItem('currentUser'))
    if (!user || !user._id) {
      alert('User not logged in')
      setLoading(false)
      return
    }
    // Check if at least one field (other than email) is filled
    const fieldsToCheck = { ...profile }
    delete fieldsToCheck.email
    const hasAnyValue = Object.values(fieldsToCheck).some(val => {
      if (Array.isArray(val)) return val.length > 0
      return val !== '' && val !== null && val !== undefined
    })
    if (!hasAnyValue) {
      alert('Please fill at least one field to save your profile.')
      setLoading(false)
      return
    }
    try {
      const res = await axios.put('http://localhost:5000/api/forms/investor-form', {
        ...profile,
        userId: user._id
      })
      localStorage.setItem('currentUser', JSON.stringify({ ...user, ...profile }))
      alert('Profile updated!')
    } catch (err) {
      alert('Failed to update profile')
    }
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <Navbar userType="investor" />
        <section className="flex flex-col items-center justify-center text-center py-12 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-2">Profile Settings</h1>
          <p className="mt-2 text-gray-300 text-lg">Update your investor profile details below.</p>
        </section>
        <section className="max-w-3xl mx-auto bg-white/10 rounded-xl p-8 border border-gray-700 shadow-lg mb-16">
          <form onSubmit={handleProfileSave} className="space-y-6">
            {/* Basic Information */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Full Name</label>
                <input type="text" name="fullName" value={profile.fullName} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Full name" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Email</label>
                <input type="email" name="email" value={profile.email} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" disabled placeholder="Email address" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Phone</label>
                <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Phone number" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">LinkedIn</label>
                <input type="text" name="linkedIn" value={profile.linkedIn} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="LinkedIn profile URL" />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Organization</label>
              <input type="text" name="organization" value={profile.organization} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Organization or firm name" />
            </div>
            {/* Investor Type */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Type of Investor</label>
                <select name="investorType" value={profile.investorType} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
                  <option value="">Select</option>
                  {investorTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Accredited Investor?</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="isAccredited" value="Yes" checked={profile.isAccredited === 'Yes'} onChange={handleProfileChange} className="accent-violet-500" /> Yes</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="isAccredited" value="No" checked={profile.isAccredited === 'No'} onChange={handleProfileChange} className="accent-violet-500" /> No</label>
                </div>
              </div>
            </div>
            {/* Investment Preferences */}
            <div>
              <label className="block mb-1 text-gray-200">Preferred Industries</label>
              <div className="flex flex-wrap gap-2">
                {industries.map(ind => (
                  <label key={ind} className="flex items-center gap-1 cursor-pointer bg-white/20 px-2 py-1 rounded">
                    <input type="checkbox" name="preferredIndustries" value={ind} checked={profile.preferredIndustries.includes(ind)} onChange={handleProfileChange} className="accent-violet-500" /> {ind}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Preferred Stages</label>
              <div className="flex flex-wrap gap-2">
                {stages.map(stage => (
                  <label key={stage} className="flex items-center gap-1 cursor-pointer bg-white/20 px-2 py-1 rounded">
                    <input type="checkbox" name="preferredStages" value={stage} checked={profile.preferredStages.includes(stage)} onChange={handleProfileChange} className="accent-violet-500" /> {stage}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Ticket Size</label>
              <select name="ticketSize" value={profile.ticketSize} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
                <option value="">Select</option>
                {ticketSizes.map(size => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Preferred Geographies</label>
              <div className="flex flex-wrap gap-2">
                {geographies.map(geo => (
                  <label key={geo} className="flex items-center gap-1 cursor-pointer bg-white/20 px-2 py-1 rounded">
                    <input type="checkbox" name="preferredGeographies" value={geo} checked={profile.preferredGeographies.includes(geo)} onChange={handleProfileChange} className="accent-violet-500" /> {geo}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Investment Model</label>
                <select name="investmentModel" value={profile.investmentModel} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
                  <option value="">Select</option>
                  {investmentModels.map(model => <option key={model} value={model}>{model}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Co-Investment Interest</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="coInvestmentInterest" value="Yes" checked={profile.coInvestmentInterest === 'Yes'} onChange={handleProfileChange} className="accent-violet-500" /> Yes</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="coInvestmentInterest" value="No" checked={profile.coInvestmentInterest === 'No'} onChange={handleProfileChange} className="accent-violet-500" /> No</label>
                </div>
              </div>
            </div>
            {/* Investment Experience */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Invested Before?</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="hasInvestedBefore" value="Yes" checked={profile.hasInvestedBefore === 'Yes'} onChange={handleProfileChange} className="accent-violet-500" /> Yes</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="hasInvestedBefore" value="No" checked={profile.hasInvestedBefore === 'No'} onChange={handleProfileChange} className="accent-violet-500" /> No</label>
                </div>
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Number of Investments</label>
                <input type="number" name="numberOfInvestments" value={profile.numberOfInvestments} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" min="0" disabled={profile.hasInvestedBefore !== 'Yes'} placeholder="0" />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Portfolio Highlights</label>
              <textarea name="portfolioHighlights" value={profile.portfolioHighlights} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={2} placeholder="Highlight your best investments" />
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Portfolio Link</label>
              <input type="text" name="portfolioLink" value={profile.portfolioLink} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Portfolio or AngelList URL" />
            </div>
            {/* Risk & Strategy Preferences */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Risk Appetite</label>
                <select name="riskAppetite" value={profile.riskAppetite} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
                  <option value="">Select</option>
                  {riskAppetites.map(risk => <option key={risk} value={risk}>{risk}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-gray-200">Investment Horizon</label>
                <select name="investmentHorizon" value={profile.investmentHorizon} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
                  <option value="">Select</option>
                  <option value="Short-term">Short-term (1-3 years)</option>
                  <option value="Medium">Medium (3-5 years)</option>
                  <option value="Long-term">Long-term (5+ years)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Interest in ESG/Impact Startups?</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="esgInterest" value="Yes" checked={profile.esgInterest === 'Yes'} onChange={handleProfileChange} className="accent-violet-500" /> Yes</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="esgInterest" value="No" checked={profile.esgInterest === 'No'} onChange={handleProfileChange} className="accent-violet-500" /> No</label>
              </div>
            </div>
            {/* Optional */}
            <div>
              <label className="block mb-1 text-gray-200">Availability</label>
              <div className="flex flex-wrap gap-2">
                {availabilityOptions.map(opt => (
                  <label key={opt} className="flex items-center gap-1 cursor-pointer bg-white/20 px-2 py-1 rounded">
                    <input type="checkbox" name="availability" value={opt} checked={profile.availability.includes(opt)} onChange={handleProfileChange} className="accent-violet-500" /> {opt}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Preferred Communication</label>
              <select name="preferredCommunication" value={profile.preferredCommunication} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
                <option value="">Select</option>
                {communicationMethods.map(method => <option key={method} value={method}>{method}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-gray-200">Comments / Additional Notes</label>
              <textarea name="comments" value={profile.comments} onChange={handleProfileChange} className="w-full p-2 rounded bg-[#232347]/80 border border-violet-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={2} placeholder="Any additional notes or comments" />
            </div>
            <div className="flex justify-center mt-8">
              <button type="submit" className="px-8 py-3 bg-gradient-to-r from-purple-500 to-violet-700 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition text-lg flex items-center gap-2" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </section>
      </div>
      <footer className="text-center text-sm py-6 bg-black/70 border-t border-gray-700 relative z-10">
        © {new Date().getFullYear()} Chatiao. All rights reserved.
      </footer>
    </div>
  )
}

export default InvestorProfileSettings 