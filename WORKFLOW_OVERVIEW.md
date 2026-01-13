# System Workflow Documentation

This document outlines the end-to-end workflow for the Project Management System, covering the interaction between the Client Portal and the Admin Dashboard.

## 1. Project Request (Client Side)
**Location:** `/builder` (Project Builder)
- **Actor:** Client (Guest or Logged in)
- **Process:**
    1.  Selects Project Type (Web, Mobile, AI Bot).
    2.  Provides specific details & answers dynamic questions.
    3.  Inputs project description (Voice or Text).
    4.  AI generates project structure and blueprint.
    5.  Client submits data.
- **Data Action:** Creates a record in `generated_projects` table.
- **Next Step:** Redirects to `/portal/requests`.

## 2. Admin Review (Admin Side)
**Location:** `/admin/requests` (Manage Requests)
- **Actor:** Administrator
- **Process:**
    1.  Views list of incoming requests.
    2.  Opens detailed view (Modal) to inspect:
        - Project Description
        - Specific Answers (Technical requirements)
        - AI Generated Files
    3.  Updates Project Status (e.g., `pending` -> `reviewing`).
    4.  **Key Action:** Clicks "Issue Contract" button.
- **Data Action:** Creates a record in `contracts` table linked to `project_id`.

## 3. Contract Signing (Client Side)
**Location:** `/portal/contracts`
- **Actor:** Client
- **Process:**
    1.  Receives notification/sees contract in list.
    2.  Reviews contract terms.
    3.  Clicks "Sign Contract".
- **Data Action:** Updates `contracts` table (`status: sworn/signed`, `signed_at: timestamp`).

## 4. Financial Processing (Client Side)
**Location:** `/portal/finance`
- **Actor:** Client
- **Process:**
    1.  Views generated invoices/installments.
    2.  Clicks "Pay Now" on pending invoices.
    3.  Completes Payment (Mocked Payment Gateway).
- **Data Action:** Updates invoice status (mocked) and financial dashboard stats.

## 5. Execution & Updates (Shared)
- **Admin:** Updates `project_stage` (Analysis -> Design -> Dev -> QA -> Launch) in `ManageRequests`.
- **Client:** View progress in `ClientDashboard` timeline.

## Database Relationships
- `generated_projects` (Main Entity)
    - `id` (BigInt)
    - `user_email` (Foreign Key Link)
- `contracts`
    - `project_id` (Link to `generated_projects`)
    - `user_email` (Link to User)
