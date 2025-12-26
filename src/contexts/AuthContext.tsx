import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  organisation_id: number | null;
  class: string | null;
  created_at: string;
}

interface AuthData {
  token: string;
  user: User;
}

interface AuthContextType {
  authData: AuthData | null;
  isAuthenticated: boolean;
  userRole: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth data from localStorage on mount
    const storedAuthData = localStorage.getItem('authData');
    if (storedAuthData) {
      try {
        const parsed = JSON.parse(storedAuthData);
        setAuthData(parsed);
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('authData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Use proxy path in development, direct URL in production
      const apiUrl = import.meta.env.DEV 
        ? '/api/auth/login.php'
        : 'https://api.exeleratetechnology.com/api/auth/login.php';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Handle HTTP errors
        if (response.status === 401 || response.status === 403) {
          throw new Error('Invalid email or password. Please try again.');
        }
        throw new Error(`Login failed with status ${response.status}. Please try again.`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const authData: AuthData = {
          token: data.data.token,
          user: data.data.user,
        };
        setAuthData(authData);
        localStorage.setItem('authData', JSON.stringify(authData));
      } else {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network or CORS error
        throw new Error('Network error. Please check your connection or contact support if the problem persists.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again.');
    }
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('authData');
  };

  const value: AuthContextType = {
    authData,
    isAuthenticated: !!authData,
    userRole: authData?.user.role || null,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

