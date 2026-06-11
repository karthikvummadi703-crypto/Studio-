/**
 * @fileOverview Environment-aware logger for EcoPulse AI.
 * Logs all errors in production, suppresses info/debug/log in production.
 */

const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  log: (...args: unknown[]): void => {
    if (!isProd) console.log('[EcoPulse]', ...args);
  },
  error: (...args: unknown[]): void => {
    // Always log errors, even in production
    console.error('[EcoPulse Error]', ...args);
  },
  warn: (...args: unknown[]): void => {
    console.warn('[EcoPulse Warn]', ...args);
  },
  info: (...args: unknown[]): void => {
    if (!isProd) console.info('[EcoPulse]', ...args);
  },
};
