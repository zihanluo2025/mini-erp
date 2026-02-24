"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
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

// Ensures Amplify Auth is configured once on the client.
import "@/lib/auth";

// Logout helper (should redirect to Cognito Hosted UI logout and back to /login)
import { logout } from "@/lib/auth";

// Reads current Cognito session tokens (ID token contains user claims)
import { fetchAuthSession } from "aws-amplify/auth";

type UserInfo = {
    email?: string;
    name?: string;
    preferred_username?: string;
};
type NavItem =
    | { href: string; label: string }
    | { label: string; children: { href: string; label: string }[] };

const NAV: NavItem[] = [
    { href: "/dashboard", label: "Dashboard" },

    {
        label: "Basic Info",
        children: [
            { href: "/products", label: "Products" },
            { href: "/suppliers", label: "Suppliers" },
            { href: "/customers", label: "Customers" },

        ],
    },

    {
        label: "Inventory",
        children: [
            { href: "/inventory/inbound", label: "Inbound" },
            { href: "/inventory/returns", label: "Returns" },
        ],
    },

    {
        label: "Sales",
        children: [
            { href: "/sales/orders", label: "Orders" },
            { href: "/sales/refunds", label: "Refunds" },
        ],
    },

    { href: "/settings", label: "Settings" },
];

/**
 * Returns user initials for AvatarFallback.
 * Prefers full name, falls back to email, then "U".
 */
function getInitials(email?: string, name?: string) {
    const base = (name || email || "U").trim();
    const parts = base.split(/\s+/).filter(Boolean);

    // Single word: take first 2 characters
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    // Multi words: take first letter of first two words
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Simple label for the header breadcrumb/title.
 * e.g. "/products" -> "products", "/" -> "home"
 */
function getHeaderTitle(pathname: string) {
    if (!pathname || pathname === "/") return "home";
    return pathname.replace("/", "");
}

/**
 * AppShell provides the classic ERP layout:
 * - Dark sidebar + active highlight
 * - Top header bar with user info + dropdown + logout
 * - Content area with padded container
 *
 * Note: Styling relies on your ERP theme classes in globals.css:
 * - erp-shell, erp-sidebar, erp-header, erp-content, erp-brand, erp-nav, erp-nav-item, erp-card (optional)
 */
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

    // Display name shown in the header: username > name > email > "User"
    const displayName = useMemo(() => {
        return user?.preferred_username || user?.name || user?.email || "User";
    }, [user]);

    const headerTitle = useMemo(() => getHeaderTitle(pathname || "/"), [pathname]);

    return (
        <div className="min-h-screen erp-shell">
            <div className="grid grid-cols-[240px_1fr]">
                {/* Sidebar */}
                <aside className="min-h-screen erp-sidebar">
                    {/* Brand / Logo area */}
                    <div className="erp-brand">Mini ERP</div>

                    {/* Navigation */}
                    <nav className="erp-nav">
                        {NAV.map((item) => {
                            if ("href" in item) {
                                const active = pathname === item.href;

                                return (
                                    <Link key={item.href} href={item.href} className="block">
                                        <div className={["erp-nav-item", active ? "active" : ""].join(" ")}>
                                            {item.label}
                                        </div>
                                    </Link>
                                );
                            }

                            return (
                                <NavGroup
                                    key={item.label}
                                    label={item.label}
                                    childrenItems={item.children}
                                    pathname={pathname || "/"}
                                />
                            );
                        })}
                    </nav>
                </aside>

                {/* Main area */}
                <main className="min-w-0">
                    {/* Header */}
                    <header className="h-14 px-4 flex items-center justify-between erp-header">
                        {/* Left: current route title */}
                        <div className="text-sm opacity-90">{headerTitle}</div>

                        {/* Right: user menu */}
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

                                {/* Email shown as secondary info */}
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
                                        // Redirect to Cognito Hosted UI logout and return to /login
                                        await logout();
                                    }}
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>

                    {/* Content */}
                    <div className="erp-content">
                        <div className="p-6">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
}