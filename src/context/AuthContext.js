import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user database
  const mockUsers = {
    'student@unavida.com': {
      id: 'student_001',
      email: 'student@unavida.com',
      name: 'Sarah Student',
      role: 'student',
    },
    'instructor@unavida.com': {
      id: 'instructor_001',
      email: 'instructor@unavida.com',
      name: 'Dr. James Instructor',
      role: 'instructor',
    },
    'admin@unavida.com': {
      id: 'admin_001',
      email: 'admin@unavida.com',
      name: 'Alex Administrator',
      role: 'admin',
    },
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('unavida_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('unavida_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    // Mock authentication: check if email exists and password is "password"
    if (password !== 'password') {
      throw new Error('Invalid password');
    }

    const userData = mockUsers[email];
    if (!userData) {
      throw new Error('User not found');
    }

    // Check if role matches (or allow any role for flexibility)
    if (role && userData.role !== role) {
      throw new Error('Role mismatch');
    }

    const authenticatedUser = {
      ...userData,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    };

    setUser(authenticatedUser);
    localStorage.setItem('unavida_user', JSON.stringify(authenticatedUser));
    return authenticatedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unavida_user');
  };

  const isAuthenticated = user !== null;

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
