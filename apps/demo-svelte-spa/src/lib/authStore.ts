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

export async function checkLogin(): Promise<void> {
  try {
    const ok = await auth.loginStatus();
    authState.update((s) => ({ ...s, isLoggedIn: ok, error: null }));
  } catch (e) {
    authState.update((s) => ({ ...s, isLoggedIn: false, error: "Login status failed" }));
  }
}

export async function loginWithCredentials(username: string, password: string): Promise<void> {
  try {
    await auth.getSessionToken();
    await auth.login(username, password);
    authState.set({ isLoggedIn: true, username, error: null });
  } catch (e) {
    authState.set({ isLoggedIn: false, username: "", error: "Invalid credentials or server error" });
  }
}

export async function logout(): Promise<void> {
  try {
    await auth.logout();
  } catch (_e) {
    // no-op, treat as logged out regardless
  }
  authState.set({ isLoggedIn: false, username: "", error: null });
}

