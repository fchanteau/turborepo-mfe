import { Link } from "react-router";
import { Navigation } from "./Navigation.tsx";
import { UserMenu } from "./UserMenu.tsx";

export function Header() {
  return (
    <header className="flex h-14 items-center gap-8 border-b bg-background px-6">
      <Link to="/" className="font-heading text-lg font-bold tracking-tight">
        Federation
      </Link>
      <Navigation />
      <div className="ml-auto">
        <UserMenu />
      </div>
    </header>
  );
}
