import { cn } from "@repo/ui";
import { useState } from "react";
import { NavLink } from "react-router";
import { navItems } from "../navigation.ts";

/** Collapsible side menu. */
export function Menu() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col gap-2 border-r border-border bg-surface p-3 transition-[width] duration-150",
        collapsed ? "w-14" : "w-50",
      )}
    >
      <button
        type="button"
        className="cursor-pointer self-end text-muted hover:text-fg"
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand menu" : "Collapse menu"}
        onClick={() => setCollapsed((c) => !c)}
      >
        {collapsed ? "»" : "«"}
      </button>
      <nav aria-label="Side menu" className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            title={item.label}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 whitespace-nowrap rounded-lg p-2 hover:bg-background",
                isActive && "bg-primary-soft font-semibold text-primary hover:bg-primary-soft",
              )
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
