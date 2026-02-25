import { Boxes, LayoutDashboard, Warehouse, ShoppingCart, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Comments in English.

export type Role = "admin";

export type NavItem =
  | { href: string; label: string; icon: LucideIcon; requiredRole?: Role }
  | {
      label: string;
      icon: LucideIcon;
      requiredRole?: Role;
      children: { href: string; label: string; requiredRole?: Role }[];
    };

export const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

  {
    label: "Basic Info",
    icon: Boxes,
    children: [
      { href: "/products", label: "Products" },
      { href: "/suppliers", label: "Suppliers" },
      { href: "/customers", label: "Customers" },
    ],
  },

  {
    label: "Inventory",
    icon: Warehouse,
    children: [
      { href: "/inventory/inbound", label: "Inbound" },
      { href: "/inventory/returns", label: "Returns" },
    ],
  },

  {
    label: "Sales",
    icon: ShoppingCart,
    children: [{ href: "/sales/orders", label: "Orders" }],
  },

  // only show settings to admins for now, since it includes user management
  {
    label: "Settings",
    icon: Settings,
    requiredRole: "admin",
    children: [
      { href: "/settings/users", label: "Users", requiredRole: "admin" },
      { href: "/settings/profile", label: "Profile", requiredRole: "admin" },
    ],
  },
];