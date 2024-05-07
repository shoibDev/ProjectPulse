import * as React from 'react';
import { authService } from '../services/AuthService';

// Adjust the default context to match the function's return type
const AuthContext = React.createContext({
  isAuthenticated: false,
  login: async (_email: string, _password: string): Promise<boolean> => { return false; },
  logout: () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Check token on component mount
    const checkToken = async () => {
      const isValid = await authService.validateToken();
      setIsAuthenticated(isValid);
    };
    checkToken();
    console.log(isAuthenticated);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
      const result = await authService.login(email, password);
      setIsAuthenticated(result);
      return result;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
