
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Hardened Firebase Production Configuration
 * Synchronized with Studio Project 9772282798
 */
const firebaseConfig = {
  apiKey: "AIzaSyCiAHwWhFFF7RyOByxe4PsYxOSy8jgKZAo",
  authDomain: "studio-9772282798-f7257.firebaseapp.com",
  projectId: "studio-9772282798",
  storageBucket: "studio-9772282798-f7257.firebasestorage.app",
  messagingSenderId: "9772282798",
  appId: "1:9772282798:web:48a7b8e96f5e4d3c2b1a",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('[Firebase] Initialized successfully with Project ID:', firebaseConfig.projectId);
} catch (error) {
  console.error("[Firebase] Initialization failed:", error);
  throw error;
}

export { app, auth, db };
