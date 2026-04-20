import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function LandingPage() {
  const { isAuthenticated } = useAuth();
  const primaryCta = isAuthenticated ? "/dashboard" : "/register";

  return (
    <main className="page-shell fade-up">
      <header className="sticky top-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <img src="/favicon-192x192.png" alt="Subora" className="h-11 w-11 rounded-xl border border-slate-300" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Subora</p>
            <p className="text-sm font-medium text-slate-700">Subscription intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Create account
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="panel relative mt-6 overflow-hidden p-8 sm:p-12">
        <div className="pointer-events-none absolute -top-12 right-8 h-48 w-48 rounded-full bg-slate-900/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-8 h-48 w-48 rounded-full bg-slate-400/20 blur-3xl" />

        <div className="relative grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article>
            <p className="eyebrow">Stop losing money to forgotten recurring charges</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-6xl">
              Save money and regain control over every subscription.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Track subscriptions, rent, WiFi bills, car payments, loans, memberships, and more in one clean workspace designed for fast decisions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={primaryCta} className="btn-primary px-6 py-3">
                {isAuthenticated ? "Open your workspace" : "Start free"}
              </Link>
              <a href="#pricing" className="btn-secondary px-6 py-3">
                View pricing
              </a>
            </div>
          </article>

          <aside className="soft-card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Live overview</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Monthly total</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">$1,847</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Upcoming this week</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">6</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Potential savings</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">$214</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-slate-900 bg-slate-950 p-4 text-white">
              <p className="text-sm text-white/75">Reminder sent:</p>
              <p className="mt-1 text-sm">"Your annual design tool renews in 3 days. Cancel before Apr 2 to avoid $119."</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-2">
        <article className="soft-card p-6 sm:p-7">
          <p className="eyebrow">The problem</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">Forgotten payments silently drain your budget.</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Most people track one or two subscriptions but miss the full recurring picture. Charges happen across apps, banks, and notes, causing leaks that add up every month.
          </p>
        </article>

        <article className="soft-card p-6 sm:p-7">
          <p className="eyebrow">The solution</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">One source of truth for all subscriptions.</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Subora combines reminders, calendar visibility, and clean reports to help you act before charges hit, optimize costs, and stay financially calm.
          </p>
        </article>
      </section>

      <section className="panel mt-7 p-7 sm:p-10">
        <div className="section-head">
          <div>
            <p className="eyebrow">Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Everything needed to stay ahead</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Email reminders before payment dates",
            "Customizable alert timing per subscription",
            "Dashboard overview with key totals",
            "Calendar view for scheduled payments",
            "Reports for trends and category insights",
            "Tags and folders for organization",
            "CSV import and export",
            "Future bank and accounting integrations",
            "Fast add/edit subscription forms",
          ].map((feature) => (
            <div key={feature} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-800">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-3">
        <article className="soft-card p-6">
          <p className="eyebrow">Use case</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Individuals</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Track home bills, streaming, fitness, and personal loans in one timeline.</p>
        </article>
        <article className="soft-card p-6">
          <p className="eyebrow">Use case</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Freelancers</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Separate client tools from personal costs using folders and exportable reports.</p>
        </article>
        <article className="soft-card p-6">
          <p className="eyebrow">Use case</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Small businesses</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Monitor software spend, recurring operations, and team subscriptions without clutter.</p>
        </article>
      </section>

      <section className="panel mt-7 p-7 sm:p-10">
        <p className="eyebrow">Track everything</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Not just subscriptions</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          Add any recurring payment: WiFi, rent, loans, insurance, tuition, gym plans, SaaS tools, maintenance contracts, and all other predictable charges.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["WiFi & utilities", "Rent & mortgages", "Car & transport", "Loans & credit", "Gym & health", "Streaming & apps", "Insurance", "Business tools"].map((item) => (
            <div key={item} className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-3">
        {["Add your subscriptions", "Set reminders and alert rules", "Review dashboard and optimize spend"].map((step, index) => (
          <article key={step} className="soft-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Step {index + 1}</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-950">{step}</h3>
            <p className="mt-2 text-sm text-slate-600">Simple setup with high signal outputs built for routine weekly check-ins.</p>
          </article>
        ))}
      </section>

      <section id="pricing" className="panel mt-7 p-7 sm:p-10">
        <p className="eyebrow">Pricing</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Simple plans, no clutter</h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-300 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Free</p>
            <p className="mt-3 text-4xl font-semibold text-slate-950">$0</p>
            <p className="mt-1 text-sm text-slate-600">For personal tracking basics</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Up to 20 subscriptions</li>
              <li>Calendar view</li>
              <li>Basic reminders</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-900 bg-slate-950 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">Pro</p>
            <p className="mt-3 text-4xl font-semibold">$9</p>
            <p className="mt-1 text-sm text-white/75">Per month, per workspace</p>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>Unlimited subscriptions</li>
              <li>Advanced reminder rules</li>
              <li>Reports, CSV import/export, future integrations</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="panel mt-7 p-8 text-center sm:p-12">
        <p className="eyebrow">Start now</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Build financial clarity before the next billing cycle.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Join users who replaced scattered reminders with one premium subscription workspace.
        </p>
        <Link to={primaryCta} className="btn-primary mt-6 px-6 py-3">
          {isAuthenticated ? "Go to dashboard" : "Create free account"}
        </Link>
      </section>

      <footer className="mt-7 mb-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p>Subora</p>
          <p>Subscription tracking for modern teams and individuals.</p>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
