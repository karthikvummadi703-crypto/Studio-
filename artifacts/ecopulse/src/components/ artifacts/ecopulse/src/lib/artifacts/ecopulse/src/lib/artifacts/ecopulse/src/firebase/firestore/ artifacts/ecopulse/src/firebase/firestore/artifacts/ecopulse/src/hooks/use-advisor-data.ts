import { useMemo, useState, useEffect } from 'react';
import { Firestore, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { logger } from '@/lib/logger';
import type { UserProfile, AIConversation } from '@/types';
import { buildUserConversationsQuery } from '@/lib/firestore-queries';

interface AdvisorData {
  profile: UserProfile | null;
  chats: AIConversation[];
  isLoading: boolean;
}

export function useAdvisorData(userId: string | undefined, db: Firestore | undefined): AdvisorData {
  const { profile, isProfileLoading } = useFirebase();
  const [chats, setChats] = useState<AIConversation[]>([]);
  const [isChatsLoading, setIsChatsLoading] = useState(true);

  const historyQuery = useMemo(() => {
    if (!userId || !db) return null;
    return buildUserConversationsQuery(db, userId);
  }, [userId, db]);

  useEffect(() => {
    if (!userId || !db || !historyQuery) {
      setChats([]);
      setIsChatsLoading(false);
      return;
    }

    setIsChatsLoading(true);

    const unsubscribe = onSnapshot(
      historyQuery,
      (snap) => {
        const chatsData = snap.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as AIConversation)
        );
        setChats(chatsData);
        setIsChatsLoading(false);
      },
      (error) => {
        logger.error('[useAdvisorData] Snapshot error:', error);
        setIsChatsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, db, historyQuery]);

  return {
    profile,
    chats,
    isLoading: isProfileLoading || isChatsLoading,
  };
}
