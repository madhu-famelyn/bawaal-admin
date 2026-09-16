import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { Eye, EyeOff, Film, Lock, Mail, ShieldCheck, Sparkles, Zap } from "lucide-react";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem("admin-auth") : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.state?.user?.email) throw redirect({ to: "/admin" });
      } catch (e) {
        if (e instanceof Response || (e as { _isRedirect?: boolean })?._isRedirect) throw e;
      }
    }
  },
  component: LoginPage,
});

const FEATURES = [
  { icon: Film, title: "Video Catalog", desc: "Upload, schedule and publish Bhojpuri short videos across all verticals." },
  { icon: ShieldCheck, title: "Roles & Moderation", desc: "Manage creators, reviewers and ADMIN roles with 18+ content gating." },
  { icon: Zap, title: "Live Analytics", desc: "Real-time views, engagement and revenue charts updated every minute." },
];

function LoginPage() {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 400));

    const ok = login(email.trim(), password);
    if (ok) {
      navigate({ to: "/admin" });
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[oklch(0.09_0.01_270)]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.16 72) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute -bottom-32 right-0 h-[500px] w-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.18 270) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Left panel — branding */}
      <div className="relative hidden w-[55%] flex-col justify-between p-12 lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="grid size-10 place-items-center rounded-xl"
            style={{ background: "oklch(0.78 0.16 72)", boxShadow: "0 0 20px oklch(0.78 0.16 72 / 0.5)" }}
          >
            <Sparkles className="size-5 text-black" />
          </div>
          <span className="font-display text-xl font-semibold text-white">
            Echo <span style={{ color: "oklch(0.78 0.16 72)" }}>Reels</span>
          </span>
        </div>

        <div className="space-y-6">
          <p
            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "oklch(0.78 0.16 72 / 0.15)", color: "oklch(0.78 0.16 72)" }}
          >
            Admin Console
          </p>
          <h1 className="max-w-md font-display text-5xl font-semibold leading-tight text-white">
            Manage the{" "}
            <span style={{ color: "oklch(0.78 0.16 72)" }}>Bhojpuri</span>{" "}
            video universe
          </h1>
          <p className="max-w-sm text-base leading-relaxed text-white/50">
            Upload films, schedule releases, moderate content and track analytics
            — all from one powerful dashboard.
          </p>
          <div className="mt-8 space-y-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div
                  className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg"
                  style={{ background: "oklch(0.78 0.16 72 / 0.12)" }}
                >
                  <f.icon className="size-4" style={{ color: "oklch(0.78 0.16 72)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="mt-0.5 text-sm text-white/45">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/25">© {new Date().getFullYear()} Echo Reels. Internal use only.</p>
      </div>

      {/* Divider */}
      <div className="hidden w-px bg-white/5 lg:block" />

      {/* Right panel — login form */}
      <div className="relative flex flex-1 items-center justify-center p-6">
        <div
          className={`w-full max-w-sm space-y-7 rounded-2xl p-8 transition-all ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          style={{
            background: "oklch(0.13 0.01 270 / 0.9)",
            border: "1px solid oklch(1 0 0 / 0.07)",
            boxShadow: "0 24px 64px -24px oklch(0 0 0 / 0.8)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="grid size-8 place-items-center rounded-lg" style={{ background: "oklch(0.78 0.16 72)" }}>
              <Sparkles className="size-4 text-black" />
            </div>
            <span className="font-display text-lg font-semibold text-white">
              Echo <span style={{ color: "oklch(0.78 0.16 72)" }}>Reels</span>
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl font-semibold text-white">Admin Login</h2>
            <p className="text-sm text-white/40">Enter your credentials to access the console.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50" htmlFor="admin-email">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/25" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  placeholder="admin@echoreels.in"
                  className="w-full rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:ring-2"
                  style={{
                    background: "oklch(1 0 0 / 0.05)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "oklch(0.78 0.16 72 / 0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "oklch(1 0 0 / 0.1)")}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50" htmlFor="admin-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/25" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  placeholder="••••••••"
                  className="w-full rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    background: "oklch(1 0 0 / 0.05)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "oklch(0.78 0.16 72 / 0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "oklch(1 0 0 / 0.1)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="flex items-center gap-2 rounded-xl px-3.5 py-3 text-sm"
                style={{ background: "oklch(0.45 0.2 25 / 0.15)", border: "1px solid oklch(0.55 0.2 25 / 0.3)", color: "oklch(0.75 0.15 25)" }}
              >
                <ShieldCheck className="size-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="relative w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-black transition-all disabled:opacity-50"
              style={{
                background: isSubmitting ? "oklch(0.65 0.12 72)" : "oklch(0.78 0.16 72)",
                boxShadow: "0 0 24px oklch(0.78 0.16 72 / 0.35)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Security note */}
          <div
            className="flex items-start gap-3 rounded-xl p-3.5"
            style={{ background: "oklch(1 0 0 / 0.03)", border: "1px solid oklch(1 0 0 / 0.05)" }}
          >
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-green-400/70" />
            <p className="text-xs leading-relaxed text-white/30">
              This console is restricted to authorised administrators only.
              Credentials are set via environment variables.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
