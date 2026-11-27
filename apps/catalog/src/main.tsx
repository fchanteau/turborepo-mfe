import "./standalone.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import { standaloneGetAccessToken, standaloneUser } from "./standaloneAuth.ts";

// Standalone entry: only used when the catalog runs on its own (http://localhost:5001).
// When loaded by the host, only ./App is consumed and the host provides the router.
// The path the app is served from (Vite `base`, absolute at build time), e.g. /federation/mfe/catalog/.
const basename = new URL(import.meta.env.BASE_URL, window.location.href).pathname;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <main className="mx-auto max-w-[960px] p-6">
        <p className="mb-4 text-sm text-muted-foreground">Catalog micro frontend — standalone mode</p>
        <Routes>
          <Route path="/*" element={<App user={standaloneUser} getAccessToken={standaloneGetAccessToken} />} />
        </Routes>
      </main>
    </BrowserRouter>
  </StrictMode>,
);
