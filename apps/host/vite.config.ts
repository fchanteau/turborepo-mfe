import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";

const PORT = 5000;

/**
 * Serves (dev) and emits (build) `redirect-bridge.js`: the standalone MSAL redirect bridge script
 * shipped by @azure/msal-browser, loaded by `public/redirect.html`.
 */
function msalRedirectBridge(): Plugin {
  const bridgeDir = dirname(createRequire(import.meta.url).resolve("@azure/msal-browser/redirect-bridge"));
  const source = () => readFileSync(join(bridgeDir, "msal-redirect-bridge.min.js"), "utf8");
  return {
    name: "msal-redirect-bridge",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.split("?")[0]?.endsWith("/redirect-bridge.js")) return next();
        res.setHeader("Content-Type", "text/javascript");
        res.end(source());
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "redirect-bridge.js", source: source() });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  const catalogUrl = env.VITE_CATALOG_URL ?? "http://localhost:5001";
  const ordersUrl = env.VITE_ORDERS_URL ?? "http://localhost:5002";

  return {
    // Public path of the host, e.g. "/federation/" on GitHub Pages.
    base: env.HOST_BASE_URL ?? "/",
    server: { port: PORT, strictPort: true, origin: `http://localhost:${PORT}` },
    preview: { port: PORT, strictPort: true },
    build: { target: "chrome89" },
    plugins: [
      react(),
      tailwindcss(),
      msalRedirectBridge(),
      federation({
        name: "host",
        remotes: {
          catalog: {
            type: "module",
            name: "catalog",
            entry: `${catalogUrl}/remoteEntry.js`,
            entryGlobalName: "catalog",
            shareScope: "default",
          },
          orders: {
            type: "module",
            name: "orders",
            entry: `${ordersUrl}/remoteEntry.js`,
            entryGlobalName: "orders",
            shareScope: "default",
          },
        },
        filename: "remoteEntry.js",
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
          "react-router": { singleton: true },
          "@repo/ui": { singleton: true },
        },
        dts: false,
      }),
    ],
  };
});
