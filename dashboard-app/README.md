# Dashboard App

The **Progress Dashboard** is integrated into the main app under `src/components/dashboard/`.

## Routes

- **`/progress-dashboard`** — Base page: **EduDashboard** (analytics, skills, progress over time)
- **`/progress-dashboard/classes`** — **ClassManagement** (users, classes, organizations)
- **`/progress-dashboard/students`** — **StudentDetailsPage** (student detail view; pass `studentData` via navigation state)
- **`/progress-dashboard/license`** — **LicenseManagement** (license management placeholder)

## Components (in `src/components/dashboard/`)

- **EduDashboard.tsx** — Base dashboard page (sidebar, skills, results tables)
- **ClassManagement.tsx** — Class and user management
- **StudentdetailsPage.tsx** — Student details and analysis
- **LicenseManagement.tsx** — License management (placeholder)
- **PageHeader.tsx** — Dashboard header (logo, streak, Dashboard/Profile/Logout); links to `/progress-dashboard`

The main app header has a **Dashboard** button that opens `/progress-dashboard` in a new window.
