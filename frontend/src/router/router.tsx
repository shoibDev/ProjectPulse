import * as React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../auth/provider/auth';
import { Layout } from '../layouts/layout';
import {
  AuthenticationGuard,
  UnAuthenticationGuard,
} from './components/AuthenticationGuard';

import LoginPage from '../pages/LoginPage';

import DashboardPage from '../pages/DashboardPage';
import AdminPage from '../pages/AdminPage';


const LogoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      logout();
      navigate('/login', { replace: true });  // Redirect to login after logout
    }
  }, []);

  return null;
};

const routes = createRoutesFromElements(
  <Route element={<Layout />}>

    {/* Protect route based on authentication */}
    <Route element={<AuthenticationGuard />}>
      <Route index element={<DashboardPage />} />
      <Route path="settings" element={<AdminPage />} />
      <Route path="logout" element={<LogoutPage />} />
    </Route>

    {/* Login page in case unauthenticated */}
    <Route element={<UnAuthenticationGuard />}>
      <Route path="login" element={<LoginPage />} />
    </Route>
  </Route>
);

export const router = createBrowserRouter(routes);
