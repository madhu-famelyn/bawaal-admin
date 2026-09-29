import { http } from "@/services/http/client";
import type { Paginated, Video, VideoPayload, VideoQuery } from "@/types/admin";

export const videosService = {
  list: async (query: VideoQuery = {}): Promise<Paginated<Video>> => {
    const { data } = await http.get<Paginated<Video>>("/admin/videos", { params: query });
    return data;
  },

  get: async (id: string): Promise<Video> => {
    const { data } = await http.get<Video>(`/admin/videos/${id}`);
    return data;
  },

  create: async (payload: VideoPayload): Promise<Video> => {
    const { data } = await http.post<Video>("/admin/videos", payload);
    return data;
  },

  updateStatus: async (id: string, status: Video["status"]): Promise<Video> => {
    const { data } = await http.patch<Video>(`/admin/videos/${id}`, { status });
    return data;
  },

  updateSection: async (id: string, sectionCategory: string): Promise<Video> => {
    const { data } = await http.patch<Video>(`/admin/videos/${id}`, { sectionCategory });
    return data;
  },

  remove: async (id: string): Promise<string> => {
    await http.delete(`/admin/videos/${id}`);
    return id;
  },
};

