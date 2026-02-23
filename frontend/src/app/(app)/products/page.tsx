"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProductsPage() {
    const [msg, setMsg] = useState("loading...");

    useEffect(() => {
        (async () => {
            try {
                const data = await apiFetch<any>("/products");
                setMsg(`OK: ${Array.isArray(data) ? `items=${data.length}` : "loaded"}`);
            } catch (e: any) {
                setMsg(`ERROR: ${e.message}`);
            }
        })();
    }, []);

    return (
        <div className="space-y-2">
            <h1 className="text-xl font-semibold">Products</h1>
            <div className="text-sm text-muted-foreground">{msg}</div>
        </div>
    );
}