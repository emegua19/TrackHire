# TrackHire – Job Application Tracker

A simple and organized system to help users track their job and internship applications in one place.

---

## Overview

TrackHire helps you manage your entire job search process in a structured way. Instead of using spreadsheets or notes, you can track all applications, their status, and progress through a single dashboard.

---

## How It Works

```text
User Registration / Login
        ↓
Add Job Application
        ↓
View All Applications
        ↓
Update Application Status
        ↓
Track Progress in Dashboard
````

---

## Dashboard Overview

```text
Dashboard Summary

Total Applications      : 10
Interviews Scheduled    : 2
Accepted                : 1
Rejected                : 3
```

---

## Features

### User Management

* Create a new account
* Secure login system
* Logout functionality

### Job Application Tracking

Users can store:

* Company name
* Job title / position
* Application date
* Job link
* Notes

### Application Management

* Add new applications
* View all applications
* Edit application details
* Delete applications

### Dashboard

* Total applications count
* Accepted applications
* Rejected applications
* Interview scheduled count

---

## Why Use TrackHire

Without TrackHire:

* You forget where you applied
* You lose track of interview updates
* You manage everything manually

With TrackHire:

* Everything is stored in one place
* Easy tracking of application status
* Clear progress overview

---

## Technology Stack

| Layer          | Technology        |
| -------------- | ----------------- |
| Frontend       | React             |
| Styling        | Tailwind CSS      |
| Backend        | Node.js + Express |
| Database       | PostgreSQL        |
| ORM            | Drizzle ORM       |
| Authentication | JWT               |

---

## Project Structure

```text
TrackHire
│
├── client (Frontend)
│   ├── Pages
│   ├── Components
│   ├── Services
│
├── server (Backend)
│   ├── Controllers
│   ├── Routes
│   ├── Database
│   ├── Middleware
│   ├── Schema
```

---

## Authentication Flow

```text
1. User registers
2. User logs in
3. Server validates credentials
4. Server returns JWT token
5. Token is used for protected requests
```

---

## Application Status Types

| Status    | Meaning                  |
| --------- | ------------------------ |
| Applied   | Application submitted    |
| Interview | Interview scheduled      |
| Accepted  | Selected for job         |
| Rejected  | Application not selected |

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/trackhire.git
cd trackhire
```

---

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

Create `.env` file:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/trackhire
JWT_SECRET=your_secret_key
PORT=5000
```

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:5000
```

---

## API Endpoints

### Authentication

```text
POST /api/auth/register   - Register user
POST /api/auth/login      - Login user
```

### Applications

```text
GET    /api/applications              - Get all applications
POST   /api/applications              - Create application
PUT    /api/applications/:id          - Update application
DELETE /api/applications/:id          - Delete application
GET    /api/applications/stats/dashboard - Dashboard statistics
```

---

## Future Improvements

* Search and filter applications
* Dark mode UI
* Resume upload feature
* Email reminders
* Interview calendar integration
* Analytics charts
* AI-based resume suggestions

---

## Deployment

Frontend:

* Vercel or Netlify

Backend:

* Render or Railway

Database:

* PostgreSQL (local or cloud)

---

## Conclusion

TrackHire is designed to simplify job search management. It helps users stay organized, track progress, and improve their chances of landing interviews and job offers.

---

## Author

Yitbarek Geletaw Demissie
Software Developer
```

