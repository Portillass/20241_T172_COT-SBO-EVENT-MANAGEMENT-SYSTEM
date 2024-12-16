import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [token, setToken] = useState(null); // Add token state

  useEffect(() => {
    // Check for stored token and user data
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken); // Set token state
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, { email, password });
      const { token, user } = response.data;
      
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      
      return { user, token };
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null); // Remove token
  };

  const googleLogin = async () => {
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: '422420504540-khiasc7hk040g0gdesh11plu9lg94cp8.apps.googleusercontent.com',
        scope: 'email profile openid',
        callback: async (response) => {
          if (response.access_token) {
            try {
              const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` }
              });
              const userInfo = await userInfoResponse.json();

              const serverResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/google`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  token: response.access_token,
                  userInfo
                }),
              });

              const data = await serverResponse.json();

              if (data.pendingApproval) {
                setPendingApproval(true);
                return;
              }

              if (!serverResponse.ok) {
                throw new Error('Server authentication failed');
              }

              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              setUser(data.user);
              setToken(data.token); // Set token

              window.location.href = data.redirectUrl;
            } catch (error) {
              console.error('Authentication error:', error);
              throw new Error('Failed to authenticate with Google');
            }
          }
        }
      });

      client.requestAccessToken();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    googleLogin,
    forgotPassword,
    resetPassword,
    token // Add token to context
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};