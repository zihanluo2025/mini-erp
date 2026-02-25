"use client";

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full space-y-2">
                <h1 className="text-2xl font-semibold">403 - Forbidden</h1>
                <p className="text-sm text-muted-foreground">
                    You don&apos;t have permission to access this page.
                </p>
            </div>
        </div>
    );
}