export interface NavItem {
  to: string;
  label: string;
  icon: string;
}

/** Single source of truth for the host's top-level navigation. */
export const navItems: NavItem[] = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/catalog", label: "Catalog", icon: "🛒" },
  { to: "/orders", label: "Orders", icon: "📦" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];
