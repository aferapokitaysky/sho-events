import { NavLink, Navigate, Outlet } from "react-router-dom";
import clsx from "clsx";
import { useAdminAuth } from "@/lib/AdminAuthContext";

const NAV_ITEMS = [
  { to: "/admin/services", label: "Услуги" },
  { to: "/admin/formats", label: "Форматы" },
  { to: "/admin/decor", label: "Аренда декора" },
  { to: "/admin/portfolio", label: "Портфолио" },
  { to: "/admin/media", label: "Медиа" },
  { to: "/admin/contact-info", label: "Контакты" },
];

export default function AdminLayout() {
  const { status, username, logout } = useAdminAuth();

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center bg-paper text-ink-soft/50">Загрузка…</div>;
  }
  if (status === "guest") return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-60 shrink-0 flex-col border-r border-ink/10 bg-ivory px-5 py-6">
        <div className="mb-8">
          <p className="font-display text-lg text-ink">SHO Events</p>
          <p className="text-xs text-ink-soft/50">Админ-панель</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                  isActive ? "bg-wine-800 text-ivory" : "text-ink-soft hover:bg-cream",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-ink/10 pt-4">
          <p className="mb-2 text-xs text-ink-soft/50">{username}</p>
          <button
            onClick={() => logout()}
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2 text-left text-sm text-ink-soft transition-colors hover:border-wine-700 hover:text-wine-700"
          >
            Выйти
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
