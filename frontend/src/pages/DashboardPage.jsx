import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import SubscriptionList from "../components/SubscriptionList";
import { useAuth } from "../context/AuthContext";
import { createSubscription, createSubscriptionsBulk, deleteSubscription, fetchSubscriptions } from "../services/api";

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
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    billing_cycle: "monthly",
    next_renewal_date: "",
  });
  const [bulkRows, setBulkRows] = useState([
    { name: "", price: "", billing_cycle: "monthly", next_renewal_date: "" },
  ]);

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

  function updateBulkRow(index, field, value) {
    setBulkRows((prev) => prev.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  }

  function addBulkRow() {
    setBulkRows((prev) => [...prev, { name: "", price: "", billing_cycle: "monthly", next_renewal_date: "" }]);
  }

  function removeBulkRow(index) {
    setBulkRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
  }

  async function handleBulkCreate(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanedRows = bulkRows
      .map((row) => ({
        ...row,
        name: row.name.trim(),
        price: Number(row.price),
      }))
      .filter((row) => row.name && row.next_renewal_date && row.price > 0);

    if (!cleanedRows.length) {
      setError("Add at least one valid subscription row.");
      return;
    }

    setIsBulkSaving(true);
    try {
      const response = await createSubscriptionsBulk(cleanedRows);
      setItems(response.items || []);
      setSuccess("Subscriptions added successfully.");
    } catch (err) {
      setError(err.message || "Could not create subscriptions");
    } finally {
      setIsBulkSaving(false);
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

  const nextPayment = upcomingRenewals[0] || null;

  function formatDate(value) {
    if (!value) {
      return "-";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <>
      <Navbar userEmail={user?.email} onLogout={logout} />

      <main className="app-shell fade-up">
        <section className="panel p-5 sm:p-7">
          <div className="section-head">
            <div>
              <p className="eyebrow">Overview</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Subscriptions</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Welcome back, {user?.full_name || user?.email}. Track all your subscriptions in one simple dashboard.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Monthly spend</p>
              <p className="kpi-value">${totalMonthly}</p>
              <p className="mt-1 text-xs text-slate-500">Estimated from all active subscriptions</p>
            </article>

            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active subscriptions</p>
              <p className="kpi-value">{items.length}</p>
              <p className="mt-1 text-xs text-slate-500">All plans you currently track</p>
            </article>

            <article className="soft-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Next payment</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                {nextPayment ? nextPayment.name : "No upcoming payment"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {nextPayment ? `${formatDate(nextPayment.next_renewal_date)} • $${Number(nextPayment.price).toFixed(2)}` : "Add subscriptions to see upcoming dates"}
              </p>
            </article>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="soft-card p-5 sm:p-6">
              <div className="section-head">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Your subscriptions</h2>
                  <p className="mt-1 text-sm text-slate-600">Simple list of all active subscriptions.</p>
                </div>
              </div>

              {success ? <p className="status-success mt-4">{success}</p> : null}

              <div className="mt-4">
                <SubscriptionList items={items} isLoading={isLoading} error={error} onDelete={handleDelete} />
              </div>
            </section>

            <aside className="space-y-5">
              {!items.length ? (
                <section className="soft-card p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-slate-950">First-time setup</h2>
                  <p className="mt-1 text-sm text-slate-600">Add all your subscriptions once, then manage them from the list.</p>

                  <form onSubmit={handleBulkCreate} className="mt-4 space-y-3">
                    {bulkRows.map((row, index) => (
                      <div key={`bulk-row-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="grid gap-2">
                          <input
                            type="text"
                            value={row.name}
                            onChange={(event) => updateBulkRow(index, "name", event.target.value)}
                            placeholder="Netflix"
                            className="field-input"
                            required
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              value={row.price}
                              onChange={(event) => updateBulkRow(index, "price", event.target.value)}
                              placeholder="12.99"
                              step="0.01"
                              min="0.01"
                              className="field-input"
                              required
                            />
                            <select
                              value={row.billing_cycle}
                              onChange={(event) => updateBulkRow(index, "billing_cycle", event.target.value)}
                              className="field-input"
                            >
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>
                          <input
                            type="date"
                            value={row.next_renewal_date}
                            onChange={(event) => updateBulkRow(index, "next_renewal_date", event.target.value)}
                            className="field-input"
                            required
                          />
                          {bulkRows.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => removeBulkRow(index)}
                              className="btn-secondary w-full"
                            >
                              Remove row
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    <div className="grid gap-2">
                      <button type="button" onClick={addBulkRow} className="btn-secondary w-full">
                        Add another subscription
                      </button>
                      <button type="submit" disabled={isBulkSaving} className="btn-primary w-full py-2.5">
                        {isBulkSaving ? "Saving..." : "Save all subscriptions"}
                      </button>
                    </div>
                  </form>

                  {error ? <p className="status-error mt-3">{error}</p> : null}
                </section>
              ) : (
                <section className="soft-card p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-slate-950">Quick add subscription</h2>
                  <form onSubmit={handleCreate} className="mt-4 space-y-3">
                    <label className="field-label">
                      Name
                      <input
                        type="text"
                        value={form.name}
                        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Netflix, Notion, Spotify"
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
                        <option value="quarterly">Quarterly</option>
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
                      {isSaving ? "Saving..." : "Add subscription"}
                    </button>
                  </form>

                  {error ? <p className="status-error mt-3">{error}</p> : null}
                </section>
              )}

              <section className="soft-card p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-950">Upcoming payments</h2>
                <div className="mt-3 space-y-2">
                  {upcomingRenewals.length ? (
                    upcomingRenewals.map((item) => (
                      <div key={`renewal-${item.id}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-600">{formatDate(item.next_renewal_date)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600">No upcoming payments yet.</p>
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
