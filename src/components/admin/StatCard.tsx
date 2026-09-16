import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "panel p-4 sm:p-5",
        accent && "border-primary/40 bg-gradient-to-br from-primary/12 to-transparent",
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <Icon className={cn("size-4 shrink-0", accent ? "text-primary" : "text-muted-foreground")} />
      </div>
      <p className="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-1">{hint}</p>}
    </div>
  );
}
