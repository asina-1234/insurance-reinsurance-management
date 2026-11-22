import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminClaimsPage from '../pages/admin/AdminClaimsPage';
import AdminCustomersPage from '../pages/admin/AdminCustomersPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminPoliciesPage from '../pages/admin/AdminPoliciesPage';
import NonProportionalTreatyPage from '../pages/admin/NonProportionalTreatyPage';
import ProportionalTreatyPage from '../pages/admin/ProportionalTreatyPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ClaimsPage from '../pages/customer/ClaimsPage';
import PoliciesPage from '../pages/customer/PoliciesPage';
import ProfilePage from '../pages/customer/ProfilePage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute role="USER" />}>
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="claims" element={<ClaimsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="customers" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="policies" element={<AdminPoliciesPage />} />
          <Route path="claims" element={<AdminClaimsPage />} />
          <Route path="proportional-treaty" element={<ProportionalTreatyPage />} />
          <Route path="non-proportional-treaty" element={<NonProportionalTreatyPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}