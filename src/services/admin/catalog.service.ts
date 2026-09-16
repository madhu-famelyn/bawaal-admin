import { http } from "@/services/http/client";
import type {
  AdminUser,
  Category,
  Creator,
  DashboardStats,
  ModerationReport,
  ReportStatus,
} from "@/types/admin";

export const statsService = {
  dashboard: async (): Promise<DashboardStats> => {
    const { data } = await http.get<DashboardStats>("/admin/stats");
    return data;
  },
};

export const creatorsService = {
  list: async (): Promise<Creator[]> => {
    const { data } = await http.get<Creator[]>("/admin/creators");
    return data;
  },
  setVerified: async (id: string, verified: boolean): Promise<Creator> => {
    const { data } = await http.patch<Creator>(`/admin/creators/${id}`, { verified });
    return data;
  },
};

export const categoriesService = {
  list: async (): Promise<Category[]> => {
    const { data } = await http.get<Category[]>("/admin/categories");
    return data;
  },
  update: async (id: string, patch: Partial<Category>): Promise<Category> => {
    const { data } = await http.patch<Category>(`/admin/categories/${id}`, patch);
    return data;
  },
};

export const usersService = {
  list: async (): Promise<AdminUser[]> => {
    const { data } = await http.get<AdminUser[]>("/admin/users");
    return data;
  },
  update: async (id: string, patch: Partial<AdminUser>): Promise<AdminUser> => {
    const { data } = await http.patch<AdminUser>(`/admin/users/${id}`, patch);
    return data;
  },
};

export const moderationService = {
  list: async (): Promise<ModerationReport[]> => {
    const { data } = await http.get<ModerationReport[]>("/admin/reports");
    return data;
  },
  resolve: async (id: string, status: ReportStatus): Promise<ModerationReport> => {
    const { data } = await http.patch<ModerationReport>(`/admin/reports/${id}`, { status });
    return data;
  },
};

