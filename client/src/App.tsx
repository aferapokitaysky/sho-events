import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/layout/PageTransition";
import { ScrollToTop } from "@/lib/ScrollToTop";
import { AdminAuthProvider } from "@/lib/AdminAuthContext";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Formats from "@/pages/Formats";
import Partners from "@/pages/Partners";
import Contacts from "@/pages/Contacts";
import DecorRental from "@/pages/DecorRental";
import Portfolio from "@/pages/Portfolio";
import AdminLogin from "@/admin/AdminLogin";
import AdminLayout from "@/admin/AdminLayout";
import ServicesAdmin from "@/admin/ServicesAdmin";
import DecorAdmin from "@/admin/DecorAdmin";
import PortfolioAdmin from "@/admin/PortfolioAdmin";
import FormatsAdmin from "@/admin/FormatsAdmin";
import ContactInfoAdmin from "@/admin/ContactInfoAdmin";
import MediaAdmin from "@/admin/MediaAdmin";

function PublicApp() {
  const location = useLocation();

  return (
    <Layout>
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="/services"
            element={
              <PageTransition>
                <Services />
              </PageTransition>
            }
          />
          <Route
            path="/formats"
            element={
              <PageTransition>
                <Formats />
              </PageTransition>
            }
          />
          <Route path="/booking" element={<Navigate to="/contacts" replace />} />
          <Route
            path="/partners"
            element={
              <PageTransition>
                <Partners />
              </PageTransition>
            }
          />
          <Route
            path="/contacts"
            element={
              <PageTransition>
                <Contacts />
              </PageTransition>
            }
          />
          <Route
            path="/decor"
            element={
              <PageTransition>
                <DecorRental />
              </PageTransition>
            }
          />
          <Route
            path="/portfolio"
            element={
              <PageTransition>
                <Portfolio />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <AdminAuthProvider>
            <Routes>
              <Route path="login" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="services" replace />} />
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="decor" element={<DecorAdmin />} />
                <Route path="portfolio" element={<PortfolioAdmin />} />
                <Route path="formats" element={<FormatsAdmin />} />
                <Route path="contact-info" element={<ContactInfoAdmin />} />
                <Route path="media" element={<MediaAdmin />} />
              </Route>
            </Routes>
          </AdminAuthProvider>
        }
      />
      <Route path="/*" element={<PublicApp />} />
    </Routes>
  );
}

export default App;
