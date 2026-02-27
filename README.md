# Purchase and sales management system

- Online : https://erp.luozihan.space
- Account: admin@example.com
- Password: Admin12345.

A modern cloud-based ERP demo system built with ASP.NET Core (.NET 8) and Next.js 14, deployed on AWS (Lambda + API Gateway + Amplify).

This project demonstrates full-stack engineering capability including backend API design, frontend UI architecture, cloud deployment, and DevOps automation.

## Documentation

Detailed documentation is maintained in Notion:

- 📘 Software Requirements Specification  
- 🏗 Architecture Design  
- 🗓 Development Roadmap  
- 🔐 Identity & Security Design  


# Architecture Overview
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/d96302d1-c047-4f21-869a-b451ac145bf0" />


# demo scrennshot
<img width="2880" height="1558" alt="image" src="https://github.com/user-attachments/assets/631545a9-d331-4aa0-a278-56875e85dc51" />



<img width="2880" height="1558" alt="image" src="https://github.com/user-attachments/assets/14ebc989-4016-4f4e-9e62-bda30b28b313" />






<img width="2880" height="1558" alt="image" src="https://github.com/user-attachments/assets/e20a8d33-edc9-48a6-8c39-b06be02ad149" />
<img width="2880" height="1558" alt="image" src="https://github.com/user-attachments/assets/a1e36ef4-0998-488e-b877-78121440f66b" />
<img width="2240" height="1006" alt="image" src="https://github.com/user-attachments/assets/8cdc08cb-ddb1-4e16-bfc3-77cf1b752007" />







## Tech Stack

### Backend
- ASP.NET Core (.NET 8)
- Minimal APIs
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- AWS SDK for .NET

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts (Dashboard Charts)
- AWS Amplify Auth (Cognito)

### DevOps 
- AWS Lambda deployment
- API Gateway routing
- Amplify CI/CD
- GitHub version control
- Environment-based configuration

# Features
## Authentication
- AWS Cognito authentication
- Secure session management
- Role-based UI access

## Identity and User Management
- Platform ↔ Cognito user synchronization
  - Create / update / enable-disable / delete users via Cognito Admin APIs
  - User listing backed by Cognito (pagination supported)
  - IAM role-based secure access from Lambda to Cognito


# Project Structure
 ```bash
mini-erp/
│
├── backend/        # ASP.NET Core Lambda project
│
├── frontend/       # Next.js application
│
└── .gitignore
```

# Purpose of This Project
This project was built to demonstrate:

- Full-stack development capability
- Cloud-native architecture on AWS
- Serverless backend deployment
- Modern React (Next.js App Router)
- Clean UI architecture with reusable components
- DevOps workflow understanding

# Future Improvements
- Role-based access control(API)
- Order workflow logic
- Inventory alert automation
- CI/CD with GitHub Actions
- Payment integration (Stripe)
- Multi-tenant architecture

# Author
- Zihan Luo
- Full-Stack Developer | Cloud & DevOps Enthusiast
- Adelaide, Australia
