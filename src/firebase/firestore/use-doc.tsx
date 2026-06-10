
'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentReference, 
  onSnapshot, 
  DocumentSnapshot, 
  DocumentData 
} from 'firebase/firestore';

export const useDoc = <T = DocumentData>(docRef: DocumentReference<T> | null) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docRef) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot<T>) => {
        setData(snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } : null);
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return { data, isLoading, error };
};
