import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is logged in but not allowed for this route, redirect to their dashboard
    if (user.role === 'investor') return <Navigate to="/investor-dashboard" replace />;
    if (user.role === 'startup') return <Navigate to="/startup-dashboard" replace />;
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute; 