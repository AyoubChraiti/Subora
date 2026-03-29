function SubscriptionList({ items, isLoading, error, onDelete }) {
  if (isLoading) {
    return <p className="text-sm text-ink/70">Loading subscriptions...</p>;
  }

  if (error) {
    return <p className="status-error">{error}</p>;
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/25 bg-paper/70 p-7 text-center">
        <p className="text-base font-medium text-ink/80">No subscriptions yet</p>
        <p className="mt-1 text-sm text-ink/60">Create your first subscription using the form on the right.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((subscription) => (
        <li
          key={subscription.id}
          className="flex flex-col justify-between gap-4 rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-ink">{subscription.name}</p>
              <span className="rounded-full bg-warm px-3 py-1 text-xs font-medium capitalize text-ink/80">
                {subscription.billing_cycle}
              </span>
            </div>

            <p className="mt-3 text-2xl font-semibold text-ink">${Number(subscription.price).toFixed(2)}</p>
            <p className="mt-1 text-sm text-ink/60">Renews on {subscription.next_renewal_date}</p>
          </div>

          <button
            type="button"
            onClick={() => onDelete(subscription.id)}
            className="w-fit rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 transition hover:bg-red-50"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default SubscriptionList;
