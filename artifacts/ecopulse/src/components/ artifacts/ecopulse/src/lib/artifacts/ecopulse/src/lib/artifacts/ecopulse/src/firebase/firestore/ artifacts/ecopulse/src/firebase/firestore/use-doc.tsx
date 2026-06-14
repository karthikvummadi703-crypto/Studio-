import { useState, useEffect, useMemo, useRef } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';

export const useDoc = <T = DocumentData>(docRef: DocumentReference<T> | null) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const prevDataRef = useRef<string>('');

  const stableRef = useMemo(() => docRef, [docRef]);

  useEffect(() => {
    if (!stableRef) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      stableRef,
      (snapshot: DocumentSnapshot<T>) => {
        const docData = snapshot.exists()
          ? ({ ...snapshot.data(), id: snapshot.id } as T)
          : null;

        const dataJson = JSON.stringify(docData);
        if (dataJson !== prevDataRef.current) {
          prevDataRef.current = dataJson;
          setData(docData);
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [stableRef]);

  return { data, isLoading, error };
};
