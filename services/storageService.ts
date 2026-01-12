
import { UserProfile } from '../types';

/**
 * Universal Storage Service
 * Designed to be easily swapped with a real Cloud Database (Firebase/Supabase)
 * for cross-device sync.
 */

const USER_PREFIX = 'soul_app_v1_';

export const storageService = {
  saveUser: async (user: UserProfile, secret: string) => {
    // Simulated cloud delay
    await new Promise(r => setTimeout(r, 300));
    const key = `${USER_PREFIX}${user.email.toLowerCase()}`;
    const payload = JSON.stringify({ user, secret });
    localStorage.setItem(key, payload);
    return true;
  },

  loadUser: async (email: string, secret: string): Promise<UserProfile | null> => {
    await new Promise(r => setTimeout(r, 300));
    const key = `${USER_PREFIX}${email.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    
    const data = JSON.parse(raw);
    if (data.secret === secret) return data.user;
    return null;
  },

  userExists: async (email: string): Promise<boolean> => {
    const key = `${USER_PREFIX}${email.toLowerCase()}`;
    return localStorage.getItem(key) !== null;
  }
};
