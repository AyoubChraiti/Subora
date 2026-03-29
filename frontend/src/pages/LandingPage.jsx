import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-6 py-10 sm:py-14">
      <header className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white/75 px-5 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img src="/favicon-192x192.png" alt="Subora" className="h-10 w-10 rounded-xl border border-ink/10 shadow-sm" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/55">Subora</p>
            <p className="text-sm font-medium text-ink/80">Subscription Control Center</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link to="/dashboard" className="primary-btn">
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="secondary-btn">
                Sign in
              </Link>
              <Link to="/register" className="primary-btn">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="mt-8 grid flex-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="surface-card flex flex-col justify-between p-8 sm:p-10">
          <div>
            <p className="inline-flex rounded-full bg-warm px-3 py-1 text-xs uppercase tracking-[0.18em] text-ink/70">
              Spend clarity for modern teams
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Stop subscription creep before it drains your budget.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
              Subora gives you one clean place to monitor renewals, track monthly spend, and take action fast.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={isAuthenticated ? "/dashboard" : "/register"} className="primary-btn px-6 py-3">
                {isAuthenticated ? "Go to dashboard" : "Create free account"}
              </Link>
              <Link to="/login" className="secondary-btn px-6 py-3">
                Sign in
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-ink/10 bg-white/70 p-4">
              <p className="text-2xl font-semibold text-ink">1 view</p>
              <p className="mt-1 text-sm text-ink/65">All subscriptions in one dashboard</p>
            </div>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-4">
              <p className="text-2xl font-semibold text-ink">Real-time</p>
              <p className="mt-1 text-sm text-ink/65">Track costs and renewals instantly</p>
            </div>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-4">
              <p className="text-2xl font-semibold text-ink">Secure</p>
              <p className="mt-1 text-sm text-ink/65">JWT auth and protected user data</p>
            </div>
          </div>
        </article>

        <aside className="surface-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink">Why teams choose Subora</h2>
          <ul className="mt-5 space-y-4 text-sm text-ink/75">
            <li className="rounded-xl border border-ink/10 bg-white/80 p-4">
              Automatic monthly-cost normalization from weekly, monthly, and yearly plans.
            </li>
            <li className="rounded-xl border border-ink/10 bg-white/80 p-4">
              Upcoming renewals surfaced clearly so nothing sneaks up on finance.
            </li>
            <li className="rounded-xl border border-ink/10 bg-white/80 p-4">
              Fast account setup with clean profile settings and secure session handling.
            </li>
          </ul>

          <div className="mt-6 rounded-2xl bg-ink p-5 text-white">
            <p className="text-sm uppercase tracking-[0.16em] text-white/70">Ready to simplify billing?</p>
            <p className="mt-2 text-lg font-medium">Launch your workspace in under 2 minutes.</p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-medium text-ink">
              {isAuthenticated ? "Open app" : "Start now"}
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default LandingPage;
