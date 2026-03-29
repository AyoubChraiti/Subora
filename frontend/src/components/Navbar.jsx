import { NavLink } from "react-router-dom";

function navClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-warm text-ink shadow-sm" : "text-ink/70 hover:bg-paper hover:text-ink"
  }`;
}

function Navbar({ userEmail, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex items-center gap-3">
          <img src="/favicon-192x192.png" alt="Subora" className="h-10 w-10 rounded-xl border border-ink/10 shadow-sm" />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink/50">Subora</p>
            <h1 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">Subscription Console</h1>
          </div>
        </div>

        <div className="order-3 flex w-full items-center gap-1 sm:order-2 sm:w-auto">
          <NavLink to="/dashboard" className={navClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            Settings
          </NavLink>
        </div>

        <div className="order-2 ml-auto flex items-center gap-3 sm:order-3">
          <p className="hidden text-sm text-ink/70 lg:block">{userEmail}</p>
          <button
            type="button"
            onClick={onLogout}
            className="secondary-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
