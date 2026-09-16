/**
 * Admin authentication — email + password validated against .env credentials.
 * Credentials never leave the browser; session is stored in localStorage.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  name: string;
  email: string;
}

interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

const ADMIN_EMAIL = import.meta.env["VITE_ADMIN_EMAIL"] ?? "";
const ADMIN_PASSWORD = import.meta.env["VITE_ADMIN_PASSWORD"] ?? "";
const ADMIN_NAME = import.meta.env["VITE_ADMIN_NAME"] ?? "Admin";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: (email: string, password: string) => {
        if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ user: { name: ADMIN_NAME, email: ADMIN_EMAIL }, error: null });
          return true;
        }
        set({ error: "Invalid email or password. Please try again." });
        return false;
      },

      logout: () => set({ user: null, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
