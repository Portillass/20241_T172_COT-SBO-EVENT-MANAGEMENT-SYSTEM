import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  // Show loading state if auth is still being checked
  if (loading) {
    return null;
  }

  // If not logged in, redirect to landing page
  if (!user) {
    return <Navigate to="/" />;
  }

  // If no roles specified, allow access to authenticated users
  if (allowedRoles.length === 0) {
    return children;
  }

  // If user's role is not in allowed roles, redirect to their dashboard
  if (!allowedRoles.includes(user?.role?.toLowerCase())) {
    const defaultPath = user?.role ? `/dashboard/${user.role.toLowerCase()}` : '/';
    return <Navigate to={defaultPath} />;
  }

  // If user is authenticated and authorized, render the protected component
  return children;
}

export default PrivateRoute;