import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './auth/provider/auth';
import { router } from './router/router';
import './index.css'

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
