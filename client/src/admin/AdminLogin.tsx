import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/lib/AdminAuthContext";

export default function AdminLogin() {
  const { status, login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "authed") return <Navigate to="/admin" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
    } catch {
      setError("Неверный логин или пароль");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-wine-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-ivory p-8 shadow-soft">
        <h1 className="font-display text-2xl text-ink">SHO Events — Админ</h1>
        <p className="mt-1 text-sm text-ink-soft/60">Войдите, чтобы управлять сайтом</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Логин</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-wine-800 py-3 text-sm font-medium text-ivory transition-colors hover:bg-wine-700 disabled:opacity-50"
        >
          {submitting ? "Входим…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
