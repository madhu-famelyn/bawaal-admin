import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { videosService } from "@/services/admin/videos.service";
import { useAdminStore } from "@/store/adminStore";
import type { VideoPayload, VideoQuery, VideoStatus } from "@/types/admin";

export const videosQueryOptions = (query: VideoQuery) => ({
  queryKey: ["admin", "videos", query] as const,
  queryFn: () => videosService.list(query),
  refetchInterval: 3000,
});

/** Hook layer: screens read data from here, never from services directly. */
export function useVideos() {
  const filters = useAdminStore((s) => s.videoFilters);
  const language = useAdminStore((s) => s.language);
  const setVideoFilter = useAdminStore((s) => s.setVideoFilter);
  const queryClient = useQueryClient();

  const query: VideoQuery = {
    search: filters.search,
    status: filters.status,
    vertical: filters.vertical,
    language,
    page: filters.page,
    pageSize: 8,
  };

  const { data, isPending } = useQuery(videosQueryOptions(query));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "videos"] });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: VideoStatus }) =>
      videosService.updateStatus(id, status),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => videosService.remove(id),
    onSuccess: invalidate,
  });

  const updateSection = useMutation({
    mutationFn: ({ id, sectionCategory }: { id: string; sectionCategory: string }) =>
      videosService.updateSection(id, sectionCategory),
    onSuccess: invalidate,
  });

  const pageCount = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return {
    videos: data?.items ?? [],
    total: data?.total ?? 0,
    page: filters.page,
    pageCount,
    isPending,
    filters,
    setVideoFilter,
    goToPage: (page: number) => setVideoFilter({ page }),
    updateStatus: (id: string, status: VideoStatus) => updateStatus.mutate({ id, status }),
    updateSection: (id: string, sectionCategory: string) => updateSection.mutate({ id, sectionCategory }),
    removeVideo: (id: string) => remove.mutate(id),
    isMutating: updateStatus.isPending || remove.isPending || updateSection.isPending,
  };
}

export function useCreateVideo(onDone?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VideoPayload) => videosService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "videos"] });
      onDone?.();
    },
  });
}
