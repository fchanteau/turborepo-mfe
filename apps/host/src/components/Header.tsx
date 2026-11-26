import { Link } from "react-router";
import { Navigation } from "./Navigation.tsx";

export function Header() {
  return (
    <header className="flex h-14 items-center gap-8 border-b bg-background px-6">
      <Link to="/" className="font-heading text-lg font-bold tracking-tight">
        Federation
      </Link>
      <Navigation />
    </header>
  );
}
