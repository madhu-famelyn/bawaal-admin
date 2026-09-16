import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2, ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatusPill, statusTone } from "@/components/admin/StatusPill";
import { Button } from "@/components/ui/button";
import { useModeration } from "@/hooks/admin/useCatalog";
import { shortDate } from "@/lib/format";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({
    meta: [
      { title: "Moderation Queue — Echo Reels Admin" },
      {
        name: "description",
        content:
          "Review reported Echo Reels videos, approve safe content and remove violations from the catalog.",
      },
      { property: "og:title", content: "Moderation Queue — Echo Reels Admin" },
      {
        property: "og:description",
        content: "Review reported videos, approve safe content and remove violations.",
      },
    ],
  }),
  component: ModerationPage,
});

function ModerationPage() {
  const { reports, pending, isPending, resolveReport } = useModeration();

  return (
    <>
      <AdminTopbar
        title="Moderation"
        subtitle={`${pending.length} reports awaiting a decision`}
      />

      <div className="space-y-4 px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
          <ShieldAlert className="mt-0.5 size-4 text-destructive" />
          <p className="text-muted-foreground">
            Removing a video hides it from every surface immediately and notifies the creator.
          </p>
        </div>

        {isPending ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" /> Loading reports…
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {reports.map((r) => (
              <div key={r.id} className="panel space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.videoTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.reason} · {r.reports} reports · {shortDate(r.reportedAt)}
                    </p>
                  </div>
                  <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill>
                </div>

                {r.note && <p className="text-sm text-muted-foreground">{r.note}</p>}

                {r.status === "pending" && (
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        resolveReport(r.id, "approved");
                        toast.success(`Kept "${r.videoTitle}"`);
                      }}
                    >
                      <Check className="size-4" /> Keep live
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        resolveReport(r.id, "removed");
                        toast.success(`Removed "${r.videoTitle}"`);
                      }}
                    >
                      <X className="size-4" /> Remove video
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
