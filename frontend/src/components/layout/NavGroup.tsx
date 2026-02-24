import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";


export default function NavGroup({
    label,
    icon: Icon,
    childrenItems,
    pathname,
}: {
    label: string;
    icon: LucideIcon;
    childrenItems: { href: string; label: string }[];
    pathname: string;
}) {
    const childActive = childrenItems.some(
        (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    );

    const [open, setOpen] = useState<boolean>(childActive);

    useEffect(() => {
        if (childActive) setOpen(true);
    }, [childActive]);

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full text-left"
            >
                <div className="erp-nav-item erp-nav-parent flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon size={16} />
                        <span>{label}</span>
                    </div>

                    <ChevronDown
                        size={14}
                        className={`transition-transform ${open ? "rotate-180" : ""
                            }`}
                    />
                </div>
            </button>

            {open && (
                <div>
                    {childrenItems.map((c) => {
                        const active =
                            pathname === c.href || pathname.startsWith(c.href + "/");

                        return (
                            <Link key={c.href} href={c.href} className="block">
                                <div
                                    className={[
                                        "erp-nav-item",
                                        active ? "active" : "",
                                    ].join(" ")}
                                >
                                    <div className="pl-6">
                                        {c.label}
                                    </div>

                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}