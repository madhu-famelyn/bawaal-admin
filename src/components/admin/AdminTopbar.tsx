import { Globe } from "lucide-react";
import { LANGUAGES, languageLabel, languageNativeLabel } from "@/config/platform";
import { useAdminStore } from "@/store/adminStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const language = useAdminStore((s) => s.language);
  const setLanguage = useAdminStore((s) => s.setLanguage);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground line-clamp-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Globe className="size-4 text-primary" />
        <Select value={language} onValueChange={(v) => setLanguage(v as typeof language)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Language">
              {language === "all"
                ? "All languages"
                : `${languageNativeLabel(language)} · ${languageLabel(language)}`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            {LANGUAGES.map((l) => (
              <SelectItem key={l.code} value={l.code} disabled={!l.enabled}>
                {l.nativeLabel} · {l.label}
                {!l.enabled ? " (soon)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
