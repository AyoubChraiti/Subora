import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function SettingsPage() {
  const { user, logout, updateProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    password: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const joinedDate = useMemo(() => {
    if (!user?.created_at) {
      return "-";
    }
    return new Date(user.created_at).toLocaleDateString();
  }, [user?.created_at]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, full_name: user?.full_name || "" }));
  }, [user?.full_name]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const payload = {};
      const normalizedName = form.full_name.trim();
      if (normalizedName && normalizedName !== user?.full_name) {
        payload.full_name = normalizedName;
      }
      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      if (!Object.keys(payload).length) {
        setError("Nothing to update.");
        setIsSaving(false);
        return;
      }

      await updateProfile(payload);
      setForm((prev) => ({ ...prev, password: "" }));
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err.message || "Could not update profile");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Navbar userEmail={user?.email} onLogout={logout} />

      <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-8 sm:py-10">
        <section className="grid gap-6 lg:grid-cols-3">
          <article className="surface-card p-6 lg:col-span-1">
            <div className="flex items-center gap-4">
              <img src="/favicon-192x192.png" alt="Subora" className="h-16 w-16 rounded-2xl border border-ink/10 shadow-sm" />
              <div>
                <h2 className="text-2xl font-semibold text-ink">{user?.full_name || "Profile"}</h2>
                <p className="text-sm text-ink/65">{user?.email}</p>
              </div>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="text-ink/55">Member since</dt>
                <dd className="font-medium text-ink">{joinedDate}</dd>
              </div>
              <div>
                <dt className="text-ink/55">Plan</dt>
                <dd className="font-medium text-ink">Starter</dd>
              </div>
              <div>
                <dt className="text-ink/55">Status</dt>
                <dd className="font-medium text-accent">Active</dd>
              </div>
            </dl>
          </article>

          <section className="surface-card p-6 lg:col-span-2">
            <p className="inline-flex rounded-full bg-warm px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink/70">
              Settings
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Profile</h1>
            <p className="mt-2 text-sm text-ink/65">Update your name or set a new password.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block text-sm text-ink/80">
                Full name
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
                  className="input-field"
                  maxLength={255}
                />
              </label>

              <label className="block text-sm text-ink/80">
                New password
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="input-field"
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                />
              </label>

              {error ? <p className="status-error">{error}</p> : null}
              {success ? <p className="status-success">{success}</p> : null}

              <button type="submit" disabled={isSaving} className="primary-btn">
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </section>
        </section>
      </main>
    </>
  );
}

export default SettingsPage;
