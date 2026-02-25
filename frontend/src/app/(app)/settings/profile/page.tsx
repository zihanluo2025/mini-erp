"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ProfileForm = {
    fullName: string;
    email: string;
    phone: string;
    role: "admin" | "user";
    timezone: string;
    language: string;
    jobTitle: string;
    bio: string;
    notifyEmail: boolean;
    notifySecurity: boolean;
};

export default function ProfilePage() {
    // Mock user data (replace with Cognito later)
    const initial = useMemo<ProfileForm>(
        () => ({
            fullName: "Luozihan",
            email: "luo@example.com",
            phone: "+61 4xx xxx xxx",
            role: "admin",
            timezone: "Australia/Adelaide",
            language: "en",
            jobTitle: "Software Engineer",
            bio: "Building Mini ERP with AWS Cognito + Amplify.",
            notifyEmail: true,
            notifySecurity: true,
        }),
        []
    );

    const [form, setForm] = useState<ProfileForm>(initial);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);

    function update<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
        setDirty(true);
    }

    async function onSave() {
        setSaving(true);
        try {
            // TODO: call backend API to persist, or update Cognito attributes
            await new Promise((r) => setTimeout(r, 600));
            setDirty(false);
        } finally {
            setSaving(false);
        }
    }

    function onReset() {
        setForm(initial);
        setDirty(false);
    }

    const initials = useMemo(() => {
        const parts = form.fullName.trim().split(/\s+/);
        const a = parts[0]?.[0] ?? "U";
        const b = parts[1]?.[0] ?? "";
        return (a + b).toUpperCase();
    }, [form.fullName]);

    return (
        <div className="p-2">



            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left: summary */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>Your basic account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <div className="truncate font-medium">{form.fullName || "Unnamed User"}</div>
                                <div className="truncate text-sm text-muted-foreground">{form.email}</div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Role</span>
                                <Badge variant="secondary" className="capitalize">
                                    {form.role}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Timezone</span>
                                <span className="truncate">{form.timezone}</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Language</span>
                                <span className="uppercase">{form.language}</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Role</span>
                                <span className="uppercase">{form.role}</span>
                            </div>
                        </div>

                        <Separator />


                    </CardContent>
                </Card>

                {/* Right: form */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex-row items-start justify-between space-y-0">
                        <div>
                            <CardTitle>Profile details</CardTitle>
                            <CardDescription>Edit and save your profile settings</CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={onReset} disabled={!dirty || saving}>
                                Cancel
                            </Button>
                            <Button onClick={onSave} disabled={!dirty || saving}>
                                {saving ? "Saving..." : "Save changes"}
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div className="text-sm font-medium">Basic information</div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full name</Label>
                                    <Input
                                        id="fullName"
                                        value={form.fullName}
                                        onChange={(e) => update("fullName", e.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jobTitle">Job title</Label>
                                    <Input
                                        id="jobTitle"
                                        value={form.jobTitle}
                                        onChange={(e) => update("jobTitle", e.target.value)}
                                        placeholder="e.g. Software Engineer"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={form.email} disabled />
                                    <p className="text-xs text-muted-foreground">Email is managed by Cognito.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={form.phone}
                                        onChange={(e) => update("phone", e.target.value)}
                                        placeholder="+61 ..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={form.bio}
                                    onChange={(e) => update("bio", e.target.value)}
                                    placeholder="A short introduction..."
                                    className="min-h-[110px]"
                                />
                            </div>

                        </div>

                        <Separator />

                        {/* Preferences */}
                        <div className="space-y-4">
                            <div className="text-sm font-medium">Preferences</div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Timezone</Label>
                                    <Select value={form.timezone} onValueChange={(v) => update("timezone", v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Australia/Adelaide">Australia/Adelaide</SelectItem>
                                            <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                                            <SelectItem value="Australia/Melbourne">Australia/Melbourne</SelectItem>
                                            <SelectItem value="UTC">UTC</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <Select value={form.language} onValueChange={(v) => update("language", v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="zh">中文</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>










                    </CardContent>
                </Card>
            </div>
        </div>
    );
}