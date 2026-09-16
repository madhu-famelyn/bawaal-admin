import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  categoriesService,
  creatorsService,
  moderationService,
  statsService,
  usersService,
} from "@/services/admin/catalog.service";
import type { AdminUser, Category, ReportStatus } from "@/types/admin";

export function useDashboardStats() {
  const { data, isPending } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => statsService.dashboard(),
  });
  return { stats: data, isPending };
}

export function useCreators() {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["admin", "creators"],
    queryFn: () => creatorsService.list(),
  });
  const verify = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      creatorsService.setVerified(id, verified),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "creators"] }),
  });
  return {
    creators: data ?? [],
    isPending,
    toggleVerified: (id: string, verified: boolean) => verify.mutate({ id, verified }),
  };
}

export function useCategories() {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => categoriesService.list(),
  });
  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Category> }) =>
      categoriesService.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
  return {
    categories: [...(data ?? [])].sort((a, b) => a.order - b.order),
    isPending,
    updateCategory: (id: string, patch: Partial<Category>) => update.mutate({ id, patch }),
  };
}

export function useUsers() {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => usersService.list(),
  });
  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AdminUser> }) =>
      usersService.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
  return {
    users: data ?? [],
    isPending,
    updateUser: (id: string, patch: Partial<AdminUser>) => update.mutate({ id, patch }),
  };
}

export function useModeration() {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["admin", "reports"],
    queryFn: () => moderationService.list(),
  });
  const resolve = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReportStatus }) =>
      moderationService.resolve(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reports"] }),
  });
  return {
    reports: data ?? [],
    pending: (data ?? []).filter((r) => r.status === "pending"),
    isPending,
    resolveReport: (id: string, status: ReportStatus) => resolve.mutate({ id, status }),
  };
}
