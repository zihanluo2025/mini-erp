"use client";

// Comments in English.

import * as React from "react";
import { Button } from "@/components/ui/button";

type FilterBarAction = {
    key: string;
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    onClick: () => void;
    disabled?: boolean;
};

type FilterBarProps = {
    title?: React.ReactNode;

    // Left side filter inputs
    fields: React.ReactNode;

    // Right side buttons on the same row (e.g. Query/Reset)
    primaryActions?: FilterBarAction[];


    className?: string;
};

export function FilterBar({
    title,
    fields,
    primaryActions = [],
    className,
}: FilterBarProps) {
    return (
        <div className={["w-full", className].filter(Boolean).join(" ")}>
            {title ? <div className="mb-3">{title}</div> : null}

            <div className="rounded-xl border bg-white p-4">
                {/* Row 1: Filters + Query/Reset */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-wrap items-end gap-3">{fields}</div>

                    {primaryActions.length ? (
                        <div className="flex flex-wrap gap-2 lg:justify-end">
                            {primaryActions.map((a) => (
                                <Button
                                    key={a.key}
                                    variant={a.variant ?? "default"}
                                    onClick={a.onClick}
                                    disabled={a.disabled}
                                >
                                    {a.label}
                                </Button>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}