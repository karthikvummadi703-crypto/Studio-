import { describe, it, expect } from 'vitest';
import { getAuthErrorMessage } from '../src/lib/auth-errors';

describe('getAuthErrorMessage', () => {
  it('maps auth/wrong-password',        () => expect(getAuthErrorMessage('auth/wrong-password')).toBe('Invalid email or password.'));
  it('maps auth/user-not-found',        () => expect(getAuthErrorMessage('auth/user-not-found')).toBe('Invalid email or password.'));
  it('maps auth/invalid-credential',    () => expect(getAuthErrorMessage('auth/invalid-credential')).toBe('Invalid email or password.'));
  it('maps auth/email-already-in-use',  () => expect(getAuthErrorMessage('auth/email-already-in-use')).toBe('This email is already registered.'));
  it('maps auth/weak-password',         () => expect(getAuthErrorMessage('auth/weak-password')).toBe('The password is too weak.'));
  it('maps auth/too-many-requests',     () => expect(getAuthErrorMessage('auth/too-many-requests')).toBe('Too many attempts. Please try again later.'));
  it('maps auth/network-request-failed',() => expect(getAuthErrorMessage('auth/network-request-failed')).toBe('Network error. Please check your connection.'));
  it('maps auth/operation-not-allowed', () => expect(getAuthErrorMessage('auth/operation-not-allowed')).toBe('This sign-in method is currently disabled.'));
  it('fallback for unknown code',       () => expect(getAuthErrorMessage('auth/unknown-xyz')).toBe('Authentication failed. Please try again.'));
  it('fallback for empty string',       () => expect(getAuthErrorMessage('')).toBe('Authentication failed. Please try again.'));
});
