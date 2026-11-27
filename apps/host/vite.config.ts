import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const PORT = 5000;

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
