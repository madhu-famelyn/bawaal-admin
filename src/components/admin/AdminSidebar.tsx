import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Film,
  LayoutDashboard,
  ListTree,
  LogOut,
  ShieldAlert,
  Sparkles,
  Upload,
  Users,
  UserSquare2,
} from "lucide-react";
import { APP } from "@/config/platform";
import { useModeration } from "@/hooks/admin/useCatalog";
import { useAuthStore } from "@/lib/auth";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/videos", label: "Videos", icon: Film },
  { to: "/admin/upload", label: "Upload", icon: Upload },
  { to: "/admin/categories", label: "Categories", icon: ListTree },
  { to: "/admin/creators", label: "Creators", icon: UserSquare2 },
  { to: "/admin/users", label: "Users & Roles", icon: Users },
  { to: "/admin/moderation", label: "Moderation", icon: ShieldAlert },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function AdminSidebar() {
  const { pending } = useModeration();
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
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        <span className="font-display text-lg font-semibold">
          Echo <span className="text-primary">Reels</span>
        </span>
      </div>

      <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Admin console
      </p>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: "exact" in item ? item.exact : false }}
            activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
            inactiveProps={{ className: "text-sidebar-foreground/75" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent/60"
          >
            <item.icon className="size-4" />
            <span className="flex-1">{item.label}</span>
            {item.to === "/admin/moderation" && pending.length > 0 && (
              <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
                {pending.length}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* User card */}
      <div className="m-3 rounded-xl border border-sidebar-border bg-card p-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/20 text-sm font-bold text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name ?? "Admin"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="inline-flex rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary">
            ADMIN
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-3" />
            Sign out
          </button>
        </div>
      </div>
      <p className="px-5 pb-4 text-[11px] text-muted-foreground">{APP.tagline}</p>
    </aside>
  );
}
