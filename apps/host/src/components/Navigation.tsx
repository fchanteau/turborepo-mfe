import { cn } from "@repo/ui";
import { NavLink } from "react-router";
import { navItems } from "../navigation.ts";

/** Horizontal top-level navigation displayed in the header. */
export function Navigation() {
  return (
    <nav aria-label="Main" className="flex gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              isActive && "bg-accent text-accent-foreground hover:text-accent-foreground",
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
