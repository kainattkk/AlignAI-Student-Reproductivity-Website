import { createContext, useContext, useState } from 'react';
import type {ReactNode} from 'react';
interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => void;
  signup: (username: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const login = (email: string, password: string) => {
    // Mock login - in real app, would validate credentials
    setIsAuthenticated(true);
    setUser({ name: 'KAT', email });
  };

  const signup = (username: string, email: string, password: string) => {
    // Mock signup - in real app, would create account
    setIsAuthenticated(true);
    setUser({ name: username, email });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}