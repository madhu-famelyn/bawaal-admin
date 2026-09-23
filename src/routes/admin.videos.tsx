import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatusPill, statusTone } from "@/components/admin/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CONTENT_VERTICALS, languageLabel, verticalLabel } from "@/config/platform";
import { useVideos } from "@/hooks/admin/useVideos";
import { compactNumber, duration, shortDate } from "@/lib/format";
import type { VideoStatus } from "@/types/admin";

const STATUSES: VideoStatus[] = ["draft", "processing", "scheduled", "published", "rejected"];

export const Route = createFileRoute("/admin/videos")({
  head: () => ({
    meta: [
      { title: "Video Catalog — Echo Reels Admin" },
      {
        name: "description",
        content:
          "Search, filter, publish and retire Bhojpuri videos, episodes and shorts from the Echo Reels catalog.",
      },
      { property: "og:title", content: "Video Catalog — Echo Reels Admin" },
      {
        property: "og:description",
        content: "Publish, schedule and moderate every video in the Echo Reels catalog.",
      },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  const {
    videos,
    total,
    page,
    pageCount,
    isPending,
    filters,
    setVideoFilter,
    goToPage,
    updateStatus,
    removeVideo,
  } = useVideos();

  return (
    <>
      <AdminTopbar title="Videos" subtitle={`${total} items match the current filters`} />

      <div className="space-y-4 px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) => setVideoFilter({ search: e.target.value })}
              placeholder="Search title or creator…"
              className="pl-9"
            />
          </div>

          <Select
            value={filters.status}
            onValueChange={(v) => setVideoFilter({ status: v as VideoStatus | "all" })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status">
                <span className="capitalize">
                  {filters.status === "all" ? "All statuses" : filters.status}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.vertical}
            onValueChange={(v) => setVideoFilter({ vertical: v })}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Vertical">
                {filters.vertical === "all" ? "All verticals" : verticalLabel(filters.vertical)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All verticals</SelectItem>
              {CONTENT_VERTICALS.map((v) => (
                <SelectItem key={v.slug} value={v.slug}>
                  {v.emoji} {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button asChild>
            <Link to="/admin/upload">
              <Plus className="size-4" /> New upload
            </Link>
          </Button>
        </div>

        <div className="panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Vertical</TableHead>
                <TableHead className="hidden lg:table-cell">Creator</TableHead>
                <TableHead className="hidden sm:table-cell">Length</TableHead>
                <TableHead className="hidden xl:table-cell">Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    <Loader2 className="mr-2 inline size-4 animate-spin" /> Loading catalog…
                  </TableCell>
                </TableRow>
              )}

              {!isPending && videos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No videos match these filters.
                  </TableCell>
                </TableRow>
              )}

              {videos.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <p className="font-medium">{v.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {languageLabel(v.language)} · {v.kind}
                      {v.episodes ? ` · ${v.episodes} eps` : ""}
                      {v.mature ? " · 18+" : ""}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {verticalLabel(v.vertical)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {v.creatorName}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {duration(v.durationSec)}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                    {compactNumber(v.views)}
                    <span className="ml-2 text-xs">{shortDate(v.publishedAt)}</span>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={statusTone(v.status)}>{v.status}</StatusPill>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Select
                        value={v.status}
                        onValueChange={(s) => {
                          updateStatus(v.id, s as VideoStatus);
                          toast.success(`"${v.title}" set to ${s}`);
                        }}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs">
                          <SelectValue>
                            <span className="capitalize">{v.status}</span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          removeVideo(v.id);
                          toast.success(`Removed "${v.title}"`);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {pageCount}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= pageCount}
              onClick={() => goToPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
