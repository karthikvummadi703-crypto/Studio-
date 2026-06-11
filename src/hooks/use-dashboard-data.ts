'use client';

import { useMemo } from 'react';
import { 
  doc, 
  Firestore 
} from 'firebase/firestore';
import { useDoc, useCollection } from '@/firebase';
import type { UserProfile, CarbonRecord, Activity } from '@/types';
import { buildUserActivitiesQuery, buildUserCalculatorRecordsQuery } from '@/lib/firestore-queries';
import { COLLECTIONS } from '@/lib/constants';

/**
 * Aggregates dashboard telemetry including profile, recent activities, and carbon records.
 */
export function useDashboardData(userId: string | undefined, db: Firestore | undefined) {
  const profileRef = useMemo(() => 
    (userId && db ? doc(db, COLLECTIONS.USERS, userId) : null), 
    [userId, db]
  );
  const { data: profile, isLoading: profileLoading } = useDoc<UserProfile>(profileRef as any);

  const activitiesQuery = useMemo(() => {
    if (!db || !userId) return null;
    return buildUserActivitiesQuery(db, userId, 5);
  }, [db, userId]);
  const { data: activities, isLoading: activitiesLoading } = useCollection<Activity>(activitiesQuery);

  const recordsQuery = useMemo(() => {
    if (!db || !userId) return null;
    return buildUserCalculatorRecordsQuery(db, userId, { limitCount: 10 });
  }, [db, userId]);
  const { data: records, isLoading: recordsLoading } = useCollection<CarbonRecord>(recordsQuery);

  const isLoading = profileLoading || activitiesLoading || recordsLoading;

  return {
    profile,
    activities,
    records,
    isLoading
  };
}
