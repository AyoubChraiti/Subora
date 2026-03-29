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
    <main className="mx-auto flex min-h-[100dvh] max-w-5xl items-center justify-center px-6 py-10">
      <section className="surface-card w-full max-w-md p-8">
        <img src="/favicon-192x192.png" alt="Subora" className="mb-5 h-14 w-14 rounded-2xl border border-ink/10 shadow-sm" />
        <p className="mb-3 inline-flex rounded-full bg-warm px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink/70">
          Welcome Back
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Sign in to Subora</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">Manage all your subscriptions from one secure dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm text-ink/80">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="input-field"
              autoComplete="email"
              required
            />
          </label>

          <label className="block text-sm text-ink/80">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="input-field"
              autoComplete="current-password"
              minLength={8}
              maxLength={72}
              required
            />
          </label>

          {error ? <p className="status-error">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="primary-btn w-full"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-sm text-ink/70">
          New here?{" "}
          <Link to="/register" className="font-medium text-ink underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
