import { Card } from "@repo/ui";

export function SettingsPage() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>
      <Card title="Host-owned page">This page lives in the host application.</Card>
    </section>
  );
}
