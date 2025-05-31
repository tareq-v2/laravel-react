import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const guestSessionId = localStorage.getItem('guest_session');

    // Simulate API call delay
    const timer = setTimeout(() => {
      if (token && role) {
        setCurrentUser({ token, role });
      } else if (guestSessionId) {
        setCurrentUser({ role: 'guest' });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('guest_session');
    setCurrentUser(null);
  };

  const startGuestSession = () => {
    const guestId = `guest_${Date.now()}`;
    localStorage.setItem('guest_session', guestId);
    setCurrentUser({ role: 'guest' });
  };

  const endGuestSession = () => {
    localStorage.removeItem('guest_session');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    startGuestSession,
    endGuestSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;