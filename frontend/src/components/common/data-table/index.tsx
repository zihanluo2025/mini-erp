"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableProps } from "./types";

function cn(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function DataTable<T>({
    data,
    columns,
    rowKey,
    selectable = false,
    selectedRowKeys = [],
    onSelectRow,
    onSelectAll,
    allChecked = false,
    emptyText = "No data",
    pagination,
    rowClassName,
    footerLeft,
}: DataTableProps<T>) {
    return (
        <div className="overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b border-slate-200 bg-white">
                        <tr className="text-left">
                            {selectable ? (
                                <th className="w-14 px-6 py-5">
                                    <Checkbox
                                        checked={allChecked}
                                        onCheckedChange={(checked) => onSelectAll?.(Boolean(checked))}
                                    />
                                </th>
                            ) : null}

                            {columns.map((column, index) => (
                                <th
                                    key={`${column.key}-${index}`}
                                    className={cn(
                                        "px-6 py-5 text-xs font-bold uppercase tracking-[0.1em] text-slate-500",
                                        column.headerClassName
                                    )}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (selectable ? 1 : 0)}
                                    className="px-6 py-10 text-center text-sm text-slate-400"
                                >
                                    {emptyText}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => {
                                const key = rowKey(row);

                                return (
                                    <tr
                                        key={key}
                                        className={cn(
                                            "border-b border-slate-100 transition-colors hover:bg-slate-50",
                                            rowClassName?.(row)
                                        )}
                                    >
                                        {selectable ? (
                                            <td className="px-6 py-6 align-middle">
                                                <Checkbox
                                                    checked={selectedRowKeys.includes(key)}
                                                    onCheckedChange={() => onSelectRow?.(key)}
                                                />
                                            </td>
                                        ) : null}

                                        {columns.map((column, index) => (
                                            <td
                                                key={`${column.key}-${index}`}
                                                className={cn("px-6 py-6 align-middle", column.className)}
                                            >
                                                {column.render(row)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {pagination ? (
                <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        {footerLeft ??
                            `Showing ${Math.min(
                                pagination.currentPage * pagination.pageSize,
                                pagination.totalItems
                            )
                            } of ${pagination.totalItems} items`}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={pagination.currentPage <= 1}
                            onClick={() => pagination.onPageChange?.(pagination.currentPage - 1)}
                            className="h-9 w-9 rounded-lg border-slate-200 text-slate-400"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from({ length: pagination.totalPages }).map((_, index) => {
                            const page = index + 1;
                            const active = page === pagination.currentPage;

                            return (
                                <Button
                                    key={page}
                                    variant={active ? "default" : "outline"}
                                    onClick={() => pagination.onPageChange?.(page)}
                                    className={cn(
                                        "h-9 min-w-9 rounded-lg px-3",
                                        active
                                            ? "bg-[#175CFF] text-white hover:bg-[#0F4FE8]"
                                            : "border-slate-200 text-slate-600"
                                    )}
                                >
                                    {page}
                                </Button>
                            );
                        })}

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={pagination.currentPage >= pagination.totalPages}
                            onClick={() => pagination.onPageChange?.(pagination.currentPage + 1)}
                            className="h-9 w-9 rounded-lg border-slate-200 text-slate-700"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}