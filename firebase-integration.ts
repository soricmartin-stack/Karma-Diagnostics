
import { UserProfile, StoredResult } from './types';

/**
 * Universal Cloud Database Simulation (Firebase Pattern)
 */

const STORAGE_KEY = 'soul_app_cloud_db';

const getDatabase = () => {
  const db = localStorage.getItem(STORAGE_KEY);
  return db ? JSON.parse(db) : { users: {} };
};

const saveDatabase = (db: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const authService = {
  signInWithGoogle: async (): Promise<UserProfile> => {
    // Simulated Google OAuth Flow
    await new Promise(r => setTimeout(r, 800));
    const mockGoogleUser = {
      name: "Soul Traveler",
      email: "traveler@gmail.com",
      authMethod: 'GOOGLE' as const,
      language: 'en',
      history: []
    };
    
    // Check if user exists in our "cloud"
    const db = getDatabase();
    if (db.users[mockGoogleUser.email]) {
      return db.users[mockGoogleUser.email];
    }
    
    // Create new cloud profile
    db.users[mockGoogleUser.email] = mockGoogleUser;
    saveDatabase(db);
    return mockGoogleUser;
  },

  signOut: async () => {
    await new Promise(r => setTimeout(r, 300));
    return true;
  }
};

export const firestoreService = {
  saveUserProfile: async (user: UserProfile) => {
    await new Promise(r => setTimeout(r, 400));
    const db = getDatabase();
    db.users[user.email.toLowerCase()] = user;
    saveDatabase(db);
    return true;
  },

  getUserProfile: async (email: string): Promise<UserProfile | null> => {
    await new Promise(r => setTimeout(r, 400));
    const db = getDatabase();
    return db.users[email.toLowerCase()] || null;
  }
};
