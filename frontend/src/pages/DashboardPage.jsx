import { useEffect, useState } from "react";

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

      <main className="mx-auto h-[calc(100dvh-81px)] w-full max-w-6xl overflow-hidden px-6 py-4 sm:py-5">
        <section className="surface-card flex h-full flex-col p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Overview</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Your subscription hub</h2>
            </div>
            <p className="text-sm text-ink/65">Track spend and stay ahead of renewals.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Total Monthly Spend</p>
              <p className="mt-2 text-3xl font-semibold text-ink">${totalMonthly}</p>
            </article>

            <article className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Active Subscriptions</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{items.length}</p>
            </article>

            <article className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Upcoming Renewals</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{upcomingRenewals.length}</p>
            </article>
          </div>

          <div className="mt-5 grid min-h-0 flex-1 gap-5 lg:grid-cols-3">
            <section className="flex min-h-0 flex-col rounded-2xl border border-ink/10 bg-white p-5 shadow-sm lg:col-span-2">
              <h2 className="text-lg font-semibold text-ink">Your Subscriptions</h2>
              <p className="mt-1 text-sm text-ink/60">Track and remove recurring costs quickly.</p>

              {success ? <p className="status-success mt-4">{success}</p> : null}

              <div className="mt-4 min-h-0 flex-1 overflow-auto pr-1">
                <SubscriptionList items={items} isLoading={isLoading} error={error} onDelete={handleDelete} />
              </div>
            </section>

            <aside className="min-h-0 space-y-5 overflow-auto pr-1">
              <section className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-ink">Add Subscription</h2>
                <form onSubmit={handleCreate} className="mt-4 space-y-3">
                  <label className="block text-sm text-ink/80">
                    Name
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Netflix, Notion, etc."
                      className="input-field"
                      required
                    />
                  </label>

                  <label className="block text-sm text-ink/80">
                    Price
                    <input
                      type="number"
                      value={form.price}
                      onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className="input-field"
                      required
                    />
                  </label>

                  <label className="block text-sm text-ink/80">
                    Billing cycle
                    <select
                      value={form.billing_cycle}
                      onChange={(event) => setForm((prev) => ({ ...prev, billing_cycle: event.target.value }))}
                      className="input-field"
                      required
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </label>

                  <label className="block text-sm text-ink/80">
                    Next renewal date
                    <input
                      type="date"
                      value={form.next_renewal_date}
                      onChange={(event) => setForm((prev) => ({ ...prev, next_renewal_date: event.target.value }))}
                      className="input-field"
                      required
                    />
                  </label>

                  <button type="submit" disabled={isSaving} className="primary-btn w-full">
                    {isSaving ? "Saving..." : "Create"}
                  </button>
                </form>

                {error ? <p className="status-error mt-3">{error}</p> : null}
              </section>

              <section className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-ink">Upcoming Renewals</h2>
                <div className="mt-3 space-y-2">
                  {upcomingRenewals.length ? (
                    upcomingRenewals.map((item) => (
                      <div key={`renewal-${item.id}`} className="rounded-lg border border-ink/10 px-3 py-2">
                        <p className="text-sm font-medium text-ink">{item.name}</p>
                        <p className="text-xs text-ink/60">{item.next_renewal_date}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-ink/60">No renewals yet.</p>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

export default DashboardPage;
