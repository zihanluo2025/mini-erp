"use client";

import { CalendarDays, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataFilterBarProps } from "./types";

function cn(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function DataFilterBar({
    fields,
    actionSlot,
    className,
}: DataFilterBarProps) {
    return (
        <div
            className={cn(
                "rounded-sm border border-slate-200/70 bg-[#EEF3FB] p-4 shadow-sm",
                className
            )}
        >
            <div className="grid gap-3 xl:grid-cols-[1.5fr_0.8fr_0.7fr_0.8fr_auto]">
                {fields.map((field) => {
                    if (field.type === "search") {
                        return (
                            <div key={field.key} className="relative">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={field.placeholder ?? "Search..."}
                                    className="h-12 rounded-xl border border-slate-200 bg-white pl-11 text-sm shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-200"
                                />
                            </div>
                        );
                    }

                    if (field.type === "select") {
                        const activeOption =
                            field.options.find((item) => item.value === field.value) ??
                            field.options[0];

                        return (
                            <Button
                                key={field.key}
                                variant="outline"
                                className="h-12 justify-between rounded-xl border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50"
                            >
                                <span>
                                    {field.label ? `${field.label}: ` : ""}
                                    <span className="font-semibold text-[#0A3B72]">
                                        {activeOption?.label}
                                    </span>
                                </span>
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        );
                    }

                    if (field.type === "dateRange") {
                        return (
                            <Button
                                key={field.key}
                                variant="outline"
                                onClick={field.onClick}
                                className="h-12 justify-between rounded-xl border-slate-200 bg-white px-4 text-[#0A3B72] hover:bg-slate-50"
                            >
                                <span className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    {field.value}
                                </span>
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        );
                    }

                    return <div key={field.key}>{field.render}</div>;
                })}

                {actionSlot ? actionSlot : null}
            </div>
        </div>
    );
}