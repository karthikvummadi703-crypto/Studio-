'use client';

import { useMemo, useState, useEffect } from 'react';
import { 
  doc, 
  Firestore,
  onSnapshot 
} from 'firebase/firestore';
import type { UserProfile, AIConversation } from '@/types';
import { buildUserConversationsQuery } from '@/lib/firestore-queries';
import { COLLECTIONS } from '@/lib/constants';

interface AdvisorData {
  profile: UserProfile | null;
  chats: AIConversation[];
  isLoading: boolean;
}

/**
 * Custom hook that batches profile and chat history subscriptions.
 * Uses centralized query factory for history telemetry.
 */
export function useAdvisorData(userId: string | undefined, db: Firestore | undefined): AdvisorData {
  const [data, setData] = useState<AdvisorData>({
    profile: null,
    chats: [],
    isLoading: true
  });

  const historyQuery = useMemo(() => {
    if (!userId || !db) return null;
    return buildUserConversationsQuery(db, userId);
  }, [userId, db]);

  useEffect(() => {
    if (!userId || !db || !historyQuery) {
      setData({ profile: null, chats: [], isLoading: false });
      return;
    }

    const profileRef = doc(db, COLLECTIONS.USERS, userId);

    let profileReady = false;
    let chatsReady = false;

    const profileUnsub = onSnapshot(profileRef, (snap) => {
      profileReady = true;
      setData((prev: AdvisorData) => ({
        ...prev,
        profile: snap.exists() ? { ...snap.data(), id: snap.id } as UserProfile : null,
        isLoading: !(profileReady && chatsReady)
      }));
    });

    const chatsUnsub = onSnapshot(historyQuery, (snap) => {
      chatsReady = true;
      const chats = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as AIConversation));
      setData((prev: AdvisorData) => ({
        ...prev,
        chats,
        isLoading: !(profileReady && chatsReady)
      }));
    });

    return () => {
      profileUnsub();
      chatsUnsub();
    };
  }, [userId, db, historyQuery]);

  return data;
}
