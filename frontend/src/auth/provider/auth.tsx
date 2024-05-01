import * as React from 'react';
import { mockAuthService, User } from '../services/mockAuthService';

// Define the type for the context value
interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

// Define the props type for AuthProvider
interface AuthProviderProps {
  children: React.ReactNode; // Use React.ReactNode for children
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);

  const login = async () => {
    const user = await mockAuthService.login();
    setUser(user);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
