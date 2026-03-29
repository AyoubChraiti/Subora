import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const categories = ["Housing", "Utilities", "Transport", "Loan", "Health", "Subscriptions", "Insurance", "Other"];
const tags = ["Essential", "Business", "Tax", "Team", "Personal"];
const folders = ["Home", "Freelance", "Company Ops", "Family", "Personal Goals"];

function ExpenseFormPage() {
  const { user, logout } = useAuth();
  const { expenseId } = useParams();
  const isEditMode = Boolean(expenseId);

  const [form, setForm] = useState({
    title: isEditMode ? "Co-working Space" : "",
    amount: isEditMode ? "240" : "",
    billingCycle: isEditMode ? "monthly" : "monthly",
    startsOn: isEditMode ? "2026-04-10" : "",
    category: isEditMode ? "Business" : "Utilities",
    folder: isEditMode ? "Freelance" : "Home",
    tag: isEditMode ? "Tax" : "Essential",
    emailAlert: true,
    alertDays: isEditMode ? "5" : "3",
    notes: isEditMode ? "Can be canceled with 30 days notice." : "",
  });
  const [saved, setSaved] = useState(false);

  const headerText = useMemo(() => {
    if (isEditMode) {
      return "Edit recurring expense";
    }
    return "Add recurring expense";
  }, [isEditMode]);

  function updateField(field, value) {
    setSaved(false);
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <>
      <Navbar userEmail={user?.email} onLogout={logout} />

      <main className="app-shell fade-up">
        <section className="panel p-6 sm:p-8">
          <div className="section-head">
            <div>
              <p className="eyebrow">Expense Entry</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{headerText}</h1>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Build a complete recurring profile with cadence, reminders, tags, and folders so reporting remains accurate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="soft-card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-slate-950">Core details</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="field-label sm:col-span-2">
                  Expense title
                  <input
                    className="field-input"
                    type="text"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="Rent, Spotify, Car Loan, WiFi"
                    required
                  />
                </label>

                <label className="field-label">
                  Amount
                  <input
                    className="field-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) => updateField("amount", event.target.value)}
                    placeholder="0.00"
                    required
                  />
                </label>

                <label className="field-label">
                  Billing cycle
                  <select
                    className="field-input"
                    value={form.billingCycle}
                    onChange={(event) => updateField("billingCycle", event.target.value)}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </label>

                <label className="field-label">
                  Starts on
                  <input
                    className="field-input"
                    type="date"
                    value={form.startsOn}
                    onChange={(event) => updateField("startsOn", event.target.value)}
                    required
                  />
                </label>

                <label className="field-label">
                  Category
                  <select
                    className="field-input"
                    value={form.category}
                    onChange={(event) => updateField("category", event.target.value)}
                  >
                    {categories.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field-label">
                  Folder
                  <select
                    className="field-input"
                    value={form.folder}
                    onChange={(event) => updateField("folder", event.target.value)}
                  >
                    {folders.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field-label">
                  Tag
                  <select
                    className="field-input"
                    value={form.tag}
                    onChange={(event) => updateField("tag", event.target.value)}
                  >
                    {tags.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            <aside className="space-y-5">
              <section className="soft-card p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-950">Reminder options</h2>

                <label className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
                  Email reminder enabled
                  <input
                    type="checkbox"
                    checked={form.emailAlert}
                    onChange={(event) => updateField("emailAlert", event.target.checked)}
                    className="h-4 w-4 accent-black"
                  />
                </label>

                <label className="field-label mt-3">
                  Alert days before due date
                  <input
                    className="field-input"
                    type="number"
                    min="1"
                    max="30"
                    value={form.alertDays}
                    onChange={(event) => updateField("alertDays", event.target.value)}
                    required
                  />
                </label>

                <label className="field-label mt-3">
                  Notes
                  <textarea
                    className="field-input min-h-[110px] resize-y"
                    value={form.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    placeholder="Contract terms, cancellation policy, or context"
                  />
                </label>

                {saved ? (
                  <p className="mt-3 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700">
                    Saved locally for preview. Hook this form to create/update API when backend endpoints are ready.
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="submit" className="btn-primary">
                    {isEditMode ? "Update expense" : "Save expense"}
                  </button>
                  <Link to="/dashboard" className="btn-secondary">
                    Cancel
                  </Link>
                </div>
              </section>

              <section className="soft-card p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-950">Preview</h2>
                <div className="mt-3 rounded-xl border border-slate-900 bg-slate-950 p-4 text-white">
                  <p className="text-sm text-white/70">{form.billingCycle} recurring</p>
                  <p className="mt-1 text-lg font-semibold">{form.title || "Untitled expense"}</p>
                  <p className="mt-1 text-sm text-white/85">${Number(form.amount || 0).toFixed(2)} • Starts {form.startsOn || "-"}</p>
                  <p className="mt-3 text-xs text-white/70">Folder: {form.folder} • Tag: {form.tag}</p>
                </div>
              </section>
            </aside>
          </form>
        </section>
      </main>
    </>
  );
}

export default ExpenseFormPage;
