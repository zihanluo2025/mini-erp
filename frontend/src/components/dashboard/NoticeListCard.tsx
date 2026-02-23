"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { NoticeItem } from "@/lib/dashboard/mock";

/**
 * Notice list card.
 */
export default function NoticeListCard({ items }: { items: NoticeItem[] }) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Notices</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {items.map((n, idx) => (
                    <div key={n.title}>
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <div className="font-medium">{n.title}</div>
                                    <Badge variant="secondary" className="text-xs">
                                        {n.tag}
                                    </Badge>
                                </div>

                                <div className="text-sm text-muted-foreground mt-1">
                                    {n.content}
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                                {n.time}
                            </div>
                        </div>

                        {idx !== items.length - 1 && <Separator className="mt-3" />}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}