"use client";

import { startHostedLogin } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Mini ERP</CardTitle>
                    <CardDescription>Sign in to access the dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button className="w-full" onClick={() => startHostedLogin()}>
                        Sign in
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        You will be redirected to AWS Cognito Hosted UI.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}