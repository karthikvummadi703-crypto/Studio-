
'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';

/**
 * Mocking useUser to bypass authentication during the design phase.
 * This returns a demo user object immediately.
 */
export const useUser = () => {
  const [user, setUser] = useState<User | null>({
    uid: 'demo-user-123',
    displayName: 'Eco Warrior',
    email: 'demo@ecopulse.ai',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'demo-token',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
  } as unknown as User);
  
  const [isLoading, setIsLoading] = useState(false);

  return { user, isLoading };
};
