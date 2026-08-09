import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { adminAuth } from "@/lib/adminApi";

interface AdminAuthState {
  status: "loading" | "authed" | "guest";
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "authed" | "guest">("loading");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    adminAuth
      .me()
      .then((res) => {
        setUsername(res.username);
        setStatus("authed");
      })
      .catch(() => setStatus("guest"));
  }, []);

  async function login(user: string, password: string) {
    await adminAuth.login(user, password);
    setUsername(user);
    setStatus("authed");
  }

  async function logout() {
    await adminAuth.logout();
    setUsername(null);
    setStatus("guest");
  }

  return <AdminAuthContext.Provider value={{ status, username, login, logout }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
