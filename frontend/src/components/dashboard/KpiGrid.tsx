"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { KpiItem } from "@/lib/dashboard/mock";

/**
 * KPI cards grid.
 */
export default function KpiGrid({ items }: { items: KpiItem[] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((kpi) => (
                <Card key={kpi.label} className="shadow-sm">
                    <CardContent className="py-5">
                        <div className="flex items-center gap-4">
                            {/* Round icon badge */}
                            <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-xl">
                                {kpi.icon}
                            </div>

                            <div className="min-w-0">
                                <div className="text-sm text-muted-foreground">
                                    {kpi.label}
                                </div>
                                <div className="text-2xl font-semibold tracking-tight">
                                    {kpi.value}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}