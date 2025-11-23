import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // For demo purposes, always allow access
  // In production, check: return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
  return <Outlet />;
};

export default PrivateRoute;
