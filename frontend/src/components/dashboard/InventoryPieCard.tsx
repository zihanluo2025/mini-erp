"use client";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    Legend,
    Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PieItem } from "@/lib/dashboard/mock";

/**
 * Inventory distribution pie chart card.
 */
export default function InventoryPieCard({
    data,
    colors,
}: {
    data: PieItem[];
    colors: string[];
}) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Inventory Breakdown</CardTitle>
                <div className="text-xs text-muted-foreground">
                    By item category (mock data)
                </div>
            </CardHeader>

            <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            label={(entry) => `${entry.name} (${entry.value}%)`}
                        >
                            {data.map((_, idx) => (
                                <Cell
                                    key={idx}
                                    fill={colors[idx % colors.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}