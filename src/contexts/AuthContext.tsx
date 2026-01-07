import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { clearAllPdfTextCache } from '../utils/pdfTextExtractor';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  organisation_id: number | null;
  class: string | string[] | null;
  created_at: string;
}

interface AuthData {
  token: string;
  user: User;
  tokenExpiry?: number; // Timestamp when token expires
  lastActivity?: number; // Timestamp of last user activity
}

interface AuthContextType {
  authData: AuthData | null;
  isAuthenticated: boolean;
  userRole: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateActivity: () => void;
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
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Token expires after 1 hour (3600000 ms)
  const TOKEN_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds
  const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour of inactivity
  const REFRESH_BUFFER = 5 * 60 * 1000; // Refresh 5 minutes before expiry

  useEffect(() => {
    // Load auth data from localStorage on mount
    const storedAuthData = localStorage.getItem('authData');
    if (storedAuthData) {
      try {
        const parsed = JSON.parse(storedAuthData);
        // Set current activity time if not present
        if (!parsed.lastActivity) {
          parsed.lastActivity = Date.now();
        }
        // Set token expiry if not present (default to 1 hour from now)
        if (!parsed.tokenExpiry) {
          parsed.tokenExpiry = Date.now() + TOKEN_EXPIRY_TIME;
        }
        setAuthData(parsed);
        localStorage.setItem('authData', JSON.stringify(parsed));
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('authData');
      }
    }
    setLoading(false);
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!authData?.token) {
      return false;
    }

    try {
      // Try to refresh token by making a request to a refresh endpoint
      // If no refresh endpoint exists, we'll extend the expiry time
      // In production, you should have a dedicated refresh token endpoint
      const isLocal = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1'
      )
      
      // Try refresh endpoint first (if it exists)
      const refreshUrl = isLocal
        ? '/api/auth/refresh.php'
        : '/.netlify/functions/authRefresh'
      
      try {
        const response = await fetch(refreshUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.token) {
            const now = Date.now();
            const updatedAuthData: AuthData = {
              ...authData,
              token: data.data.token,
              tokenExpiry: now + TOKEN_EXPIRY_TIME,
              lastActivity: now,
            };
            setAuthData(updatedAuthData);
            localStorage.setItem('authData', JSON.stringify(updatedAuthData));
            console.log('Token refreshed successfully');
            return true;
          }
        }
      } catch (refreshError) {
        // Refresh endpoint doesn't exist or failed, continue with fallback
        console.log('Refresh endpoint not available, using fallback');
      }

      // Fallback: If no refresh endpoint, extend the token expiry time
      // This assumes the token is still valid and we're just tracking expiry
      // In production, you should implement a proper refresh token mechanism
      const now = Date.now();
      const updatedAuthData: AuthData = {
        ...authData,
        tokenExpiry: now + TOKEN_EXPIRY_TIME,
        lastActivity: now,
      };
      setAuthData(updatedAuthData);
      localStorage.setItem('authData', JSON.stringify(updatedAuthData));
      console.log('Token expiry extended (no refresh endpoint available)');
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }, [authData]);

  const updateActivity = useCallback(() => {
    if (authData) {
      const updatedAuthData: AuthData = {
        ...authData,
        lastActivity: Date.now(),
      };
      setAuthData(updatedAuthData);
      localStorage.setItem('authData', JSON.stringify(updatedAuthData));
    }
  }, [authData]);

  const logout = useCallback(() => {
    setAuthData(null);
    localStorage.removeItem('authData');
    // Clear PDF text cache
    try {
      clearAllPdfTextCache();
    } catch (error) {
      console.error('Error clearing PDF cache on logout:', error);
    }
  }, []);

  // Set up token refresh and inactivity tracking
  useEffect(() => {
    if (!authData?.token) {
      // Clear timers if no auth data
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
        activityCheckIntervalRef.current = null;
      }
      return;
    }

    // Set up token refresh timer
    const setupTokenRefresh = () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      const timeUntilExpiry = (authData.tokenExpiry || Date.now() + TOKEN_EXPIRY_TIME) - Date.now();
      const refreshTime = Math.max(0, timeUntilExpiry - REFRESH_BUFFER);

      refreshTimerRef.current = setTimeout(async () => {
        console.log('Refreshing token before expiry...');
        const success = await refreshToken();
        if (!success) {
          console.error('Token refresh failed, logging out...');
          logout();
        } else {
          setupTokenRefresh(); // Set up next refresh
        }
      }, refreshTime);
    };

    // Set up inactivity timer
    const setupInactivityTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      const lastActivity = authData.lastActivity || Date.now();
      const timeSinceActivity = Date.now() - lastActivity;
      const remainingTime = Math.max(0, INACTIVITY_TIMEOUT - timeSinceActivity);

      inactivityTimerRef.current = setTimeout(() => {
        console.log('Inactivity timeout reached, logging out...');
        logout();
      }, remainingTime);
    };

    // Set up activity monitoring
    const setupActivityMonitoring = () => {
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }

      // Check activity every 30 seconds
      activityCheckIntervalRef.current = setInterval(() => {
        const storedAuthData = localStorage.getItem('authData');
        if (storedAuthData) {
          try {
            const parsed = JSON.parse(storedAuthData);
            const lastActivity = parsed.lastActivity || Date.now();
            const timeSinceActivity = Date.now() - lastActivity;

            if (timeSinceActivity >= INACTIVITY_TIMEOUT) {
              console.log('Inactivity detected, logging out...');
              logout();
            } else {
              // Update inactivity timer
              setupInactivityTimer();
            }
          } catch (error) {
            console.error('Error checking activity:', error);
          }
        }
      }, 30000); // Check every 30 seconds
    };

    // Track user activity events
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => {
      updateActivity();
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    setupTokenRefresh();
    setupInactivityTimer();
    setupActivityMonitoring();

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [authData, refreshToken, logout, updateActivity]);

  const login = async (email: string, password: string) => {
    try {
      // Determine the correct API URL based on environment
      // Development: Use Vite proxy (configured in vite.config.ts)
      // Production: Use Netlify function to avoid CORS issues
      const isLocal = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1'
      )
      
      const apiUrl = isLocal
        ? '/api/auth/login.php' // Vite proxy in development
        : '/.netlify/functions/authProxy' // Netlify function in production
      
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
        const now = Date.now();
        const authData: AuthData = {
          token: data.data.token,
          user: data.data.user,
          tokenExpiry: now + TOKEN_EXPIRY_TIME,
          lastActivity: now,
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


  const value: AuthContextType = {
    authData,
    isAuthenticated: !!authData?.token,
    userRole: authData?.user.role || null,
    token: authData?.token || null,
    login,
    logout,
    refreshToken,
    updateActivity,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

