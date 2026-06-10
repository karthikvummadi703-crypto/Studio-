'use client';

import { useMemo, useState, useEffect } from 'react';
import { 
  doc, 
  query, 
  collection, 
  where, 
  orderBy, 
  Firestore,
  onSnapshot 
} from 'firebase/firestore';

/**
 * Custom hook that batches profile and chat history subscriptions into a single state object.
 */
export function useAdvisorData(userId: string | undefined, db: Firestore | undefined) {
  const [data, setData] = useState<any>({
    profile: null,
    chats: [],
    isLoading: true
  });

  useEffect(() => {
    if (!userId || !db) {
      setData({ profile: null, chats: [], isLoading: false });
      return;
    }

    const profileRef = doc(db, 'users', userId);
    const historyQuery = query(
      collection(db, 'ai_conversations'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    let profileUnsub: () => void;
    let chatsUnsub: () => void;

    // Batching logic: loading is false only when both streams have emitted at least once
    let profileReady = false;
    let chatsReady = false;

    profileUnsub = onSnapshot(profileRef, (snap) => {
      profileReady = true;
      setData((prev: any) => ({
        ...prev,
        profile: snap.exists() ? { ...snap.data(), id: snap.id } : null,
        isLoading: !(profileReady && chatsReady)
      }));
    });

    chatsUnsub = onSnapshot(historyQuery, (snap) => {
      chatsReady = true;
      const chats = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setData((prev: any) => ({
        ...prev,
        chats,
        isLoading: !(profileReady && chatsReady)
      }));
    });

    return () => {
      profileUnsub();
      chatsUnsub();
    };
  }, [userId, db]);

  return data;
}
