import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Query,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';

export const useCollection = <T = DocumentData>(query: Query<T> | null) => {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const prevDataRef = useRef<string>('');

  const stableQuery = useMemo(() => query, [query]);

  useEffect(() => {
    if (!stableQuery) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      stableQuery,
      (snapshot: QuerySnapshot<T>) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as T[];

        const itemsJson = JSON.stringify(items);
        if (itemsJson !== prevDataRef.current) {
          prevDataRef.current = itemsJson;
          setData(items);
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [stableQuery]);

  return { data, isLoading, error };
};
