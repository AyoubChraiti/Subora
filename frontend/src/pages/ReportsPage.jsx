import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const monthlySeries = [
  { month: "Jan", value: 1640 },
  { month: "Feb", value: 1580 },
  { month: "Mar", value: 1715 },
  { month: "Apr", value: 1690 },
  { month: "May", value: 1760 },
  { month: "Jun", value: 1665 },
];

const categoryBreakdown = [
  { name: "Housing", value: 44 },
  { name: "Loans", value: 19 },
  { name: "Utilities", value: 13 },
  { name: "Subscriptions", value: 9 },
  { name: "Transport", value: 8 },
  { name: "Other", value: 7 },
];

function ReportsPage() {
  const { user, logout } = useAuth();
  const highestValue = Math.max(...monthlySeries.map((item) => item.value));

  return (
    <>
      <Navbar userEmail={user?.email} onLogout={logout} />

      <main className="app-shell fade-up">
        <section className="panel p-6 sm:p-8">
          <div className="section-head">
            <div>
              <p className="eyebrow">Reports</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Spending insights and trends</h1>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Understand where recurring money goes over time so you can prune low-value costs and protect essential spend.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Average Monthly</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">$1,675</p>
            </article>
            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Projected Annual</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">$20,100</p>
            </article>
            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Alerts Triggered</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">18</p>
            </article>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="soft-card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-950">Recurring spend trend</h2>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Last 6 months</p>
              </div>

              <div className="mt-6 grid grid-cols-6 items-end gap-3">
                {monthlySeries.map((item) => {
                  const height = Math.max(24, Math.round((item.value / highestValue) * 200));
                  return (
                    <div key={item.month} className="flex flex-col items-center gap-2">
                      <div className="w-full rounded-md bg-slate-900" style={{ height: `${height}px` }} />
                      <p className="text-xs text-slate-500">{item.month}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="space-y-5">
              <section className="soft-card p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-950">Category allocation</h2>
                <div className="mt-4 space-y-2.5">
                  {categoryBreakdown.map((item) => (
                    <div key={item.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <p className="text-slate-700">{item.name}</p>
                        <p className="text-slate-500">{item.value}%</p>
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
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">Review duplicate subscriptions in the "Subscriptions" category</li>
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">Move utility reminders to 5 days in advance to reduce late fees</li>
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">Tag business expenses for cleaner month-end reconciliation</li>
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
