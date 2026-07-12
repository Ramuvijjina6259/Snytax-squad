import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/Loading';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, admin, loading } = useAuth();
  if (loading) return <LoadingSpinner text="Verifying access..." />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (adminOnly && admin?.role !== 'admin') return <Navigate to="/admin/dashboard" replace />;
  return children;
}
