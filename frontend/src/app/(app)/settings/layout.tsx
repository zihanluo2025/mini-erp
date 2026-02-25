"use client";

import type { ReactNode } from "react";
import RequireAdmin from "@/components/common/RequireAdmin";

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return <RequireAdmin>{children}</RequireAdmin>;
}