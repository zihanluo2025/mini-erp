"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiGrid from "@/components/dashboard/KpiGrid";
import SalesTrendCard from "@/components/dashboard/SalesTrendCard";
import InventoryPieCard from "@/components/dashboard/InventoryPieCard";
import NoticeListCard from "@/components/dashboard/NoticeListCard";

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