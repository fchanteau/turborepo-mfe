import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const PORT = 5002;
// Public URL where this remote is deployed. Assets must be absolute so they resolve when loaded from the host origin.
const REMOTE_BASE_URL = process.env.REMOTE_BASE_URL ?? `http://localhost:${PORT}/`;

export default defineConfig(({ command }) => ({
  base: command === "build" ? REMOTE_BASE_URL : "/",
  server: { port: PORT, strictPort: true, origin: `http://localhost:${PORT}`, cors: true },
  preview: { port: PORT, strictPort: true, cors: true },
  build: { target: "chrome89" },
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "orders",
      filename: "remoteEntry.js",
      manifest: true,
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
        "react-router": { singleton: true },
        "@repo/ui": { singleton: true },
      },
      dts: false,
    }),
  ],
}));
