import "./standalone.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";

// Standalone entry: only used when orders runs on its own (http://localhost:5002).
// When loaded by the host, only ./App is consumed and the host provides the router.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <main className="mx-auto max-w-[960px] p-6">
        <p className="mb-4 text-sm text-muted-foreground">Orders micro frontend — standalone mode</p>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </main>
    </BrowserRouter>
  </StrictMode>,
);
