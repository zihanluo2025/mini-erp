"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormDrawerProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    submitText?: string;
    children: React.ReactNode;
};

export default function FormDrawer({
    open,
    title,
    onClose,
    onSubmit,
    isSubmitting,
    submitText = "Save",
    children,
}: FormDrawerProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* overlay */}
            <div className="flex-1 bg-black/30" onClick={onClose} />

            {/* drawer */}
            <div className="flex h-screen w-full max-w-[720px] flex-col bg-white shadow-2xl">
                {/* header */}
                <div className="shrink-0 border-b px-6 py-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[20px] font-semibold">
                            {title}
                        </h2>

                        <button
                            onClick={onClose}
                            className="rounded-md p-2 hover:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {children}
                </div>

                {/* footer */}
                <div className="shrink-0 border-t px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>

                        <Button onClick={onSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : submitText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}