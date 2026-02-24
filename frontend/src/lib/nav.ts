import type { ReactNode } from "react";

export type NavItem = {
  title: string;
  href?: string;
  icon?: ReactNode;
  children?: { title: string; href: string }[];
};

export const NAV: NavItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  {
    title: "Basic Info",
    children: [
      { title: "Suppliers", href: "/suppliers" },
      { title: "Customers", href: "/customers" },
      { title: "Products", href: "/products" },
    ],
  },
  {
    title: "Inventory",
    children: [
      { title: "Inbound", href: "/inventory/inbound" },
      { title: "Returns", href: "/inventory/returns" },
    ],
  },
  {
    title: "Sales",
    children: [
      { title: "Sales Orders", href: "/sales/orders" },
      { title: "Refunds", href: "/sales/refunds" },
    ],
  },
  {
    title: "System",
    children: [{ title: "Admin Users", href: "/system/admin-users" }],
  },
];