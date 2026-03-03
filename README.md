# 🩸 Blood Donation & Emergency Request Platform

A full-stack web platform connecting blood donors with patients in emergency situations. The system facilitates donor registration, emergency blood request posting, intelligent donor-patient matching based on blood compatibility, and community engagement — ultimately streamlining the blood donation process and saving lives.

> **Course:** CSE470 — Software Engineering | **Semester:** Spring 2026 | **Group:** 6

---

## 📄 SRS Document

📎 [Software Requirements Specification (SRS)](./docs/SRS.md)

Additional documentation available in the [`docs/`](./docs/) directory:
- [Blood_Donation_SRS_Final.docx](./docs/Blood_Donation_SRS_Final.docx)
- [WeHeal - CSE470 Project SRS.pdf](./docs/WeHeal%20-%20%20CSE470%20Project%20SRS.pdf)
- [Class Diagram](./docs/CLASS_DIAGRAM.md)
- [Project Plan](./docs/PROJECT_PLAN.md)

---

## 👥 Team Members

| Student ID | Name | Role / Module Responsibility |
|:----------:|------|------|
| 23101209 | **Kazi Salman Salim** | Donor Interface + Admin (Features 1, 2, 3, 4, 6, 7, 16) |
| 23101409 | **Miskatul Afrin Anika** | Community + History + Content (Features 5, 12, 13, 14, 15, 20) |
| 23101197 | **Athoy Roy** | Patient Side + System + Analytics (Features 8, 9, 10, 11, 17, 18, 19) |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React.js** (v19) | UI library for building the single-page application |
| **React Router DOM** (v7) | Client-side routing and navigation |
| **Axios** | HTTP client for API requests |
| **Leaflet.js + React-Leaflet** | Interactive maps for location-based donor search |
| **Recharts** | Data visualization (bar charts, line charts, pie charts) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Server-side JavaScript runtime |
| **Express.js** (v4) | RESTful API framework |
| **JSON Web Token (JWT)** | Stateless authentication |
| **bcrypt.js** | Password hashing |
| **Nodemailer** | Email notifications (Gmail SMTP) |
| **node-cron** | Scheduled jobs (eligibility reminders) |

### Database
| Technology | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Mongoose** (v8) | ODM for schema modeling and validation |

### Architecture
- **MVC (Model-View-Controller)** pattern
- RESTful API design with JWT Bearer token authentication
- Role-based access control (Donor, Requester, Admin)

### Domain / Hosting Plan
| Layer | Platform |
|---|---|
| Frontend | Vercel / Localhost (development) |
| Backend API | Render / Localhost (development) |
| Database | MongoDB Atlas (cloud) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kazisalman21/blood-donation-platform.git
   cd blood-donation-platform
   ```

2. **Setup the server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI, JWT secret, and email credentials
   ```

3. **Setup the client**
   ```bash
   cd ../client
   npm install
   ```

4. **Run the application**
   ```bash
   # Terminal 1 — Start the server
   cd server
   npm run dev

   # Terminal 2 — Start the client
   cd client
   npm start
   ```

---

## 📁 Project Structure

```
blood-donation-platform/
├── client/                    # React frontend (View layer)
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── admin/         # Admin dashboard components
│       │   ├── community/     # Leaderboard, history, feedback
│       │   ├── donor/         # Donor registration, profile, notifications
│       │   └── patient/       # Blood requests, maps, status tracking
│       └── utils/             # Client-side utilities (distance calc, etc.)
├── server/                    # Node.js + Express backend
│   ├── controllers/           # Business logic (Controller layer)
│   ├── models/                # Mongoose schemas (Model layer)
│   ├── routes/                # API route definitions
│   ├── middleware/             # Auth & role-based access middleware
│   ├── utils/                 # Server utilities (blood compatibility, etc.)
│   ├── jobs/                  # Scheduled cron jobs
│   └── server.js              # Entry point
└── docs/                      # SRS, project plans, diagrams
```

---

## ✨ Key Features (20 Total)

| # | Feature | Owner | Sprint |
|---|---------|-------|:------:|
| 1 | Donor Registration & Profile Management | Salman | 1 |
| 2 | Donor Availability Management (56-day rule) | Salman | 1 |
| 3 | Incoming Request Notifications (in-app + email) | Salman | 2 |
| 4 | Request Response & Dual-Consent Flow | Salman | 2 |
| 5 | Donation History & Statistics | Anika | 1 |
| 6 | Verification Badge System | Salman | 3 |
| 7 | Privacy-Protected Contact Sharing | Salman | 3 |
| 8 | Emergency Blood Request Posting | Athoy | 1 |
| 9 | Blood Compatibility Matching Algorithm | Athoy | 1 |
| 10 | Location-Based Donor Search (Leaflet + Haversine) | Athoy | 2 |
| 11 | Request Status Workflow Tracking (6-stage) | Athoy | 2 |
| 12 | Request History & Records | Anika | 1 |
| 13 | Donor Leaderboard & Recognition | Anika | 2 |
| 14 | Eligibility Reminder & Health Tips | Anika | 2 |
| 15 | Donor-Requester Feedback System | Anika | 3 |
| 16 | Admin User Management Dashboard | Salman | 3 |
| 17 | Blood Inventory & Supply Overview | Athoy | 3 |
| 18 | Platform Analytics & Reporting | Athoy | 3 |
| 19 | Broadcast Emergency Alerts | Athoy | 3 |
| 20 | Content & FAQ Management | Anika | 3 |

---

## 📜 License

This project is developed as part of the CSE470 Software Engineering course at BRAC University, Spring 2026.
