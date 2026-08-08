import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/layout/PageTransition";
import { ScrollToTop } from "@/lib/ScrollToTop";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Formats from "@/pages/Formats";
import Partners from "@/pages/Partners";
import Contacts from "@/pages/Contacts";

function App() {
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
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
