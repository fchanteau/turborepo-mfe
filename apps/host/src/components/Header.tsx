import { Link } from "react-router";
import { Navigation } from "./Navigation.tsx";

export function Header() {
  return (
    <header className="flex h-14 items-center gap-8 border-b border-border bg-surface px-6">
      <Link to="/" className="text-lg font-extrabold text-primary">
        Federation
      </Link>
      <Navigation />
    </header>
  );
}
