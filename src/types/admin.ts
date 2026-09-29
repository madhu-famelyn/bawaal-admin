import type { LanguageCode } from "@/config/platform";

export type Role = "USER" | "ADMIN";

export type VideoStatus = "draft" | "processing" | "published" | "scheduled" | "rejected";
export type VideoKind = "short" | "episode" | "movie" | "trailer";

export interface Creator {
  id: string;
  name: string;
  handle: string;
  language: LanguageCode;
  avatarUrl?: string;
  verified: boolean;
  followers: number;
  videoCount: number;
  joinedAt: string;
}

export interface Video {
  id: string;
  title: string;
  vertical: string;
  language: LanguageCode;
  kind: VideoKind;
  status: VideoStatus;
  sectionCategory: string;
  mature: boolean;
  durationSec: number;
  episodes?: number;
  views: number;
  likes: number;
  rating: number;
  creatorId: string;
  creatorName: string;
  thumbnailUrl?: string;
  hlsUrl?: string;
  createdAt: string;
  publishedAt?: string;
}

export interface Category {
  id: string;
  slug: string;
  label: string;
  emoji: string;
  language: LanguageCode | "all";
  mature: boolean;
  featured: boolean;
  videoCount: number;
  order: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  language: LanguageCode;
  status: "active" | "suspended";
  watchMinutes: number;
  createdAt: string;
}

export type ReportReason = "nudity" | "violence" | "copyright" | "spam" | "misinformation";
export type ReportStatus = "pending" | "approved" | "removed";

export interface ModerationReport {
  id: string;
  videoId: string;
  videoTitle: string;
  reason: ReportReason;
  reports: number;
  status: ReportStatus;
  reportedAt: string;
  note?: string;
}

export interface DashboardStats {
  totalVideos: number;
  publishedVideos: number;
  processingVideos: number;
  totalCreators: number;
  totalUsers: number;
  totalViews: number;
  watchHours?: number;
  pendingReports: number;
  viewsTrend: { day: string; views: number }[];
  verticalMix: { vertical: string; views: number }[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface VideoQuery {
  search?: string;
  status?: VideoStatus | "all";
  vertical?: string | "all";
  language?: LanguageCode | "all";
  page?: number;
  pageSize?: number;
}

export interface VideoPayload {
  title: string;
  description: string;
  vertical: string;
  language: LanguageCode;
  kind: VideoKind;
  status: VideoStatus;
  sectionCategory: string;
  mature: boolean;
  durationSec: number;
  creatorId: string;
  hlsUrl?: string;
  thumbnailUrl?: string;
}
