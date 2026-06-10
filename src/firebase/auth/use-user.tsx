'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config';

/**
 * Production-ready useUser hook.
 * Treats anonymous Firebase sessions as unauthenticated to ensure Login Page priority.
 */
export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Treat anonymous users as unauthenticated to prevent auto-login to Demo mode
      if (firebaseUser && firebaseUser.isAnonymous) {
        setUser(null);
      } else {
        setUser(firebaseUser);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isLoading };
};
