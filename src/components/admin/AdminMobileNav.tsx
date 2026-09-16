import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/auth";

const nav = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/videos", label: "Videos" },
  { to: "/admin/upload", label: "Upload" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/creators", label: "Creators" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/moderation", label: "Moderation" },
  { to: "/admin/analytics", label: "Analytics" },
] as const;

export function AdminMobileNav() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "A";

  return (
    <div className="border-b border-border bg-sidebar lg:hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-3.5" />
          </span>
          <span className="font-display font-semibold">
            Echo <span className="text-primary">Reels</span> Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
            {initials}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 py-3">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: "exact" in item ? item.exact : false }}
            activeProps={{ className: "bg-primary text-primary-foreground" }}
            inactiveProps={{ className: "bg-secondary text-secondary-foreground" }}
            className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
