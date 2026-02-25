"use client";

// Comments in English.

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdmin as checkIsAdmin } from "@/lib/authz";
import { getAccessToken } from "@/lib/auth"; // you already have this

export default function RequireAdmin({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let mounted = true;

        (async () => {
            // If not logged in, redirect to /login
            const token = await getAccessToken();
            if (!mounted) return;

            if (!token) {
                router.replace("/login");
                return;
            }

            // If logged in but not admin, redirect to /403
            const admin = await checkIsAdmin();
            if (!mounted) return;

            if (!admin) {
                router.replace("/403");
                return;
            }

            setReady(true);
        })();

        return () => {
            mounted = false;
        };
    }, [router]);

    if (!ready) return null;
    return <>{children}</>;
}