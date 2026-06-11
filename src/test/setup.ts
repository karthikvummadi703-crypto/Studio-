import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock Firebase config to avoid real network calls in tests
vi.mock('@/firebase/config', () => ({
  app: {},
  auth: { currentUser: null },
  db: {},
}));

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => { cb(null); return vi.fn(); }),
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn(),
}));

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(undefined),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-id' }),
  getFirestore: vi.fn(),
  collection: vi.fn(),
  serverTimestamp: vi.fn(() => new Date()),
  onSnapshot: vi.fn(() => vi.fn()),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  writeBatch: vi.fn(() => ({ set: vi.fn(), update: vi.fn(), commit: vi.fn().mockResolvedValue(undefined) })),
  increment: vi.fn(),
}));

// Mock @/firebase provider hooks
vi.mock('@/firebase', () => ({
  useUser: () => ({ user: null, isLoading: false }),
  useFirestore: () => ({}),
  useDoc: () => ({ data: null, isLoading: false, error: null }),
  useCollection: () => ({ data: [], isLoading: false, error: null }),
  useAuth: () => ({}),
  auth: {},
  db: {},
  FirebaseClientProvider: ({ children }: any) => children,
}));