import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  loginWithEmail,
  logoutUser,
  checkIsAdmin,
  sendAdminVerificationEmail,
  reloadCurrentUser
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  logout: () => Promise<void>;
  sendVerificationEmail: (targetUser?: User | null) => Promise<void>;
  reloadUser: () => Promise<{ user: User | null; isAdmin: boolean }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  login: async () => { throw new Error('Not initialized'); },
  logout: async () => {},
  sendVerificationEmail: async () => { throw new Error('Not initialized'); },
  reloadUser: async () => ({ user: null, isAdmin: false }),
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const adminStatus = await checkIsAdmin(currentUser);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedUser = await loginWithEmail(email, pass);
    setUser(loggedUser);
    const adminStatus = await checkIsAdmin(loggedUser);
    setIsAdmin(adminStatus);
    return loggedUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsAdmin(false);
  };

  const sendVerificationEmail = async (targetUser?: User | null) => {
    const active = targetUser || user || auth.currentUser;
    if (!active) {
      throw new Error('No user is currently signed in to receive a verification email.');
    }
    await sendAdminVerificationEmail(active);
  };

  const reloadUser = async (): Promise<{ user: User | null; isAdmin: boolean }> => {
    const refreshed = await reloadCurrentUser();
    if (refreshed) {
      // Create a shallow prototype clone to ensure React recognizes a new object reference
      const clone = Object.assign(Object.create(Object.getPrototypeOf(refreshed)), refreshed) as User;
      setUser(clone);
      const adminStatus = await checkIsAdmin(refreshed);
      setIsAdmin(adminStatus);
      return { user: clone, isAdmin: adminStatus };
    } else {
      setUser(null);
      setIsAdmin(false);
      return { user: null, isAdmin: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        logout,
        sendVerificationEmail,
        reloadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
