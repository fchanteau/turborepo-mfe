# Copilot instructions

React micro frontend monorepo: **pnpm workspaces + Turborepo + Vite + `@module-federation/vite`**.
See [README.md](../README.md) for the full architecture and the step-by-step guide to add an app.

## Layout

- `apps/host`: shell app (port 5000). Owns the layout (`Header`, `Navigation`, `Menu`), top-level routing and host pages. Loads remotes at runtime.
- `apps/catalog` (5001), `apps/orders` (5002): remote micro frontends. Each exposes `./App` and also runs standalone.
- `packages/ui` (`@repo/ui`): shared React components, the `cn()` class helper and the Tailwind theme (`theme.css`). Consumed **from source** (`exports` → `src/index.ts`), with no build step.
- `tsconfig.base.json`: shared compiler options. Every package's `tsconfig.json` extends it.

## Commands

Run from the repo root. Use **pnpm** only, never npm or yarn.

```sh
pnpm install
pnpm dev                    # all apps
pnpm --filter <app> dev     # one app
pnpm typecheck              # tsc on every package
pnpm build                  # production build (Turborepo cached)
pnpm preview                # build + serve production bundles
```

There is no linter or test runner yet. Validate changes with `pnpm typecheck` and `pnpm build`.
For UI changes, also check the app both standalone and inside the host.

## Module Federation rules (do not break)

- The `shared` config must be **identical** in the host and every remote:
  `react`, `react-dom`, `react-router` and `@repo/ui`, all with `singleton: true`. A mismatch causes duplicate React (`Invalid hook call`) or a broken router context.
- Any new runtime dependency used by both the host and remotes, and holding global state or React context, must be added to `shared` in **all** `vite.config.ts` files.
- The federation `name` must be a valid JS identifier (no dashes) and unique across apps.
- Remote `vite.config.ts`: keep `base` = `REMOTE_BASE_URL` at build time (absolute asset URLs), `server.origin`, `cors: true`, `build.target: "chrome89"`.
- Host remotes use `type: "module"`. Their URLs come from `VITE_<NAME>_URL` env vars with a localhost default. Never hard-code production URLs.
- Every build-time env var must be listed in `turbo.json` → `tasks.build.env` (cache key) and documented in `apps/host/.env.example` (host vars).
- Do not change `dts: false` without updating the typing strategy (see below).

## Remotes

- A remote has two entry points:
  - `src/App.tsx`: the exposed module. Routes and pages only, **no router**. Imports `./app.css`.
  - `src/main.tsx`: standalone mode only. Imports `./standalone.css` and wraps `App` in `BrowserRouter` + `<Route path="/*" />`.
- Routes inside a remote must be **relative** (`index`, `":id"`). Navigate relatively (`navigate(id)`, `navigate("..", { relative: "path" })`). Never hard-code the host mount path (e.g. `/orders/...`).
- Remotes must not import from the host or from other remotes. Share code through `packages/*`.
- Use `react-router` (v7), not `react-router-dom`.

## Host

- Load remotes with `lazy(() => import("<remote>/App"))` and render them **only** through `RemoteRoute` (`apps/host/src/components/RemoteRoute.tsx`), which provides `Suspense` + `ErrorBoundary`. Do not render a remote without it.
- Mount remotes on wildcard routes: `<Route path="<name>/*" element={<RemoteRoute name="…" component={…} />} />`.
- Navigation items live only in `apps/host/src/navigation.ts`, used by both `Navigation` and `Menu`.
- Every exposed module consumed by the host needs a `declare module "<remote>/<Expose>"` in `apps/host/src/remotes.d.ts`. Keep it in sync with the remote's actual exports and props.

## Adding a micro frontend

Follow the README section "Creating a new micro frontend". Summary of the files to touch:

1. Copy `apps/orders` to `apps/<name>`, without `node_modules`, `dist`, `.turbo` and `.__mf__temp`.
2. Update `package.json` `name`, `vite.config.ts` (`PORT`, federation `name`) and the `index.html` title.
3. In the host, update `vite.config.ts` (`remotes`), `src/remotes.d.ts`, `src/App.tsx` (route) and `src/navigation.ts`.
4. Add `VITE_<NAME>_URL` to `turbo.json` and `apps/host/.env.example`.
5. Update the README (structure, ports, env var tables).
6. Run `pnpm install`, `pnpm typecheck` and `pnpm build`.

## Shared UI library (`@repo/ui`)

- Add reusable, domain-agnostic components here. Keep business logic in the apps.
- Export every component and its prop types from `packages/ui/src/index.ts`.
- Style components with Tailwind utilities and merge classes with `cn()`, so a `className` prop can override defaults. Variants are `Record<Variant, string>` maps of utility classes.
- `react`, `react-dom` and `tailwindcss` stay `peerDependencies` (and devDependencies for type checking).
- All apps load the singleton from whichever app loads first, usually the host. A UI change deployed only with a remote will not appear until the host is redeployed.

## Styling (Tailwind CSS v4)

- Use Tailwind utility classes only. Do not add plain CSS files, CSS modules, inline `style` props or BEM classes. Use arbitrary values (`max-w-[960px]`) when needed.
- Configuration is CSS-first, with no `tailwind.config.js`. Design tokens live in `packages/ui/src/theme.css` (`@theme`). Prefer token utilities (`bg-primary`, `text-muted`, `border-border`, `bg-surface`, `text-fg`) over raw palette colors. Add new tokens there, not in apps.
- `theme.css` contains `@source "./"` so that every app generates the classes used by `@repo/ui`. Keep it.
- CSS entry points (do not change this split):
  - host `src/index.css`: `@import "tailwindcss"` + `@import "@repo/ui/theme.css"`.
  - remote `src/app.css`: Tailwind theme + utilities **without preflight** + `@repo/ui/theme.css`. Imported by the exposed `App.tsx`.
  - remote `src/standalone.css`: preflight only. Imported by `main.tsx`.
- Never import the full `tailwindcss` (preflight) from a remote's exposed code. It would re-inject a CSS reset into the host.
- Preflight resets headings and lists, so style `h1`–`h6`, `ul` and `ol` explicitly (e.g. `text-2xl font-bold`, `list-disc pl-5`).
- Build conditional classes with `cn()` (e.g. `cn("base", isActive && "bg-primary-soft")`), not with template strings.
- Every app's `vite.config.ts` registers `tailwindcss()` from `@tailwindcss/vite`.

## Code conventions

- TypeScript strict mode, ESM, `moduleResolution: "bundler"`, `verbatimModuleSyntax`. Use `import type` for type-only imports.
- Include the `.ts`/`.tsx` extension in relative imports (`./App.tsx`).
- Function components with named exports. The only default exports are the exposed `App` modules (required by `lazy`).
- Use `@repo/ui` components (`Button`, `Card`, `Badge`, `Spinner`, `ErrorBoundary`) rather than re-implementing them.
- Add workspace dependencies with `"workspace:*"`. Keep shared dependency versions aligned across apps (single lockfile).
- Keep components accessible: semantic elements, `aria-*` on interactive controls, `type="button"` on buttons.
- Comment only non-obvious code.
