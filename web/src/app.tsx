import { useEffect } from "react";
import { useLinksStore } from "./store/use-links-store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Redirect } from "./pages/Redirect";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "sonner";

export function App() {
  useEffect(() => {
    const syncBetweenTabs = (event: StorageEvent) => {
      if (event.key === "brevly-links-storage") {
        useLinksStore.getState().fetchLinks();
      }
    };

    window.addEventListener("storage", syncBetweenTabs);
    return () => window.removeEventListener("storage", syncBetweenTabs);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/:slug" element={<Redirect />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}
