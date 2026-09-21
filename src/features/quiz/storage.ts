import { QuizSession } from "./types";

const SESSION_KEY = "rpt:session:v1";
const LOCALE_KEY = "rpt:locale_pref";

export interface StorageResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
  isAvailable: boolean;
}

export function isSessionStorageAvailable(): boolean {
  try {
    const testKey = "__rpt_test__";
    window.sessionStorage.setItem(testKey, testKey);
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function saveSessionToStorage(session: QuizSession): { success: boolean; isAvailable: boolean } {
  try {
    if (!window.sessionStorage) {
      return { success: false, isAvailable: false };
    }
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, isAvailable: true };
  } catch (err) {
    return { success: false, isAvailable: false };
  }
}

export function loadSessionFromStorage(): StorageResult<unknown> {
  try {
    if (!window.sessionStorage) {
      return { success: false, data: null, isAvailable: false };
    }
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return { success: true, data: null, isAvailable: true };
    }
    const parsed = JSON.parse(raw);
    return { success: true, data: parsed, isAvailable: true };
  } catch (err) {
    return { success: false, data: null, error: String(err), isAvailable: isSessionStorageAvailable() };
  }
}

export function clearSessionFromStorage(): void {
  try {
    if (window.sessionStorage) {
      // ONLY clear our app's specific keys, NEVER sessionStorage.clear()!
      window.sessionStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Ignore storage clear errors
  }
}

export function saveLocalePreference(locale: string): void {
  try {
    if (window.localStorage) {
      window.localStorage.setItem(LOCALE_KEY, locale);
    }
  } catch {
    // Non-critical
  }
}

export function loadLocalePreference(): string | null {
  try {
    if (window.localStorage) {
      return window.localStorage.getItem(LOCALE_KEY);
    }
  } catch {
    // Non-critical
  }
  return null;
}
