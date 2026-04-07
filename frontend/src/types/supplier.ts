export type SupplierStatus = "Draft" | "Active" | "Inactive";
export type SupplierRiskLevel = "Low" | "Medium" | "High";

export type Supplier = {
    id: string;
    supplierCode: string;
    supplierName: string;
    primaryCategory: string;
    contactPerson: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    region: string;
    address?: string | null;
    website?: string | null;
    status: SupplierStatus;
    riskLevel: SupplierRiskLevel;
    lastOrderDate?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
};

export type CreateSupplierRequest = {
    supplierCode: string;
    supplierName: string;
    primaryCategory: string;
    contactPerson: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    region: string;
    address?: string | null;
    website?: string | null;
    status: SupplierStatus;
    riskLevel: SupplierRiskLevel;
    lastOrderDate?: string | null;
    notes?: string | null;
};

export type UpdateSupplierRequest = CreateSupplierRequest;

export type SupplierFormValues = CreateSupplierRequest;