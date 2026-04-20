import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell flex min-h-[100dvh] items-center fade-up">
      <section className="panel grid w-full overflow-hidden lg:grid-cols-[1fr_1fr]">
        <aside className="relative hidden min-h-[560px] bg-gradient-to-br from-slate-950 to-slate-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -left-10 -bottom-8 h-44 w-44 rounded-full bg-white/12 blur-2xl" />
          <div>
            <img src="/favicon-192x192.png" alt="Subora" className="h-14 w-14 rounded-2xl border border-white/30 bg-white/10 p-1" />
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/70">Get started</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">Create your account and take control of recurring spend.</h1>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Join Subora in minutes and track subscriptions with a cleaner, premium experience.
            </p>
          </div>

          <div className="space-y-3 text-sm text-white/85">
            <p className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">Fast onboarding and clean dashboard experience.</p>
            <p className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">Secure sessions with protected profile settings.</p>
          </div>
        </aside>

        <div className="p-7 sm:p-10">
          <div className="lg:hidden">
            <img src="/favicon-192x192.png" alt="Subora" className="mb-4 h-12 w-12 rounded-xl border border-slate-300 shadow-sm" />
          </div>

          <p className="eyebrow">Create account</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Start with Subora today</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Set up your account and unlock a modern command center for subscriptions.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="field-label">
              Full name
              <input
                type="text"
                value={form.full_name}
                onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
                className="field-input"
                autoComplete="name"
                maxLength={255}
                required
              />
            </label>

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
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
              />
            </label>

            {error ? <p className="status-error">{error}</p> : null}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-slate-900 underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
