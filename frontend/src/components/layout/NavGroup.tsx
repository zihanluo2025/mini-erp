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

    const childActive = childrenItems.some(
        (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    );

    const [open, setOpen] = useState<boolean>(childActive);

    useEffect(() => {
        if (childActive) setOpen(true);
    }, [childActive]);

    return (
        <div className="block">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full text-left"
            >

                <div className={["erp-nav-item", "erp-nav-parent"].join(" ")}>
                    <div className="flex items-center justify-between">
                        <span>{label}</span>


                    </div>
                </div>
            </button>

            {open ? (
                <div >
                    {childrenItems.map((c) => {

                        const active = pathname === c.href || pathname.startsWith(c.href + "/");

                        return (
                            <Link key={c.href} href={c.href} className="block">
                                <div className={["erp-nav-item", active ? "active" : ""].join(" ")}>
                                    <div className="flex items-center gap-2 pl-4">
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