import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, LoginPayload, RegisterPayload } from '../types/auth';
import { login as apiLogin, register as apiRegister } from '../api/auth';
import { getStoredUser, setToken, setStoredUser, clearAuth } from '../utils/auth';

interface AuthContextType {
  user: User | null;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  updateUser: (userData: User) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const login = useCallback(async (payload: LoginPayload): Promise<User> => {
    const response = await apiLogin(payload);
    const { token, user: userData } = response.data;
    setToken(token);
    setStoredUser(userData);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<User> => {
    const response = await apiRegister(payload);
    const { token, user: userData } = response.data;
    setToken(token);
    setStoredUser(userData);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const updateUser = useCallback((userData: User) => {
    setStoredUser(userData);
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
