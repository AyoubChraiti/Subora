import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  clearAccessToken,
  fetchCurrentUser,
  getAccessToken,
  loginUser,
  registerUser,
  setAccessToken,
  setUnauthorizedHandler,
  updateCurrentUser,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
  }, []);

  const loadCurrentUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    try {
      const me = await fetchCurrentUser();
      setUser(me);
    } catch {
      logout();
    } finally {
      setIsAuthLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);

  const login = useCallback(async (input) => {
    const tokenResponse = await loginUser(input);
    setAccessToken(tokenResponse.access_token);
    const me = await fetchCurrentUser();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (input) => {
    await registerUser(input);
    return login({ email: input.email, password: input.password });
  }, [login]);

  const updateProfile = useCallback(async (input) => {
    const updatedUser = await updateCurrentUser(input);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      login,
      register,
      updateProfile,
      logout,
    }),
    [isAuthLoading, login, logout, register, updateProfile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
