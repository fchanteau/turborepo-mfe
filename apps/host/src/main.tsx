import "./index.css";
import { MsalProvider } from "@azure/msal-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App.tsx";
import { createMsalInstance } from "./auth/msal.ts";

// The path the app is served from (Vite `base`), e.g. "/federation/" on GitHub Pages.
const basename = new URL(import.meta.env.BASE_URL, window.location.href).pathname;

createMsalInstance().then((msalInstance) => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </MsalProvider>
    </StrictMode>,
  );
});
