import * as React from 'react';
import { authService } from '../services/AuthService';

// Adjust the default context to match the function's return type
const AuthContext = React.createContext({
  isAuthenticated: false,
  userRole: null,
  login: async (_email: string, _password: string): Promise<boolean> => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const checkToken = async () => {
      const isValid = await authService.validateToken();
      setIsAuthenticated(isValid);
      if (isValid) {
        setUserRole(localStorage.getItem('role')); // Update role if token is valid
      }
    };
    checkToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await authService.login(email, password);

    setIsAuthenticated(result);
    setUserRole(localStorage.getItem('role'));
    return result;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
      <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);