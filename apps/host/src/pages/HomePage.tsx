import { Button, Card } from "@repo/ui";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Welcome</h1>
      <Card
        title="Micro frontend demo"
        footer={<Button onClick={() => navigate("/catalog")}>Open the catalog</Button>}
      >
        This shell (host) owns the header, navigation and menu. The catalog is a separately built and
        deployed app loaded at runtime with Module Federation. Both share React, React Router and @repo/ui.
      </Card>
    </section>
  );
}
