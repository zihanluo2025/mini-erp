"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Use your existing API function
import { createProduct } from "@/lib/apis/products";

type FormState = {
    name: string;
    supplier: string;
    origin: string;
    price: string; // keep as string for input
    stock: string; // keep as string for input
    status: "Active" | "Inactive";
};

export default function NewProductPage() {
    const router = useRouter();

    const [form, setForm] = React.useState<FormState>({
        name: "",
        supplier: "",
        origin: "",
        price: "",
        stock: "",
        status: "Active",
    });

    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Convert numeric fields safely
            const priceNum = form.price.trim() === "" ? undefined : Number(form.price);
            const stockNum = form.stock.trim() === "" ? undefined : Number(form.stock);

            if (!form.name.trim()) {
                setError("Product name is required.");
                setSaving(false);
                return;
            }
            if (priceNum !== undefined && Number.isNaN(priceNum)) {
                setError("Price must be a number.");
                setSaving(false);
                return;
            }
            if (stockNum !== undefined && Number.isNaN(stockNum)) {
                setError("Stock must be a number.");
                setSaving(false);
                return;
            }

            await createProduct({
                name: form.name.trim(),
                supplier: form.supplier.trim() || undefined,
                origin: form.origin.trim() || undefined,
                price: priceNum,
                stock: stockNum,
                status: form.status,
            });

            // Go back to list page
            router.push("/products");
            router.refresh(); // ensure list refreshes
        } catch (err: any) {
            setError(err?.message ?? "Failed to create product.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-4 p-2">
            {error ? (
                <div className="rounded-md border p-3 text-sm text-red-600">{error}</div>
            ) : null}
            <form
                onSubmit={onSubmit}
                className="w-full rounded-lg border bg-card p-6"
            >
                {/* Use 12-column grid for flexible layout */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Product Name */}
                    <div className="col-span-12 md:col-span-6 grid gap-2">
                        <label className="text-sm font-medium">Product Name *</label>
                        <Input
                            value={form.name}
                            onChange={(e) => setField("name", e.target.value)}
                            placeholder="e.g., Milk 2L"
                            disabled={saving}
                            required
                        />
                    </div>

                    {/* Supplier */}
                    <div className="col-span-12 md:col-span-6 grid gap-2">
                        <label className="text-sm font-medium">Supplier</label>
                        <Input
                            value={form.supplier}
                            onChange={(e) => setField("supplier", e.target.value)}
                            placeholder="e.g., ABC Foods"
                            disabled={saving}
                        />
                    </div>

                    {/* Origin */}
                    <div className="col-span-12 md:col-span-4 grid gap-2">
                        <label className="text-sm font-medium">Origin</label>
                        <Input
                            value={form.origin}
                            onChange={(e) => setField("origin", e.target.value)}
                            placeholder="e.g., SA"
                            disabled={saving}
                        />
                    </div>

                    {/* Price */}
                    <div className="col-span-12 md:col-span-4 grid gap-2">
                        <label className="text-sm font-medium">Price</label>
                        <Input
                            value={form.price}
                            onChange={(e) => setField("price", e.target.value)}
                            placeholder="e.g., 10"
                            disabled={saving}
                            inputMode="decimal"
                        />
                    </div>

                    {/* Stock */}
                    <div className="col-span-12 md:col-span-4 grid gap-2">
                        <label className="text-sm font-medium">Stock</label>
                        <Input
                            value={form.stock}
                            onChange={(e) => setField("stock", e.target.value)}
                            placeholder="e.g., 100"
                            disabled={saving}
                            inputMode="numeric"
                        />
                    </div>

                    {/* Status */}
                    <div className="col-span-12 grid gap-2">
                        <label className="text-sm font-medium">Status</label>

                        {/* Align controls on the left, badge on the right */}
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={form.status === "Active" ? "default" : "outline"}
                                    onClick={() => setField("status", "Active")}
                                    disabled={saving}
                                >
                                    Active
                                </Button>

                                <Button
                                    type="button"
                                    variant={form.status === "Inactive" ? "default" : "outline"}
                                    onClick={() => setField("status", "Inactive")}
                                    disabled={saving}
                                >
                                    Inactive
                                </Button>
                            </div>

                            <div className="md:ml-auto">
                                {form.status === "Active" ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
                                ) : (
                                    <Badge variant="secondary">Inactive</Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer actions */}
                    <div className="col-span-12 flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/products")}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Create"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}