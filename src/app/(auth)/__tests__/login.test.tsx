import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../login/page';
import * as auth from 'firebase/auth';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signInAnonymously: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  getAuth: vi.fn(),
}));

// Mock Firebase Config
vi.mock('@/firebase', () => ({
  auth: {},
  db: {},
}));

describe('LoginPage', () => {
  it('does not submit when email or password is empty', async () => {
    render(<LoginPage />);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);
    expect(auth.signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('calls signInAnonymously when Demo button is clicked', async () => {
    render(<LoginPage />);
    const demoBtn = screen.getByRole('button', { name: /demo/i });
    fireEvent.click(demoBtn);
    expect(auth.signInAnonymously).toHaveBeenCalled();
  });
});