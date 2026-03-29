import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import SubscriptionList from "../components/SubscriptionList";
import { useAuth } from "../context/AuthContext";
import { createSubscription, deleteSubscription, fetchSubscriptions } from "../services/api";

function toMonthlyCost(price, billingCycle) {
  const value = Number(price);
  if (Number.isNaN(value)) {
    return 0;
  }

  if (billingCycle === "yearly") {
    return value / 12;
  }

  if (billingCycle === "weekly") {
    return (value * 52) / 12;
  }

  return value;
}

function DashboardPage() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    billing_cycle: "monthly",
    next_renewal_date: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchSubscriptions();
        if (isMounted) {
          setItems(data.items || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Could not load subscriptions");
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

  async function handleCreate(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const created = await createSubscription({
        ...form,
        price: Number(form.price),
      });
      setItems((prev) => [...prev, created]);
      setForm({
        name: "",
        price: "",
        billing_cycle: "monthly",
        next_renewal_date: "",
      });
      setSuccess("Subscription created");
    } catch (err) {
      setError(err.message || "Could not create subscription");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(subscriptionId) {
    setError("");
    setSuccess("");
    try {
      await deleteSubscription(subscriptionId);
      setItems((prev) => prev.filter((item) => item.id !== subscriptionId));
      setSuccess("Subscription deleted");
    } catch (err) {
      setError(err.message || "Could not delete subscription");
    }
  }

  const totalMonthly = items
    .reduce((sum, item) => sum + toMonthlyCost(item.price, item.billing_cycle), 0)
    .toFixed(2);

  const upcomingRenewals = [...items]
    .sort((a, b) => new Date(a.next_renewal_date) - new Date(b.next_renewal_date))
    .slice(0, 3);

  return (
    <>
      <Navbar userEmail={user?.email} onLogout={logout} />

      <main className="app-shell fade-up">
        <section className="panel p-5 sm:p-7">
          <div className="section-head">
            <div>
              <p className="eyebrow">Overview</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Recurring expense command center</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Welcome back, {user?.full_name || user?.email}. Watch upcoming payments, monthly totals, and where to optimize next.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Monthly spend</p>
              <p className="kpi-value">${totalMonthly}</p>
            </article>

            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active items</p>
              <p className="kpi-value">{items.length}</p>
            </article>

            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Upcoming payments</p>
              <p className="kpi-value">{upcomingRenewals.length}</p>
            </article>

            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Potential yearly spend</p>
              <p className="kpi-value">${(Number(totalMonthly) * 12).toFixed(0)}</p>
            </article>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="soft-card p-5 sm:p-6">
              <div className="section-head">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Your recurring expenses</h2>
                  <p className="mt-1 text-sm text-slate-600">Track and maintain all payment cadences in one place.</p>
                </div>
                <Link to="/expenses/new" className="btn-secondary">
                  Add new
                </Link>
              </div>

              {success ? <p className="status-success mt-4">{success}</p> : null}

              <div className="mt-4">
                <SubscriptionList items={items} isLoading={isLoading} error={error} onDelete={handleDelete} />
              </div>
            </section>

            <aside className="space-y-5">
              <section className="soft-card p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-950">Quick add expense</h2>
                <form onSubmit={handleCreate} className="mt-4 space-y-3">
                  <label className="field-label">
                    Name or title
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Rent, WiFi, Gym, Notion"
                      className="field-input"
                      required
                    />
                  </label>

                  <label className="field-label">
                    Price
                    <input
                      type="number"
                      value={form.price}
                      onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className="field-input"
                      required
                    />
                  </label>

                  <label className="field-label">
                    Billing cycle
                    <select
                      value={form.billing_cycle}
                      onChange={(event) => setForm((prev) => ({ ...prev, billing_cycle: event.target.value }))}
                      className="field-input"
                      required
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </label>

                  <label className="field-label">
                    Next renewal date
                    <input
                      type="date"
                      value={form.next_renewal_date}
                      onChange={(event) => setForm((prev) => ({ ...prev, next_renewal_date: event.target.value }))}
                      className="field-input"
                      required
                    />
                  </label>

                  <button type="submit" disabled={isSaving} className="btn-primary w-full py-2.5">
                    {isSaving ? "Saving..." : "Create"}
                  </button>
                </form>

                {error ? <p className="status-error mt-3">{error}</p> : null}
              </section>

              <section className="soft-card p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-950">Upcoming payments</h2>
                <div className="mt-3 space-y-2">
                  {upcomingRenewals.length ? (
                    upcomingRenewals.map((item) => (
                      <div key={`renewal-${item.id}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-600">{item.next_renewal_date}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600">No renewals yet.</p>
                  )}
                </div>
              </section>

              <section className="soft-card p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-950">Shortcuts</h2>
                <div className="mt-3 grid gap-2">
                  <Link to="/calendar" className="btn-secondary w-full justify-center">Open calendar view</Link>
                  <Link to="/reports" className="btn-secondary w-full justify-center">View reports</Link>
                  <Link to="/expenses/new" className="btn-secondary w-full justify-center">Create full expense profile</Link>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">Email reminders before due dates</li>
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">Calendar-based payment planning</li>
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">Actionable trend insights</li>
                </ul>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

export default DashboardPage;
