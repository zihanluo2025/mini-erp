import { CircleAlert } from "lucide-react";

export type PendingItem = {
    id: string;
    docNo: string;
    type: "Inbound" | "Sales";
    requester: string;
    summary: string;
    submittedAt: string;
    status: "Pending Approval";
    urgent?: boolean;
};

function cn(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function getInitials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function TypeBadge({ type }: { type: PendingItem["type"] }) {
    const isInbound = type === "Inbound";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                isInbound
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-blue-200 bg-blue-50 text-blue-700"
            )}
        >
            <span
                className={cn(
                    "h-2 w-2 rounded-full",
                    isInbound ? "bg-emerald-400" : "bg-blue-400"
                )}
            />
            {type}
        </span>
    );
}

export function StatusBadge({ urgent }: { urgent?: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <span className="inline-flex rounded-2xl bg-[#DDE8FF] px-3 py-1.5 text-xs font-bold leading-none text-[#245BDB]">
                PENDING
                <br />
                APPROVAL
            </span>
            {urgent ? <CircleAlert className="h-4 w-4 text-rose-500" /> : null}
        </div>
    );
}

export const pendingData: PendingItem[] = [
    {
        id: "1",
        docNo: "INB-20260403-001",
        type: "Inbound",
        requester: "Sarah Chen",
        summary: "500x Steel Chassis, Main Whse",
        submittedAt: "Apr 03, 09:45",
        status: "Pending Approval",
    },
    {
        id: "2",
        docNo: "SAL-20260402-094",
        type: "Sales",
        requester: "John Doe",
        summary: "Bulk Order: TechCorp Q2 Hardware",
        submittedAt: "Apr 02, 14:20",
        status: "Pending Approval",
        urgent: true,
    },
    {
        id: "3",
        docNo: "INB-20260403-012",
        type: "Inbound",
        requester: "Alice Martin",
        summary: "Replacement Sensors - North Wing",
        submittedAt: "Apr 03, 11:15",
        status: "Pending Approval",
    },
    {
        id: "4",
        docNo: "SAL-20260403-018",
        type: "Sales",
        requester: "Robert King",
        summary: "Urgent Sample Shipment - Neo-Line",
        submittedAt: "Apr 03, 13:02",
        status: "Pending Approval",
    },
];