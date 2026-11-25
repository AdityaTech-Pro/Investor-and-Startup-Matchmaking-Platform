import { Routes, Route } from 'react-router-dom'

// Import all page components
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Signup'
import StartupForm from './pages/StartupForm'
import InvestorForm from './pages/InvestorForm'
import Matches from './pages/Matches'
import ChatPage from './pages/ChatPage'
import StartupDashboard from './pages/StartupDashboard'
import InvestorDashboard from './pages/InvestorDashboard'
import StartupsSearch from './pages/StartupsSearch'
import InvestorProfileSettings from './pages/InvestorProfileSettings'
import StartupsDetails from './pages/StartupsDetails'
import InvestorSearch from './pages/InvestorSearch'
import InvestorDetails from './pages/InvestorDetails'
import ProtectedRoute from './components/ProtectedRoute';
import StartupProfileSettings from './pages/StartupProfileSettings'

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Protected routes with role-based access */}
      <Route path="/startup-form" element={<ProtectedRoute><StartupForm /></ProtectedRoute>} />
      <Route path="/investor-form" element={<ProtectedRoute><InvestorForm /></ProtectedRoute>} />
      <Route path="/startup-dashboard" element={<ProtectedRoute allowedRoles={['startup']}><StartupDashboard /></ProtectedRoute>} />
      <Route path="/investor-dashboard" element={<ProtectedRoute allowedRoles={['investor']}><InvestorDashboard /></ProtectedRoute>} />
      <Route path="/investor-profile-settings" element={<ProtectedRoute><InvestorProfileSettings /></ProtectedRoute>} />
      <Route path="/startup-profile-settings" element={<ProtectedRoute><StartupProfileSettings /></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/startupssearch" element={<ProtectedRoute allowedRoles={['investor']}><StartupsSearch /></ProtectedRoute>} />
      <Route path="/startupsdetails/:id" element={<ProtectedRoute><StartupsDetails /></ProtectedRoute>} />
      <Route path="/investor-search" element={<ProtectedRoute allowedRoles={['startup']}><InvestorSearch /></ProtectedRoute>} />
      <Route path="/investordetails/:id" element={<ProtectedRoute allowedRoles={['startup']}><InvestorDetails /></ProtectedRoute>} />
    </Routes>
  )
}

export default Routing;