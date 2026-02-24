"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Boxes,
    Warehouse,
    ShoppingCart,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator as DmSep,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import NavGroup from "@/components/layout/NavGroup";
import { fetchAuthSession } from "aws-amplify/auth";
import { logout } from "@/lib/auth";


type UserInfo = {
    email?: string;
    name?: string;
    preferred_username?: string;
};
type NavItem =
    | { href: string; label: string; icon: unknown }
    | { label: string; icon: unknown; children: { href: string; label: string }[] };

const NAV: NavItem[] = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
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
        children: [
            { href: "/sales/orders", label: "Orders" },
            //   { href: "/sales/refunds", label: "Refunds" },
        ],
    },
    {
        href: "/settings",
        label: "Settings",
        icon: Settings,
    },
];

function getInitials(email?: string, name?: string) {
    const base = (name || email || "U").trim();
    const parts = base.split(/\s+/).filter(Boolean);

    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getHeaderTitle(pathname: string) {
    if (!pathname || pathname === "/") return "home";
    return pathname.replace("/", "");
}

export default function AppShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const session = await fetchAuthSession();
                const claims = session.tokens?.idToken?.payload as any;

                if (!mounted) return;

                setUser({
                    email: claims?.email,
                    name: claims?.name,
                    preferred_username: claims?.preferred_username,
                });
            } catch {
                if (!mounted) return;
                setUser(null);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const displayName = useMemo(() => {
        return user?.preferred_username || user?.name || user?.email || "User";
    }, [user]);

    const headerTitle = useMemo(() => getHeaderTitle(pathname || "/"), [pathname]);

    return (
        <div className="min-h-screen erp-shell">
            <div className="grid grid-cols-[240px_1fr]">
                {/* Sidebar */}
                <aside className="min-h-screen erp-sidebar">
                    <div className="erp-brand">Mini ERP</div>

                    <nav className="erp-nav">
                        {NAV.map((item) => {
                            if ("href" in item) {
                                const active =
                                    pathname === item.href ||
                                    pathname.startsWith(item.href + "/");

                                const Icon = item.icon;

                                return (
                                    <Link key={item.href} href={item.href} className="block">
                                        <div
                                            className={[
                                                "erp-nav-item flex items-center gap-2",
                                                active ? "active" : "",
                                            ].join(" ")}
                                        >
                                            <Icon size={16} />
                                            <span>{item.label}</span>
                                        </div>
                                    </Link>
                                );
                            }

                            return (
                                <NavGroup
                                    key={item.label}
                                    label={item.label}
                                    icon={item.icon}
                                    childrenItems={item.children}
                                    pathname={pathname || "/"}
                                />
                            );
                        })}
                    </nav>
                </aside>

                <main className="min-w-0">
                    <header className="h-14 px-4 flex items-center justify-between erp-header">
                        <div className="text-sm opacity-90">{headerTitle}</div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2">
                                    <Avatar className="h-7 w-7">
                                        <AvatarFallback>{getInitials(user?.email, user?.name)}</AvatarFallback>
                                    </Avatar>
                                    {/* <span className="text-sm">{displayName}</span> */}
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Account</DropdownMenuLabel>

                                <div className="px-2 pb-2 text-xs text-muted-foreground break-all">
                                    {user?.email || "—"}
                                </div>

                                <DmSep />

                                <DropdownMenuItem asChild>
                                    <Link href="/account">Profile</Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link href="/settings">Settings</Link>
                                </DropdownMenuItem>

                                <DmSep />

                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={async () => {
                                        await logout();
                                    }}
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>

                    <div className="erp-content">
                        <div className="p-6">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
}