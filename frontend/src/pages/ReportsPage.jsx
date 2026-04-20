import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { fetchSubscriptionSummary } from "../services/api";

function ReportsPage() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchSubscriptionSummary({ months: 6 });
        if (isMounted) {
          setSummary(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Could not load reports");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const monthlySeries = summary?.monthly_series || [];
  const categoryBreakdown = summary?.category_breakdown || [];
  const highestValue = useMemo(() => {
    if (!monthlySeries.length) {
      return 1;
    }
    return Math.max(...monthlySeries.map((item) => Number(item.value)));
  }, [monthlySeries]);

  return (
    <>
      <Navbar userEmail={user?.email} onLogout={logout} />

      <main className="app-shell-fixed fade-up">
        <section className="panel app-panel-fit flex flex-col p-6 sm:p-8">
          <div className="section-head">
            <div>
              <p className="eyebrow">Reports</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Spending insights and trends</h1>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Understand your subscription spend over time so you can prune low-value plans and protect essential tools.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Average Monthly</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                ${summary ? Number(summary.total_monthly_estimate).toFixed(2) : "0.00"}
              </p>
            </article>
            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Projected Annual</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                ${summary ? Number(summary.projected_annual).toFixed(2) : "0.00"}
              </p>
            </article>
            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Upcoming (30d)</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{summary?.upcoming_count_30d || 0}</p>
            </article>
          </div>

          <div className="mt-5 grid min-h-0 flex-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="soft-card section-scroll p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-950">Recurring spend trend</h2>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Last 6 months</p>
              </div>

              <div className="mt-6 grid grid-cols-6 items-end gap-3">
                {isLoading ? <p className="col-span-6 text-sm text-slate-600">Loading chart...</p> : null}
                {!isLoading && error ? <p className="status-error col-span-6">{error}</p> : null}
                {!isLoading && !error && !monthlySeries.length ? <p className="col-span-6 text-sm text-slate-600">No data available.</p> : null}
                {monthlySeries.map((item) => {
                  const height = Math.max(24, Math.round((Number(item.value) / highestValue) * 200));
                  return (
                    <div key={item.month} className="flex flex-col items-center gap-2">
                      <div className="w-full rounded-md bg-slate-900" style={{ height: `${height}px` }} />
                      <p className="text-xs text-slate-500">{item.month}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="section-scroll space-y-5 pr-1">
              <section className="soft-card p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-950">Billing cycle allocation</h2>
                <div className="mt-4 space-y-2.5">
                  {isLoading ? <p className="text-sm text-slate-600">Loading categories...</p> : null}
                  {!isLoading && error ? <p className="status-error">{error}</p> : null}
                  {!isLoading && !error && !categoryBreakdown.length ? <p className="text-sm text-slate-600">No category data yet.</p> : null}
                  {categoryBreakdown.map((item) => (
                    <div key={item.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <p className="text-slate-700">{item.name}</p>
                        <p className="text-slate-500">{item.value}% • ${Number(item.amount).toFixed(2)}</p>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-slate-900" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="soft-card p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-950">Recommended actions</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">Review top category spend and trim low-value recurring items.</li>
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">Use alerts to prevent unwanted renewals before due dates.</li>
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">Keep tags/folders updated for cleaner monthly reporting.</li>
                </ul>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

export default ReportsPage;
