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

      <main className="app-shell-fixed fade-up">
        <section className="grid h-full gap-6 lg:grid-cols-3">
          <article className="panel section-scroll p-6 lg:col-span-1">
            <div className="flex items-center gap-4">
              <img src="/favicon-192x192.png" alt="Subora" className="h-16 w-16 rounded-2xl border border-slate-300" />
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">{user?.full_name || "Profile"}</h2>
                <p className="text-sm text-slate-600">{user?.email}</p>
              </div>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Member since</dt>
                <dd className="font-medium text-slate-900">{joinedDate}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Plan</dt>
                <dd className="font-medium text-slate-900">Free</dd>
              </div>
              <div>
                <dt className="text-slate-500">Status</dt>
                <dd className="font-medium text-slate-900">Active</dd>
              </div>
            </dl>
          </article>

          <section className="panel section-scroll p-6 lg:col-span-2">
            <p className="eyebrow">Settings</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Account profile</h1>
            <p className="mt-2 text-sm text-slate-600">Manage your profile details and account security.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="field-label">
                Full name
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
                  className="field-input"
                  maxLength={255}
                />
              </label>

              <label className="field-label">
                New password
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="field-input"
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                />
              </label>

              {error ? <p className="status-error">{error}</p> : null}
              {success ? <p className="status-success">{success}</p> : null}

              <button type="submit" disabled={isSaving} className="btn-primary py-2.5">
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
