# MediCare Pro – Hospital Appointment & Patient Management System

An Angular 17 + TypeScript full-stack application for managing hospital appointments, doctor schedules, and patient records.

---

## Tech Stack
| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Angular 17, TypeScript, Angular Material|
| Styling   | CSS3, Angular Material Theming          |
| Backend   | Node.js, Express, JSON Server           |
| Mock DB   | JSON Server (`server/db.json`)          |

---

## Project Structure

```
hospital-app/
├── src/
│   └── app/
│       ├── components/
│       │   ├── navbar/              # Sidebar navigation
│       │   ├── login/               # Template-driven login + role tabs
│       │   ├── home/                # Overview dashboard
│       │   ├── doctor-list/         # Doctor listing with filter pipe
│       │   ├── appointment-form/    # Reactive form with validation
│       │   ├── patient-dashboard/   # Patient appointments + medical history
│       │   ├── doctor-dashboard/    # Doctor schedule + approval workflow
│       │   └── shared/              # Confirm dialog
│       ├── models/                  # TypeScript interfaces
│       ├── services/                # DoctorService, PatientService, etc.
│       ├── guards/                  # AuthGuard, RoleGuard
│       ├── pipes/                   # FilterDoctorsPipe (custom pipe)
│       └── interceptors/            # HTTP interceptor
├── server/
│   ├── server.js                    # Express + JSON Server backend
│   └── db.json                      # Mock database
└── package.json
```

---

## Setup & Running

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend (JSON Server)
```bash
npm run server
# Runs on http://localhost:3000
```

### 3. Start the Angular Frontend
```bash
npm start
# Runs on http://localhost:4200
```

---

## Demo Credentials

| Role    | Email                   | Password    |
|---------|-------------------------|-------------|
| Patient | john@example.com        | patient123  |
| Doctor  | dr.chen@hospital.com    | doctor123   |
| Admin   | admin@hospital.com      | admin123    |

---

## API Endpoints (JSON Server)

| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| GET    | /doctors                    | List all doctors             |
| GET    | /doctors/:id                | Get doctor by ID             |
| GET    | /patients                   | List all patients            |
| GET    | /appointments               | List all appointments        |
| POST   | /appointments               | Create new appointment       |
| PATCH  | /appointments/:id           | Update appointment status    |
| DELETE | /appointments/:id           | Delete appointment           |
| GET    | /medicalRecords             | Get all medical records      |
| POST   | /auth/login                 | Simulated login              |

---

## Angular Architecture Concepts Used

1. **TypeScript Models** – `Doctor`, `Patient`, `Appointment`, `User` interfaces
2. **Standalone Components** – All components use `standalone: true`
3. **Lazy Loading** – Routes use `loadComponent()` for code splitting
4. **Reactive Forms** – Appointment booking form with full validation
5. **Template-driven Forms** – Login form
6. **Services + DI** – `DoctorService`, `PatientService`, `AppointmentService`, `AuthService`
7. **Route Guards** – `authGuard` and `roleGuard` with `CanActivateFn`
8. **HTTP Interceptor** – Centralized error handling + headers
9. **Custom Pipe** – `FilterDoctorsPipe` for filtering doctors by specialization/search
10. **RxJS Observables** – `forkJoin`, `BehaviorSubject`, `pipe`, `catchError`
11. **Angular Material** – MatTable, MatDialog, MatTabs, MatSnackBar, MatFormField, etc.
12. **Built-in Pipes** – `DatePipe`, `CurrencyPipe`, `TitleCasePipe`, `AsyncPipe`
