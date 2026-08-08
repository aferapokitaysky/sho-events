import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-ivory">
      <div className="grain-overlay" />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
