import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const nextPath = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell flex min-h-[100dvh] items-center fade-up">
      <section className="panel grid w-full overflow-hidden lg:grid-cols-[1fr_1fr]">
        <aside className="relative hidden min-h-[560px] bg-gradient-to-br from-slate-950 to-slate-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div>
            <img src="/favicon-192x192.png" alt="Subora" className="h-14 w-14 rounded-2xl border border-white/30 bg-white/10 p-1" />
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/70">Welcome back</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">Your control center is waiting.</h1>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Sign in to review upcoming renewals, monitor spend, and keep recurring costs organized.
            </p>
          </div>

          <div className="space-y-3 text-sm text-white/85">
            <p className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">One premium dashboard for all recurring tools.</p>
            <p className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">Built for clarity, speed, and everyday decisions.</p>
          </div>
        </aside>

        <div className="p-7 sm:p-10">
          <div className="lg:hidden">
            <img src="/favicon-192x192.png" alt="Subora" className="mb-4 h-12 w-12 rounded-xl border border-slate-300 shadow-sm" />
          </div>

          <p className="eyebrow">Sign in</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Welcome to Subora</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Enter your credentials to continue to your recurring expense workspace.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="field-label">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="field-input"
                autoComplete="email"
                required
              />
            </label>

            <label className="field-label">
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="field-input"
                autoComplete="current-password"
                minLength={8}
                maxLength={72}
                required
              />
            </label>

            {error ? <p className="status-error">{error}</p> : null}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            New to Subora?{" "}
            <Link to="/register" className="font-medium text-slate-900 underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
