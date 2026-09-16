import { create } from "zustand";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/config/platform";
import type { Role, VideoStatus } from "@/types/admin";

/** State management layer — shared between web and mobile clients. */

interface AdminSession {
  name: string;
  email: string;
  role: Role;
}

interface AdminState {
  session: AdminSession;
  language: LanguageCode | "all";
  videoFilters: {
    search: string;
    status: VideoStatus | "all";
    vertical: string | "all";
    page: number;
  };
  setLanguage: (language: LanguageCode | "all") => void;
  setVideoFilter: (patch: Partial<AdminState["videoFilters"]>) => void;
  resetVideoFilters: () => void;
}

const initialFilters = {
  search: "",
  status: "all" as const,
  vertical: "all" as const,
  page: 1,
};

export const useAdminStore = create<AdminState>((set) => ({
  session: { name: "Yeshwanth K", email: "yesh@echoreels.in", role: "ADMIN" },
  language: DEFAULT_LANGUAGE,
  videoFilters: { ...initialFilters },
  setLanguage: (language) => set({ language }),
  setVideoFilter: (patch) =>
    set((state) => ({
      videoFilters: {
        ...state.videoFilters,
        ...patch,
        page: patch.page ?? 1,
      },
    })),
  resetVideoFilters: () => set({ videoFilters: { ...initialFilters } }),
}));
