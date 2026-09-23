import { createFileRoute } from "@tanstack/react-router";
import { Eye, Film, Flame, Loader2, Star } from "lucide-react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatCard } from "@/components/admin/StatCard";
import { useDashboardStats } from "@/hooks/admin/useCatalog";
import { useVideos } from "@/hooks/admin/useVideos";
import { compactNumber, duration } from "@/lib/format";
import { verticalLabel } from "@/config/platform";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Echo Reels Admin" },
      {
        name: "description",
        content:
          "Echo Reels performance analytics: top Bhojpuri videos, vertical share of views and watch-time totals.",
      },
      { property: "og:title", content: "Analytics — Echo Reels Admin" },
      {
        property: "og:description",
        content: "Top videos, vertical share of views and watch-time totals.",
      },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { stats, isPending } = useDashboardStats();
  const { videos } = useVideos();

  const top = [...videos].sort((a, b) => b.views - a.views).slice(0, 8);
  const maxViews = top[0]?.views ?? 1;
  const totalMixViews = (stats?.verticalMix ?? []).reduce((sum, v) => sum + v.views, 0) || 1;

  return (
    <>
      <AdminTopbar title="Analytics" subtitle="Where watch time is going this week" />

      <div className="space-y-5 px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8">
        {isPending || !stats ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" /> Loading analytics…
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total views"
                value={compactNumber(stats.totalViews ?? stats.viewsTrend.reduce((s, d) => s + d.views, 0))}
                icon={Eye}
                accent
              />
              <StatCard
                label="Published videos"
                value={fullNumber(stats.publishedVideos)}
                icon={Film}
              />
              <StatCard label="Top vertical" value={stats.verticalMix[0]?.vertical ?? "—"} icon={Flame} />
              <StatCard
                label="Avg. rating"
                value={(
                  videos.filter((v) => v.rating > 0).reduce((s, v) => s + v.rating, 0) /
                  Math.max(1, videos.filter((v) => v.rating > 0).length)
                ).toFixed(1)}
                icon={Star}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="panel p-5">
                <h2 className="text-base font-semibold">Top performing videos</h2>
                <ul className="mt-4 space-y-3">
                  {top.map((v, i) => (
                    <li key={v.id}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="truncate">
                          <span className="mr-2 text-muted-foreground">#{i + 1}</span>
                          {v.title}
                        </span>
                        <span className="shrink-0 text-muted-foreground">
                          {compactNumber(v.views)} · {duration(v.durationSec)}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.max(4, (v.views / maxViews) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel p-5">
                <h2 className="text-base font-semibold">Share of views by vertical</h2>
                <ul className="mt-4 space-y-3">
                  {stats.verticalMix.map((v) => (
                    <li key={v.vertical} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 truncate text-sm">
                        {verticalLabel(v.vertical.toLowerCase())}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-chart-2"
                          style={{ width: `${(v.views / totalMixViews) * 100}%` }}
                        />
                      </div>
                      <span className="w-14 shrink-0 text-right text-xs text-muted-foreground">
                        {Math.round((v.views / totalMixViews) * 100)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
