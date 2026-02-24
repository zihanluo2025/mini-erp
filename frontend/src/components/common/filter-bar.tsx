"use client";

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
    title?: React.ReactNode; // e.g., breadcrumb area or page title
    fields: React.ReactNode; // filter inputs
    actions?: FilterBarAction[]; // right side buttons
    className?: string;
};

export function FilterBar({ title, fields, actions = [], className }: FilterBarProps) {
    return (
        <div className={["w-full", className].filter(Boolean).join(" ")}>
            {title ? <div className="mb-3">{title}</div> : null}

            <div className="rounded-xl border bg-white p-4">
                <div className="flex flex-col gap-3">
                    {/* Filters row */}
                    <div className="flex flex-wrap items-end gap-3">{fields}</div>

                    {/* Actions row */}
                    {actions.length ? (
                        <div className="flex flex-wrap gap-2">
                            {actions.map((a) => (
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