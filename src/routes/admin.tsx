import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    // Server-safe auth guard: redirect to /login if not authenticated
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem("admin-auth") : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.state?.user?.email) return; // authenticated — allow
      } catch {
        // malformed — fall through to redirect
      }
    }
    throw redirect({ to: "/login" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Client-side reactive guard (handles logout mid-session)
  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav />
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
