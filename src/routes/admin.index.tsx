import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Eye,
  Film,
  Loader2,
  ShieldAlert,
  Timer,
  TrendingUp,
  UserSquare2,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatCard } from "@/components/admin/StatCard";
import { StatusPill, statusTone } from "@/components/admin/StatusPill";
import { Button } from "@/components/ui/button";
import { useDashboardStats, useModeration } from "@/hooks/admin/useCatalog";
import { useVideos } from "@/hooks/admin/useVideos";
import { compactNumber, fullNumber, shortDate } from "@/lib/format";
import { verticalLabel } from "@/config/platform";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Echo Reels Console" },
      {
        name: "description",
        content:
          "Echo Reels admin dashboard: track Bhojpuri micro-drama views, uploads, creators and moderation in one console.",
      },
      { property: "og:title", content: "Admin Dashboard — Echo Reels Console" },
      {
        property: "og:description",
        content: "Track views, uploads, creators and moderation for the Echo Reels catalog.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { stats, isPending } = useDashboardStats();
  const { videos } = useVideos();
  const { pending } = useModeration();

  return (
    <>
      <AdminTopbar
        title="Dashboard"
        subtitle="Catalog health, watch demand and moderation queue at a glance"
      />

      <div className="space-y-5 px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8">
        {isPending || !stats ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" /> Loading metrics…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
              <StatCard
                label="Watch hours"
                value={compactNumber(stats.watchHours)}
                hint="Last 7 days across all verticals"
                icon={Timer}
                accent
              />
              <StatCard
                label="Videos"
                value={fullNumber(stats.totalVideos)}
                hint={`${stats.publishedVideos} published · ${stats.processingVideos} processing`}
                icon={Film}
              />
              <StatCard
                label="Creators"
                value={fullNumber(stats.totalCreators)}
                hint="Studios and independent creators"
                icon={UserSquare2}
              />
              <StatCard
                label="Viewers"
                value={compactNumber(stats.totalUsers)}
                hint="Registered USER accounts"
                icon={Users}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <div className="panel p-4 sm:p-5 xl:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold">Views trend</h2>
                    <p className="text-xs text-muted-foreground">Daily plays this week</p>
                  </div>
                  <TrendingUp className="size-4 text-primary" />
                </div>
                <div className="h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.viewsTrend}>
                      <defs>
                        <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.55} />
                          <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
                      <YAxis
                        stroke="var(--color-muted-foreground)"
                        fontSize={11}
                        width={38}
                        tickFormatter={(v: number) => compactNumber(v)}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--color-popover)",
                          border: "1px solid var(--color-border)",
                          borderRadius: 12,
                          color: "var(--color-popover-foreground)",
                        }}
                        formatter={(v) => [fullNumber(Number(v)), "Views"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="var(--color-chart-1)"
                        strokeWidth={2}
                        fill="url(#viewsFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel p-4 sm:p-5">
                <h2 className="text-sm sm:text-base font-semibold">Vertical mix</h2>
                <p className="text-xs text-muted-foreground">Views by content vertical</p>
                <div className="mt-4 h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.verticalMix} layout="vertical">
                      <CartesianGrid stroke="var(--color-border)" horizontal={false} />
                      <XAxis
                        type="number"
                        stroke="var(--color-muted-foreground)"
                        fontSize={11}
                        tickFormatter={(v: number) => compactNumber(v)}
                      />
                      <YAxis
                        type="category"
                        dataKey="vertical"
                        width={78}
                        stroke="var(--color-muted-foreground)"
                        fontSize={11}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--color-popover)",
                          border: "1px solid var(--color-border)",
                          borderRadius: 12,
                          color: "var(--color-popover-foreground)",
                        }}
                        formatter={(v) => [fullNumber(Number(v)), "Views"]}
                      />
                      <Bar dataKey="views" fill="var(--color-chart-1)" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <div className="panel overflow-hidden xl:col-span-2">
                <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold">Latest uploads</h2>
                    <p className="text-[11px] sm:text-xs text-muted-foreground hidden sm:block">Recently added videos to the Bhojpuri catalog</p>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="h-8 text-xs px-2.5">
                    <Link to="/admin/videos">Manage all</Link>
                  </Button>
                </div>
                <ul className="divide-y divide-border">
                  {videos.slice(0, 6).map((v) => (
                    <li key={v.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 hover:bg-secondary/20 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs sm:text-sm font-medium text-foreground">{v.title}</p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                          <span className="shrink-0">{verticalLabel(v.vertical)}</span>
                          <span className="opacity-30">•</span>
                          <span className="truncate">{v.creatorName}</span>
                          <span className="opacity-30 hidden sm:inline">•</span>
                          <span className="shrink-0 hidden sm:inline">{shortDate(v.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
                          <Eye className="size-3" /> {compactNumber(v.views)}
                        </span>
                        <StatusPill tone={statusTone(v.status)} className="shrink-0 text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5">
                          {v.status}
                        </StatusPill>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="size-4 text-destructive" />
                    <h2 className="text-sm sm:text-base font-semibold">Moderation queue</h2>
                  </div>
                  <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-destructive">
                    {pending.length} pending
                  </span>
                </div>
                <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">
                  Reports requiring moderation action
                </p>
                <ul className="mt-3.5 space-y-2.5">
                  {pending.slice(0, 4).map((r) => (
                    <li key={r.id} className="rounded-xl border border-border/70 bg-secondary/30 p-3 transition-colors hover:bg-secondary/50">
                      <p className="truncate text-xs sm:text-sm font-medium">{r.videoTitle}</p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="rounded bg-destructive/15 px-1.5 py-0.5 font-medium text-destructive capitalize">
                          {r.reason}
                        </span>
                        <span className="opacity-30">•</span>
                        <span>{r.reports} reports</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="secondary" className="mt-3.5 w-full h-9 text-xs sm:text-sm">
                  <Link to="/admin/moderation">Open moderation</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
