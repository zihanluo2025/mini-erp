export type CustomerStatus = "Active" | "Inactive" | "Prospect";
export type CustomerSegment = "Enterprise" | "SME" | "Startup";

export type Customer = {
    id: string;
    customerCode: string;
    customerName: string;
    companyName: string;
    segment: CustomerSegment;
    contactPerson: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    region: string;
    address?: string | null;
    status: CustomerStatus;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
};

export type CreateCustomerRequest = {
    customerCode: string;
    customerName: string;
    companyName: string;
    segment: CustomerSegment;
    contactPerson: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    region: string;
    address?: string | null;
    status: CustomerStatus;
    notes?: string | null;
};

export type UpdateCustomerRequest = CreateCustomerRequest;

export type CustomerFormValues = CreateCustomerRequest;