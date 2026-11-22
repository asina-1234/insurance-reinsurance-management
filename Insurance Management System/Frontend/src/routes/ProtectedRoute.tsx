import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/auth';
import { homePath } from './paths';

export default function ProtectedRoute({ role }: { role: Role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== role) {
    return <Navigate to={homePath(user.role)} replace />;
  }
  return <Outlet />;
}