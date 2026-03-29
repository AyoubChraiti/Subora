import { NavLink } from "react-router-dom";

function navClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

function Navbar({ userEmail, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-3">
          <img src="/favicon-192x192.png" alt="Subora" className="h-9 w-9 rounded-lg border border-slate-300" />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Subora</p>
            <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Recurring Expense Console</h1>
          </div>
        </div>

        <div className="order-3 flex w-full flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 sm:order-2 sm:w-auto">
          <NavLink to="/dashboard" className={navClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/calendar" className={navClass}>
            Calendar
          </NavLink>
          <NavLink to="/expenses/new" className={navClass}>
            Add Expense
          </NavLink>
          <NavLink to="/reports" className={navClass}>
            Reports
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            Settings
          </NavLink>
        </div>

        <div className="order-2 ml-auto flex items-center gap-3 sm:order-3">
          <p className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 lg:block">{userEmail}</p>
          <button
            type="button"
            onClick={onLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
