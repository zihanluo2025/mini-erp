import { useEffect, useState } from "react";
import Link from "next/link";

export default function NavGroup({
    label,
    childrenItems,
    pathname,
}: {
    label: string;
    childrenItems: { href: string; label: string }[];
    pathname: string;
}) {
    const childActive = childrenItems.some((c) => pathname === c.href);
    const [open, setOpen] = useState<boolean>(childActive);

    useEffect(() => {
        if (childActive) setOpen(true);
    }, [childActive]);

    return (
        <div className="block">
            <button type="button" onClick={() => setOpen((v) => !v)} className="w-full text-left">
                <div className={["erp-nav-item", childActive ? "active" : ""].join(" ")}>
                    <div className="flex items-center justify-between">
                        <span>{label}</span>

                    </div>
                </div>
            </button>

            {open ? (
                <div className="pl-4">
                    {childrenItems.map((c) => {
                        const active = pathname === c.href;
                        return (
                            <Link key={c.href} href={c.href} className="block">
                                <div className={["erp-nav-item", active ? "active" : ""].join(" ")}>
                                    <div className="flex items-center gap-2">
                                        {/* <span className="inline-block h-1.5 w-1.5 rounded-full opacity-70 bg-current" /> */}
                                        <span>{c.label}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}