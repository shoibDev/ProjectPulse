import * as React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../auth/provider/auth';
import { Layout } from '../layouts/layout';
import {
  AuthenticationGuard,
  UnAuthenticationGuard,
} from './components/AuthenticationGuard';

import LoginPage from '../pages/LoginPage';

const HomePage = () => <div>Home</div>;
const SettingsPage = () => <div>Settings</div>;


const LogoutPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    if (user) {
      logout();
      navigate('/login', { replace: true });  // Redirect to login after logout
    }
  }, [user, logout, navigate]);

  return null;
};

const routes = createRoutesFromElements(
  <Route element={<Layout />}>

    {/* Protect route based on authentication */}
    <Route element={<AuthenticationGuard />}>
      <Route index element={<HomePage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="logout" element={<LogoutPage />} />
    </Route>

    {/* Login page in case unauthenticated */}
    <Route element={<UnAuthenticationGuard />}>
      <Route path="login" element={<LoginPage />} />
    </Route>
  </Route>
);

export const router = createBrowserRouter(routes);
