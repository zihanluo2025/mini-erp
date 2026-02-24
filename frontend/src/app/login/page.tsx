"use client";

import { startHostedLogin } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";


export default function LoginPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#070a0f]">

            <div className="pointer-events-none absolute inset-0">
                {/* base gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_25%,rgba(34,211,238,0.18),transparent_60%),radial-gradient(900px_circle_at_85%_25%,rgba(168,85,247,0.16),transparent_60%),radial-gradient(1000px_circle_at_55%_85%,rgba(59,130,246,0.12),transparent_60%)]" />
                {/* vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_50%_40%,transparent_40%,rgba(0,0,0,0.65))]" />
                {/* subtle noise-ish overlay */}
                <div className="absolute inset-0 opacity-30 [background:linear-gradient(0deg,rgba(255,255,255,0.04),rgba(255,255,255,0.00))]" />
            </div>

            {/* Top-left brand */}
            <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                        <span className="text-sm font-semibold text-white">M</span>
                    </div>
                    <div className="leading-tight">
                        <div className="text-sm font-semibold text-white">Mini ERP</div>
                        <div className="text-xs text-white/60">Secure Access</div>
                    </div>
                </div>


            </div>

            {/* Main */}
            <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl items-center px-6 pb-10">
                <Card
                    className="
            w-full overflow-hidden rounded-3xl border-white/10 bg-white/5
            shadow-[0_20px_80px_rgba(0,0,0,0.55)]
            backdrop-blur-xl
          "
                >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left panel */}
                        <div className="relative p-8 md:p-10">
                            {/* left panel glow */}
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_20%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(700px_circle_at_70%_80%,rgba(168,85,247,0.16),transparent_55%)]" />
                            <div className="relative">


                                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                                    Mini ERP Platform
                                </h1>
                                <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                                    A modern ERP dashboard for managing inventory, sales, and admin
                                    workflows. Sign in securely via AWS Cognito Hosted UI.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    <Tag>Role-based access</Tag>
                                    <Tag>Secure OAuth</Tag>
                                    <Tag>Audit-friendly</Tag>
                                </div>


                            </div>
                        </div>

                        {/* Right panel */}
                        <div className="p-8 md:p-10">
                            <CardHeader className="p-0">
                                <CardTitle className="text-white">Sign in</CardTitle>
                                <CardDescription className="text-white/60">
                                    Continue to your dashboard. You will be redirected to Cognito.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-0 pt-6">
                                <div className="space-y-4">
                                    <Button
                                        className="
                      w-full rounded-xl bg-white text-black
                      hover:bg-white/90
                    "
                                        onClick={() => startHostedLogin()}
                                    >
                                        Sign in
                                    </Button>



                                </div>
                            </CardContent>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function Tag({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white/75 ring-1 ring-white/15">
            {children}
        </span>
    );
}