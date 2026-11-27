import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App.tsx";

// The path the app is served from (Vite `base`), e.g. "/federation/" on GitHub Pages.
const basename = new URL(import.meta.env.BASE_URL, window.location.href).pathname;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
