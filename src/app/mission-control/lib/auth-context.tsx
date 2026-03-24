'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase-config';

// Role definitions
// ADMIN: Full read/write access (Josh + Claude)
// ANALYST: Read + download, can add notebook entries
// OBSERVER: Read-only, can download evidence
export type UserRole = 'admin' | 'analyst' | 'observer';

interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  invitedBy: string;
  invitedAt: string;
  lastLogin: string;
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  canWrite: boolean;
  canDownload: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  isAdmin: false,
  canWrite: false,
  canDownload: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user profile from Firestore
        try {
          const profileDoc = await getDoc(doc(db, 'mission-control-users', firebaseUser.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data() as UserProfile;
            if (!data.active) {
              // Account deactivated
              await signOut(auth);
              setError('Account has been deactivated. Contact the administrator.');
              setProfile(null);
            } else {
              setProfile(data);
              setError(null);
            }
          } else {
            // User exists in Firebase Auth but not in our users collection
            // This means they weren't properly invited
            await signOut(auth);
            setError('Access denied. This system is invite-only.');
            setProfile(null);
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
          setError('Error loading profile.');
          setProfile(null);
        }
      } else {
        setProfile(null);
        setError(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid credentials.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Try again later.');
      } else {
        setError('Authentication failed.');
      }
      setLoading(false);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      setError('Google sign-in failed.');
      setLoading(false);
    }
  };

  // Handle redirect result on page load
  useEffect(() => {
    getRedirectResult(auth).catch(() => {
      // Redirect result errors are handled by onAuthStateChanged
    });
  }, []);

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const isAdmin = profile?.role === 'admin';
  const canWrite = profile?.role === 'admin';
  const canDownload = profile?.role !== undefined; // All authenticated users can download

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, login, loginWithGoogle, logout, isAdmin, canWrite, canDownload }}>
      {children}
    </AuthContext.Provider>
  );
}
