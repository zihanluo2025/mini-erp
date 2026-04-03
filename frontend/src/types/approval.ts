export type ApprovalBusinessType = "INBOUND" | "OUTBOUND";
export type ApprovalStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN"
  | "OVERDUE";

export type ApprovalAction =
  | "SUBMIT"
  | "APPROVE"
  | "REJECT"
  | "WITHDRAW"
  | "RESUBMIT";

export interface ApprovalSummary {
  supplier: string;
  quantity: number;
  location: string;
}

export interface PendingApprovalItem {
  id: string;
  documentNo: string;
  businessType: ApprovalBusinessType;
  requesterName: string;
  requesterDept: string;
  requesterAvatar?: string;
  submittedAt: string;
  status: "PENDING" | "OVERDUE";
  isToday: boolean;
  isOverdue: boolean;
  summary: ApprovalSummary;
}

export interface CompletedApprovalItem {
  id: string;
  documentNo: string;
  businessType: ApprovalBusinessType;
  requesterName: string;
  requesterDept: string;
  action: "APPROVE" | "REJECT";
  comment: string;
  processedAt: string;
  currentStatus: "APPROVED" | "REJECTED";
}

export interface ApprovalRequestItem {
  id: string;
  documentNo: string;
  businessType: ApprovalBusinessType;
  summary: ApprovalSummary;
  createdAt: string;
  submittedAt?: string;
  currentApprover?: string;
  currentStatus: ApprovalStatus;
  updatedAt: string;
}

export interface ApprovalAuditItem {
  id: string;
  logId: string;
  documentNo: string;
  businessType: ApprovalBusinessType;
  requesterName: string;
  operatorName: string;
  action: ApprovalAction;
  fromStatus: ApprovalStatus;
  toStatus: ApprovalStatus;
  comment: string;
  createdAt: string;
}