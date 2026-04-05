"use client";

import DashboardHeader from "@/app/(app)/dashboard/_components/DashboardHeader";
import KpiGrid from "@/app/(app)/dashboard/_components/KpiGrid";
import SalesTrendCard from "@/app/(app)/dashboard/_components/SalesTrendCard";
import InventoryPieCard from "@/app/(app)/dashboard/_components/InventoryPieCard";
import NoticeListCard from "@/app/(app)/dashboard/_components/NoticeListCard";

import {
    KPI_ITEMS,
    SALES_TREND,
    INVENTORY_DIST,
    PIE_COLORS,
    NOTICES,
} from "@/lib/dashboard/mock";

/**
 * Dashboard page.
 * UI text is fully in English, data is hard-coded for now.
 */
export default function DashboardPage() {
    return (
        <div className="space-y-5">
            <DashboardHeader />

            <KpiGrid items={KPI_ITEMS} />

            <div className="grid gap-4 xl:grid-cols-2">
                <SalesTrendCard data={SALES_TREND} />
                <InventoryPieCard data={INVENTORY_DIST} colors={PIE_COLORS} />
            </div>

            <NoticeListCard items={NOTICES} />
        </div>
    );
}