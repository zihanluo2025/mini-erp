"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SalesPoint } from "@/lib/dashboard/mock";

/**
 * Sales trend line chart card.
 */
export default function SalesTrendCard({ data }: { data: SalesPoint[] }) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Weekly Sales Trend</CardTitle>
                <div className="text-xs text-muted-foreground">Amount</div>
            </CardHeader>

            <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            strokeWidth={2.5}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
} 