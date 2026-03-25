function SubscriptionList({ items, isLoading, error }) {
  if (isLoading) {
    return <p className="text-sm text-ink/70">Loading subscriptions...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-ink/30 bg-paper/70 p-6">
        <p className="text-sm text-ink/70">No subscriptions yet. Your list will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((subscription) => (
        <li key={subscription.id} className="rounded-xl border border-ink/10 bg-white/80 p-4 shadow-sm">
          <p className="font-medium text-ink">{subscription.name}</p>
          <p className="text-sm text-ink/70">${subscription.price} • {subscription.billing_cycle}</p>
        </li>
      ))}
    </ul>
  );
}

export default SubscriptionList;
