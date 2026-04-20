import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { fetchSubscriptions, fetchUpcomingSubscriptions } from "../services/api";

function CalendarPage() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [upcomingItems, setUpcomingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [subscriptionsData, upcomingData] = await Promise.all([
          fetchSubscriptions(),
          fetchUpcomingSubscriptions({ days: 14, limit: 8 }),
        ]);

        if (!isMounted) {
          return;
        }

        setItems(subscriptionsData.items || []);
        setUpcomingItems(upcomingData.items || []);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Could not load calendar data");
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

  const now = new Date();
  const monthName = now.toLocaleString(undefined, { month: "long" });
  const year = now.getFullYear();
  const firstDay = new Date(year, now.getMonth(), 1);
  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const monthCells = useMemo(() => {
    const values = [];
    for (let index = 0; index < startOffset; index += 1) {
      values.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      values.push(day);
    }
    while (values.length < 42) {
      values.push(null);
    }
    return values;
  }, [daysInMonth, startOffset]);

  function dayItems(day) {
    return items.filter((item) => {
      const next = new Date(item.next_renewal_date);
      return (
        !Number.isNaN(next.getTime())
        && next.getFullYear() === year
        && next.getMonth() === now.getMonth()
        && next.getDate() === day
      );
    });
  }

  return (
    <>
      <Navbar userEmail={user?.email} onLogout={logout} />

      <main className="app-shell-fixed fade-up">
        <section className="panel app-panel-fit flex flex-col p-6 sm:p-8">
          <div className="section-head">
            <div>
              <p className="eyebrow">Calendar View</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Scheduled payments, one timeline</h1>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Scan your month in seconds, spot heavy payment weeks, and plan reminders before charges hit.
            </p>
          </div>

          <div className="mt-8 grid min-h-0 flex-1 gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="soft-card section-scroll p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{monthName} {year}</p>
                <p className="text-xs text-slate-500">Live payment calendar</p>
              </div>

              <div className="grid grid-cols-7 gap-2 text-xs text-slate-500">
                {[
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun",
                ].map((day) => (
                  <p key={day} className="px-2 pb-1 text-center uppercase tracking-[0.1em]">
                    {day}
                  </p>
                ))}

                {monthCells.map((day, cellIndex) => {
                  const dayPayments = day ? dayItems(day) : [];
                  return (
                    <article
                      key={`cell-${cellIndex}`}
                      className={`min-h-[92px] rounded-xl border p-2.5 transition ${
                        day && dayPayments.length
                          ? "border-slate-800 bg-slate-950 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-900"
                      }`}
                    >
                      <p className={`text-xs font-medium ${day && dayPayments.length ? "text-white/80" : "text-slate-500"}`}>
                        {day || ""}
                      </p>
                      <div className="mt-1.5 space-y-1">
                        {dayPayments.slice(0, 2).map((item) => (
                          <p
                            key={item.id}
                            className={`truncate rounded-md px-2 py-1 text-[11px] ${
                              dayPayments.length ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {item.name}
                          </p>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="section-scroll space-y-4 pr-1">
              <section className="soft-card p-5">
                <h2 className="text-base font-semibold text-slate-950">Upcoming this week</h2>
                <div className="mt-3 space-y-2.5">
                  {isLoading ? <p className="text-sm text-slate-600">Loading upcoming items...</p> : null}
                  {!isLoading && error ? <p className="status-error">{error}</p> : null}
                  {!isLoading && !error && !upcomingItems.length ? <p className="text-sm text-slate-600">No upcoming items.</p> : null}
                  {!isLoading && !error
                    ? upcomingItems.map((payment) => (
                      <div key={`mini-${payment.id}`} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-slate-950">{payment.name}</p>
                          <p className="text-xs text-slate-500">{payment.next_renewal_date}</p>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">${Number(payment.price).toFixed(2)} • {payment.billing_cycle}</p>
                      </div>
                    ))
                    : null}
                </div>
              </section>

              <section className="soft-card p-5">
                <h2 className="text-base font-semibold text-slate-950">Calendar data source</h2>
                <p className="mt-3 text-sm text-slate-600">
                  This view is powered by your real subscription data from the backend subscriptions endpoints.
                </p>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

export default CalendarPage;
