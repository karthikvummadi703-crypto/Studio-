
'use client';

import { useMemo } from 'react';
import { 
  doc, 
  query, 
  collection, 
  limit, 
  where, 
  orderBy, 
  Firestore 
} from 'firebase/firestore';
import { useDoc, useCollection } from '@/firebase';

export function useDashboardData(userId: string | undefined, db: Firestore | undefined) {
  const profileRef = useMemo(() => 
    (userId && db ? doc(db, 'users', userId) : null), 
    [userId, db]
  );
  const { data: profile, isLoading: profileLoading } = useDoc<any>(profileRef);

  const activitiesQuery = useMemo(() => {
    if (!db || !userId) return null;
    return query(
      collection(db, 'activities'), 
      where('userId', '==', userId), 
      orderBy('timestamp', 'desc'),
      limit(5)
    );
  }, [db, userId]);
  const { data: activities, isLoading: activitiesLoading } = useCollection<any>(activitiesQuery);

  const recordsQuery = useMemo(() => {
    if (!db || !userId) return null;
    return query(
      collection(db, 'calculator_records'), 
      where('userId', '==', userId), 
      orderBy('timestamp', 'desc'),
      limit(10)
    );
  }, [db, userId]);
  const { data: records, isLoading: recordsLoading } = useCollection<any>(recordsQuery);

  const isLoading = profileLoading || activitiesLoading || recordsLoading;

  return {
    profile,
    activities,
    records,
    isLoading
  };
}
