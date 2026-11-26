import { Button, ErrorBoundary, Spinner } from "@repo/ui";
import { Suspense, type ComponentType } from "react";

export interface RemoteRouteProps {
  /** Display name used in the loading and error messages. */
  name: string;
  /** Remote component, typically `lazy(() => import("remote/App"))`. */
  component: ComponentType;
}

function RemoteUnavailable({ name }: { name: string }) {
  return (
    <div className="rounded-lg border border-dashed border-amber-500 bg-amber-50 p-6">
      <h2 className="mb-2 text-xl font-bold">{name} is unavailable</h2>
      <p className="mb-4 text-muted">The micro frontend could not be loaded. Make sure it is running.</p>
      <Button variant="secondary" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );
}

/** Renders a federated micro frontend, isolating loading states and failures from the host shell. */
export function RemoteRoute({ name, component: Remote }: RemoteRouteProps) {
  return (
    <ErrorBoundary fallback={<RemoteUnavailable name={name} />}>
      <Suspense fallback={<Spinner label={`Loading ${name.toLowerCase()}…`} />}>
        <Remote />
      </Suspense>
    </ErrorBoundary>
  );
}
