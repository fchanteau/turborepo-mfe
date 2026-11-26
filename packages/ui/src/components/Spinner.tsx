export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 p-4 text-muted" role="status" aria-live="polite">
      <span className="size-4 animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
