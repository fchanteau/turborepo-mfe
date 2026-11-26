import { Button, cn } from "@repo/ui";
import { useState } from "react";
import { NavLink } from "react-router";
import { navItems } from "../navigation.ts";

/** Collapsible side menu. */
export function Menu() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col gap-2 border-r bg-sidebar p-3 text-sidebar-foreground transition-[width] duration-150",
        collapsed ? "w-14" : "w-50",
      )}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        className="self-end text-muted-foreground"
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand menu" : "Collapse menu"}
        onClick={() => setCollapsed((c) => !c)}
      >
        {collapsed ? "»" : "«"}
      </Button>
      <nav aria-label="Side menu" className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            title={item.label}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 whitespace-nowrap rounded-lg p-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
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
