import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="mx-auto min-h-[100dvh] w-full max-w-6xl px-6 py-8 sm:py-12">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white/80 px-5 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img src="/favicon-192x192.png" alt="Subora" className="h-11 w-11 rounded-xl border border-ink/10 shadow-sm" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/55">Subora</p>
            <p className="text-sm font-medium text-ink/80">Subscription clarity made simple</p>
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
                Create account
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="mt-7 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="surface-card relative overflow-hidden p-8 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-warm/55 blur-3xl" />
          <div className="relative">
            <p className="inline-flex rounded-full bg-warm px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink/75">
              Built for busy people
            </p>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              A calmer way to manage every subscription you pay for.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/72 sm:text-lg">
              Subora helps you see everything in one place, know what renews next, and stay in control of recurring spend.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={isAuthenticated ? "/dashboard" : "/register"} className="primary-btn px-6 py-3">
                {isAuthenticated ? "Go to dashboard" : "Start free"}
              </Link>
              <Link to="/login" className="secondary-btn px-6 py-3">
                I already have an account
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-ink/10 bg-white/75 p-4">
                <p className="text-sm font-semibold text-ink">One dashboard</p>
                <p className="mt-1 text-sm text-ink/65">See all subscriptions without searching receipts.</p>
              </div>
              <div className="rounded-xl border border-ink/10 bg-white/75 p-4">
                <p className="text-sm font-semibold text-ink">Renewal alerts</p>
                <p className="mt-1 text-sm text-ink/65">Know what is coming before charges hit.</p>
              </div>
              <div className="rounded-xl border border-ink/10 bg-white/75 p-4">
                <p className="text-sm font-semibold text-ink">Secure access</p>
                <p className="mt-1 text-sm text-ink/65">Your account is protected with JWT auth.</p>
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-5">
          <section className="surface-card p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-ink">How it works</h2>
            <ol className="mt-4 space-y-3 text-sm text-ink/75">
              <li className="rounded-xl border border-ink/10 bg-white/75 p-4">1. Create your account in less than a minute.</li>
              <li className="rounded-xl border border-ink/10 bg-white/75 p-4">2. Add subscriptions with price, cycle, and renewal date.</li>
              <li className="rounded-xl border border-ink/10 bg-white/75 p-4">3. Track monthly totals and upcoming renewals instantly.</li>
            </ol>
          </section>

          <section className="surface-card bg-ink p-6 text-white sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">Ready to begin?</p>
            <p className="mt-2 text-2xl font-semibold leading-tight">Take control of your recurring spend today.</p>
            <p className="mt-2 text-sm text-white/80">No complicated setup. Just sign up and start tracking.</p>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="mt-5 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-medium text-ink"
            >
              {isAuthenticated ? "Open dashboard" : "Create your account"}
            </Link>
          </section>
        </aside>
      </section>
    </main>
  );
}

export default LandingPage;
