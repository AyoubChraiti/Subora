import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const scheduledPayments = [
  { id: "pay-1", name: "WiFi Bill", amount: 54, due: "02", frequency: "Monthly" },
  { id: "pay-2", name: "Apartment Rent", amount: 1450, due: "03", frequency: "Monthly" },
  { id: "pay-3", name: "Car Payment", amount: 320, due: "08", frequency: "Monthly" },
  { id: "pay-4", name: "Business Loan", amount: 410, due: "11", frequency: "Monthly" },
  { id: "pay-5", name: "Gym Membership", amount: 39, due: "14", frequency: "Monthly" },
  { id: "pay-6", name: "Adobe Plan", amount: 29, due: "18", frequency: "Monthly" },
  { id: "pay-7", name: "Cloud Hosting", amount: 64, due: "22", frequency: "Monthly" },
  { id: "pay-8", name: "Insurance", amount: 118, due: "27", frequency: "Monthly" },
];

const monthDays = Array.from({ length: 35 }, (_, index) => index + 1);

function CalendarPage() {
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar userEmail={user?.email} onLogout={logout} />

      <main className="app-shell fade-up">
        <section className="panel p-6 sm:p-8">
          <div className="section-head">
            <div>
              <p className="eyebrow">Calendar View</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Scheduled payments, one timeline</h1>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Scan your month in seconds, spot heavy payment weeks, and plan reminders before charges hit.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="soft-card p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">April 2026</p>
                <p className="text-xs text-slate-500">Monochrome payment heatmap</p>
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

                {monthDays.map((day) => {
                  const dayLabel = String(day).padStart(2, "0");
                  const dayPayments = scheduledPayments.filter((item) => item.due === dayLabel);
                  return (
                    <article
                      key={`cell-${day}`}
                      className={`min-h-[92px] rounded-xl border p-2.5 transition ${
                        dayPayments.length
                          ? "border-slate-800 bg-slate-950 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-900"
                      }`}
                    >
                      <p className={`text-xs font-medium ${dayPayments.length ? "text-white/80" : "text-slate-500"}`}>
                        {dayLabel}
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

            <aside className="space-y-4">
              <section className="soft-card p-5">
                <h2 className="text-base font-semibold text-slate-950">Upcoming this week</h2>
                <div className="mt-3 space-y-2.5">
                  {scheduledPayments.slice(0, 4).map((payment) => (
                    <div key={`mini-${payment.id}`} className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-slate-950">{payment.name}</p>
                        <p className="text-xs text-slate-500">{payment.due} Apr</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">${payment.amount.toFixed(2)} • {payment.frequency}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="soft-card p-5">
                <h2 className="text-base font-semibold text-slate-950">Alert strategy</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">7 days before every rent and loan payment</li>
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">3 days before all recurring subscriptions</li>
                  <li className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2">Same-day morning reminder for utilities</li>
                </ul>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

export default CalendarPage;
