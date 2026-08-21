'use client';

import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  city?: string;
  isAnonymous?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: UserData) => {
    // 1. Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    // 2. Save profile details to Firestore database under 'users/{userId}'
    await setDoc(doc(db, 'users', newUser.uid), {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: email,
      phoneNumber: userData.phoneNumber || '',
      city: userData.city || '',
      isAnonymous: userData.isAnonymous || false,
      currentHabitId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return newUser;
  };

  const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    return await firebaseSignOut(auth);
  };

  return { user, loading, signUp, signIn, signOut };
}