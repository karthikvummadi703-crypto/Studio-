/**
 * @fileOverview Distributed rate limiter using Firestore transactions.
 * IMPORTANT: This module must only run server-side (API routes / Server Actions).
 * The Firestore `rate_limits` collection is locked to client access in security rules.
 *
 * @param ip       The IP address to rate limit.
 * @param limit    Maximum requests allowed in the window.
 * @param windowMs The time window in milliseconds.
 */

import { db } from '@/firebase';
import { doc, runTransaction } from 'firebase/firestore';

/** Hard cap on stored timestamps per IP to prevent unbounded array growth. */
const MAX_STORED_TIMESTAMPS = 200;

export async function checkRateLimit(
  ip: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean }> {
  if (!db) return { allowed: true };

  const limitRef = doc(db, 'rate_limits', ip);
  const now = Date.now();

  try {
    const result = await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(limitRef);

      let timestamps: number[] = [];
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Filter expired timestamps, then cap array length to prevent unbounded growth
        timestamps = (data.timestamps || [])
          .filter((ts: number) => now - ts < windowMs)
          .slice(-MAX_STORED_TIMESTAMPS);
      }

      if (timestamps.length >= limit) {
        return { allowed: false };
      }

      timestamps.push(now);
      transaction.set(limitRef, { timestamps }, { merge: true });
      return { allowed: true };
    });

    return result;
  } catch (error) {
    // Fail open on transaction errors (e.g., high contention) to avoid blocking
    // legitimate traffic. Log for monitoring.
    console.error('[RateLimiter] Transaction error:', error);
    return { allowed: true };
  }
}
