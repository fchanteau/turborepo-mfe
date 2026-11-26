import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";

export function SettingsPage() {
  return (
    <section>
      <h1 className="mb-4 font-heading text-2xl font-bold tracking-tight">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Host-owned page</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">This page lives in the host application.</CardContent>
      </Card>
    </section>
  );
}
