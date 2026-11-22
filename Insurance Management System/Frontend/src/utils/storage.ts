import type { AuthUser } from '../types/auth';

const KEY = 'ims_auth';

export const getStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const storeUser = (user: AuthUser): void => {
  localStorage.setItem(KEY, JSON.stringify(user));
};

export const clearStoredUser = (): void => {
  localStorage.removeItem(KEY);
};