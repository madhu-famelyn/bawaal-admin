import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Check if already logged in → go to admin dashboard
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem("admin-auth") : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.state?.user?.email) {
          throw redirect({ to: "/admin" });
        }
      } catch (e) {
        if (e instanceof Response || (e as { _isRedirect?: boolean })?._isRedirect) throw e;
      }
    }
    // Not logged in → go to login
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
