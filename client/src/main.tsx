import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { LanguageProvider } from "@/lib/LanguageContext";
import { SiteMeta } from "@/components/SiteMeta";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SiteMeta />
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
