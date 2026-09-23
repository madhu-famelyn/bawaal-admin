import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatusPill } from "@/components/admin/StatusPill";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCategories } from "@/hooks/admin/useCatalog";
import { fullNumber } from "@/lib/format";
import { languageLabel } from "@/config/platform";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Echo Reels Admin" },
      {
        name: "description",
        content:
          "Curate Echo Reels content verticals: feature rows, reorder categories and control mature gating per language.",
      },
      { property: "og:title", content: "Categories — Echo Reels Admin" },
      {
        property: "og:description",
        content: "Feature rows, reorder verticals and control mature gating per language.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { categories, isPending, updateCategory } = useCategories();

  return (
    <>
      <AdminTopbar
        title="Categories"
        subtitle="Verticals come from platform configuration — feature the rows your audience sees first"
      />

      <div className="px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8">
        {isPending ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" /> Loading categories…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((c) => (
              <div key={c.id} className="panel space-y-4 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-lg font-semibold">
                      <span className="mr-2">{c.emoji}</span>
                      {c.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      /{c.slug} ·{" "}
                      {c.language === "all" ? "All languages" : languageLabel(c.language)}
                    </p>
                  </div>
                  {c.mature && <StatusPill tone="danger">18+</StatusPill>}
                </div>

                <p className="text-sm text-muted-foreground">
                  {fullNumber(c.videoCount)} videos · row position {c.order}
                </p>

                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-sm">
                    <Star className="size-4 text-primary" /> Featured row
                  </span>
                  <Switch
                    checked={c.featured}
                    onCheckedChange={(featured) => {
                      updateCategory(c.id, { featured });
                      toast.success(
                        featured ? `${c.label} is now featured` : `${c.label} removed from featured`,
                      );
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    disabled={c.order === 1}
                    onClick={() => updateCategory(c.id, { order: c.order - 1 })}
                  >
                    Move up
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    disabled={c.order === categories.length}
                    onClick={() => updateCategory(c.id, { order: c.order + 1 })}
                  >
                    Move down
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
