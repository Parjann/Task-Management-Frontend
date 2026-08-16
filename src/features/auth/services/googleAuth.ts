'use client';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/firebase';

export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error(
      'Firebase is not configured. Please ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in .env.local',
    );
  }

  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: 'select_account',
  });

  const result = await signInWithPopup(auth, provider);
  const firebaseUser = result.user;
  const idToken = await firebaseUser.getIdToken();

  return {
    idToken,
    user: firebaseUser,
  };
}
