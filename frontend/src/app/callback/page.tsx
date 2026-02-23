"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/lib/auth";
import { waitForToken } from "@/lib/auth";

export default function CallbackPage() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const token = await waitForToken(6000);
            if (token) {
                // route to products page and set a cookie to indicate the user is authenticated
                document.cookie = `erp_auth=1; path=/; max-age=${60 * 60 * 8}`;
                router.replace("/dashboard");
            } else {
                router.replace("/login");
            }
        })();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Signing you in...</div>
        </div>
    );
}