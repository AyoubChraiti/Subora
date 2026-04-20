function SubscriptionList({ items, isLoading, error, onDelete }) {
  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading subscriptions...</p>;
  }

  if (error) {
    return <p className="status-error">{error}</p>;
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
        <p className="text-base font-medium text-slate-800">No subscriptions yet</p>
        <p className="mt-1 text-sm text-slate-600">Add your first subscription to start tracking renewals and monthly cost.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((subscription) => (
        <li
          key={subscription.id}
          className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-slate-950">{subscription.name}</p>
              <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                {subscription.billing_cycle}
              </span>
            </div>

            <p className="mt-3 text-2xl font-semibold text-slate-950">${Number(subscription.price).toFixed(2)}</p>
            <p className="mt-1 text-sm text-slate-600">Renews on {subscription.next_renewal_date}</p>
          </div>

          <button
            type="button"
            onClick={() => onDelete(subscription.id)}
            className="w-fit rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default SubscriptionList;
