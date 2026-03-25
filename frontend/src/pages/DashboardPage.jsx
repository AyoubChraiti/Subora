import { useEffect, useState } from "react";

import SubscriptionList from "../components/SubscriptionList";
import { fetchSubscriptions } from "../services/api";

function DashboardPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-14">
      <section className="rounded-3xl border border-ink/15 bg-white/65 p-8 shadow-xl backdrop-blur-sm">
        <p className="mb-2 inline-flex rounded-full bg-warm px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink/70">
          Dashboard
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Subora</h1>
        <p className="mt-3 max-w-xl text-sm text-ink/70">
          Keep track of renewals and recurring payments in one place.
        </p>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-medium text-ink">Subscriptions</h2>
          <SubscriptionList items={items} isLoading={isLoading} error={error} />
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
