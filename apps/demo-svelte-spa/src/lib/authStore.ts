import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

import { auth } from "./sdk";

export interface AuthState {
  isLoggedIn: boolean;
  username: string;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  username: "",
  error: null,
};

export const authState: Writable<AuthState> = writable(initialState);

let isCheckingLogin = false; // Prevent concurrent login checks

export const checkLogin = async (): Promise<void> => {
  // Prevent multiple concurrent login checks
  if (isCheckingLogin) {
    return;
  }
  
  isCheckingLogin = true;
  
  try {
    const ok = await auth.loginStatus();
    if (ok) {
      // User is logged in, get their username from the auth store
      const currentUser = auth.store.current_user;
      const username = currentUser?.name || "";
      
      // Only update state if it actually changed to prevent unnecessary re-renders
      authState.update((s) => {
        if (s.isLoggedIn !== true || s.username !== username) {
          return { ...s, isLoggedIn: true, username, error: null };
        }
        return s;
      });
    } else {
      // Only update state if it actually changed
      authState.update((s) => {
        if (s.isLoggedIn !== false) {
          return { ...s, isLoggedIn: false, username: "", error: null };
        }
        return s;
      });
    }
  } catch (e) {
    console.warn("Login status check failed:", e);
    // Only update state if it actually changed
    authState.update((s) => {
      if (s.isLoggedIn !== false) {
        return { ...s, isLoggedIn: false, username: "", error: "Login status check failed" };
      }
      return s;
    });
  } finally {
    isCheckingLogin = false;
  }
};

export const loginWithCredentials = async (username: string, password: string): Promise<void> => {
  try {
    await auth.getSessionToken();
    await auth.login(username, password);
    authState.set({ isLoggedIn: true, username, error: null });
  } catch (e) {
    authState.set({
      isLoggedIn: false,
      username: "",
      error: "Invalid credentials or server error",
    });
  }
};

export const logout = async (): Promise<void> => {
  try {
    await auth.logout();
  } catch (_e) {
    // no-op, treat as logged out regardless
  }
  authState.set({ isLoggedIn: false, username: "", error: null });
};
