# Mini ERP - AI Agent Instructions

## Project Overview

This is a production-style Mini ERP system designed to demonstrate:

- Full-stack architecture
- Cloud-native deployment (AWS)
- Clean modular structure
- Scalable enterprise design

Frontend:
- Next.js (App Router)
- TypeScript (strict mode)
- shadcn/ui
- TailwindCSS

Backend:
- ASP.NET Core Web API
- Deployed via AWS Lambda + API Gateway
- DynamoDB as database

Infrastructure:
- AWS Amplify (frontend)
- AWS Lambda (backend)
- API Gateway
- DynamoDB
- Route53

---

# Architecture Rules

## General Rules

- Keep clean separation of concerns
- No mixing UI and business logic
- No hardcoded URLs or secrets
- All configs must use environment variables
- Follow scalable, production-ready patterns

---

# Frontend Rules

## Component Design

- Use functional components only
- Use TypeScript strictly (no `any`)
- Split UI and logic (container + presentational when needed)
- Keep components small and reusable
- Use shadcn/ui for UI consistency

## State Management

- Local state for small features
- Avoid unnecessary global state
- Keep API logic inside `/lib/api.ts`

## API Usage

- All API calls must use centralized request helper
- Handle loading + error states
- Never call fetch directly inside UI components

## UI Standards

- Follow clean enterprise dashboard layout
- Consistent spacing
- Use status colors properly
- No inline styling
- No unnecessary console logs

---

# Backend Rules (.NET + Lambda)

## Structure

- Controllers must be thin
- Business logic must go into Services
- Repository handles DynamoDB logic
- Follow clean layered architecture

## API Design

- RESTful endpoints
- Use proper HTTP status codes
- Return consistent JSON structure

## Code Standards

- Strong typing everywhere
- No duplicated logic
- Meaningful method naming
- Proper exception handling

---

# Cloud & Deployment Rules

- Backend must be Lambda compatible
- Keep cold-start minimal
- Environment variables required
- No AWS credentials in code
- Deployment must be CI/CD friendly

---

# Security & Compliance

- Prepare structure for future RBAC
- Validate input
- Never trust client input
- No sensitive data exposure
- Prepare audit-friendly structure

---

# Code Quality Requirements

When generating code:

- Must be production-ready
- Must include error handling
- Must include loading states (frontend)
- Must include validation (backend)
- Must be scalable
- No demo-level shortcuts

---

# Response Format (Important)

When generating files:

- Always include file path
- Return full file content
- Brief explanation before code
- No over-explaining
- Clean and readable output

---

# Future Expansion Preparation

System must support:

- Role-based access control
- Multi-tenant structure (future)
- Audit logging
- Soft delete
- Pagination
- Filtering & search
- Export (CSV / Excel)

Design everything with scalability in mind.