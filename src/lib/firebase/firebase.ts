import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

/**
 * Aggressively cleans environment variables copied from JavaScript object snippets:
 * Removes leading/trailing quotes (", '), commas (,), semicolons (;), and whitespace.
 */
const cleanEnvVar = (val?: string): string => {
  if (!val) return '';
  return val
    .trim()
    .replace(/^["'`]|["'`,;]+$/g, '')
    .trim();
};

const firebaseConfig = {
  apiKey: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvVar(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  ),
  appId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;

  if (!firebaseConfig.apiKey) {
    console.error(
      '⚠️ NEXT_PUBLIC_FIREBASE_API_KEY is missing or empty. Please check your .env.local file and restart the Next.js dev server (npm run dev).',
    );
    return null;
  }

  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === 'undefined') return null;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;

  if (!auth) {
    auth = getAuth(firebaseApp);
  }
  return auth;
}
