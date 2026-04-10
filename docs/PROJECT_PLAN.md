# 🩸 Blood Donation Platform — Master Project Plan

**Course:** CSE470 — Software Engineering | **Group:** 6 | **Semester:** Spring 2026

---

## 📌 What We Are Building

An **Emergency Blood Connection Web Application** using the MERN stack (MongoDB, Express.js, React, Node.js) with MVC architecture. The platform connects blood donors with patients in urgent need through:

- Intelligent blood compatibility matching (hand-written algorithm)
- Location-based donor search with Haversine distance filtering
- Dual-consent privacy workflow before sharing contact info
- 56-day donation cooldown enforcement
- Community features (leaderboard, badges, feedback)
- Admin dashboard (analytics, broadcast alerts, inventory)

**Total Features:** 20 (Login/Logout is NOT counted per faculty rules)

---

## 🗓 Faculty Sprint Timeline

| Sprint | Deadline | What's Due |
|--------|----------|-----------|
| **Sprint 1 / Assignment 1** | **2 March 2026** | Framework setup, environment config, workload distribution, SRS document, Class Diagram, template creation, self-learning |
| **Sprint 2** | To be declared | Core features — matching, notifications, consent flow, map, status tracker, leaderboard, reminders |
| **Sprint 3** | To be declared | Trust, admin, community — verification, privacy, feedback, admin panel, inventory, analytics, alerts, FAQ |
| **Sprint 4 (Polish)** | To be declared | Bug fixes, UI polish, end-to-end testing, deployment, documentation finalization |

---

## 📋 Sprint 1 / Assignment 1 — Status: ✅ COMPLETE

**Deadline: March 2, 2026**

Everything below is **done and pushed to `dev` branch**:

| Deliverable | Status | Location |
|-------------|--------|----------|
| SRS Document (20 features, 793 lines) | ✅ Done | `docs/SRS.md` + `docs/Blood_Donation_SRS_Final.docx` |
| Class Diagram (Mermaid syntax) | ✅ Done | `docs/CLASS_DIAGRAM.md` |
| Framework Setup (MERN + MVC) | ✅ Done | `server/` + `client/` |
| Environment Config (.env + MongoDB Atlas) | ✅ Done | `server/.env` (gitignored) |
| Workload Distribution | ✅ Done | SRS Table + this document |
| MVC Architecture | ✅ Done | Models → Controllers → Routes → Views |
| Git Workflow (main + dev branches) | ✅ Done | 10 GitHub Issues created |
| Setup Plans | ✅ Done | `docs/MVC_SETUP_PLAN.md` + `docs/GIT_SETUP_PLAN.md` |

### What's Already Coded (Ahead of Schedule)

These backend + frontend pieces were built during Sprint 1 setup and are ready:

| Component | Files | Lines |
|-----------|-------|-------|
| 7 Mongoose Models | `Donor`, `BloodRequest`, `Donation`, `Notification`, `Feedback`, `FAQ`, `AlertLog` | ~340 |
| 4 Controllers | `donorController`, `requestController`, `communityController`, `adminController` | ~1,068 |
| 4 Route Files | `donorRoutes`, `requestRoutes`, `communityRoutes`, `adminRoutes` | ~125 |
| 2 Middleware | `authMiddleware` (JWT), `adminOnly` (role check) | ~48 |
| 1 Utility | `bloodCompatibility.js` (hand-written ABO map + matching) | ~53 |
| 1 Cron Job | `reminderJob.js` (daily eligibility check) | ~46 |
| 10 React Components | Register, Login, Profile, PostRequest, History pages, Navbar, Footer, etc. | ~850 |
| 5 CSS Files | Dark glassmorphism theme, responsive design | ~780 |

---

## 👥 Team Members & Feature Distribution

### Salman — Kazi Salman Salim (23101209)
**Module:** Donor Interface + Admin | **Total Features:** 7

### Anika — Miskatul Afrin Anika (23101409)
**Module:** Community + History + Content | **Total Features:** 6

### Athoy — Athoy Roy (23101197)
**Module:** Patient Side + System + Analytics | **Total Features:** 7

---

## 🔴 Salman's Features (7 Total)

| # | Feature | Sprint | Backend | Frontend | Status |
|---|---------|--------|---------|----------|--------|
| F1 | Donor Registration & Profile Management | 1 | ✅ Done | ✅ Done | ✅ Complete |
| F2 | Donor Availability Management (56-day rule) | 1 | ✅ Done | ✅ Done | ✅ Complete |
| F3 | Incoming Request Notifications | 2 | ✅ Done | ✅ Done | ✅ Complete |
| F4 | Request Response & Dual-Consent Flow | 2 | ✅ Backend ready | ❌ Need ConsentModal.jsx | Pending |
| F6 | Verification Badge System | 3 | ✅ Backend ready | ❌ Need VerificationForm.jsx | Pending |
| F7 | Privacy-Protected Contact Sharing | 2 | ✅ Backend ready | ❌ Need ContactCard.jsx | Pending |
| F16 | Admin User Management Dashboard | 3 | ✅ Backend ready | ❌ Need AdminUsersPage.jsx | Pending |

### Salman's Sprint 2 Tasks (When Declared)
1. **F3 — Notification Panel** ✅ Done:
   - ✅ Create `NotificationBell.jsx` — bell icon with unread count badge in Navbar
   - ✅ Create `NotificationPanel.jsx` — slide-out panel listing notifications
   - ✅ API: `GET /api/donors/:id/notifications`, `PUT /api/notifications/:id/read`
   - ✅ Email sending via Nodemailer for Critical/Urgent requests

2. **F4 — Consent Flow**
   - Create `ConsentModal.jsx` — confirmation dialog when donor accepts a request
   - Wire `PUT /api/requests/:id/respond` (accept/decline) to the notification card
   - Wire `PUT /api/requests/:id/consent` (requester side)

3. **F7 — Contact Card**
   - Create `ContactCard.jsx` — shows masked info by default, unlocked after dual consent
   - Uses `GET /api/requests/:id/contact` (already built)

### Salman's Sprint 3 Tasks (When Declared)
4. **F6 — Verification Badge**
   - Create `VerificationRequestForm.jsx` — donor uploads ID document
   - Badge appears on profile when admin approves

5. **F16 — Admin User Management**
   - Create `AdminUsersPage.jsx` — table with search, filter, suspend/unsuspend buttons
   - Uses `GET /api/admin/users`, `PUT /api/admin/users/:id/suspend`, `PUT /api/admin/users/:id/verify`

---

## 🟢 Anika's Features (6 Total)

| # | Feature | Sprint | Backend | Frontend | Status |
|---|---------|--------|---------|----------|--------|
| F5 | Donation History & Statistics | 1 | ✅ Done | ✅ Done | ✅ Complete |
| F12 | Request History & Records | 1 | ✅ Done | ✅ Done | ✅ Complete |
| F13 | Donor Leaderboard & Milestone Badges | 2 | ✅ Done | ✅ Done | ✅ Complete |
| F14 | Eligibility Reminder & Health Tips | 2 | ✅ Done | ✅ Done | ✅ Complete |
| F15 | Donor-Requester Feedback System | 3 | ✅ Done | ✅ Done | ✅ Complete |
| F20 | Content & FAQ Management | 3 | ✅ Done | ✅ Done | ✅ Complete |

### What Anika Should Know

**Sprint 1 — ✅ COMPLETE:**

1. **F5 — DonationHistoryPage.jsx** ✅ Done:
   - ✅ Date range filters (`from` and `to` date inputs)
   - ✅ Blood type dropdown filter
   - ✅ Status dropdown filter (Scheduled/Completed/Cancelled)
   - ✅ Filters wired to backend query params `?from=&to=&bloodType=&status=`
   - ✅ `DonationStatsCard.jsx` created — total donations, lives helped, monthly Recharts bar chart
   - Branch: `feature/anika-donation-history` (2 commits)

2. **F12 — RequestHistoryPage.jsx** ✅ Done:
   - ✅ Date range, blood type, and status filters added
   - ✅ Expandable rows showing full request details + status timeline visualization
   - ✅ Hand-written CSV export with proper field escaping (no library)
   - ✅ New shared `HistoryFilters.css` with dark glassmorphism theme
   - Branch: `feature/anika-request-history` (1 commit)

**Sprint 2 — ✅ COMPLETE:**

3. **F13 — LeaderboardPage.jsx** ✅ Done:
   - ✅ Create a leaderboard table with "All Time" and "Monthly" tabs
   - ✅ Add city filter dropdown
   - ✅ Display donor name, blood type, donation count, badges
   - ✅ API: `GET /api/community/leaderboard?type=monthly&city=Dhaka`

4. **F14 — Email Reminders** ✅ Done:
   - ✅ Configure Nodemailer transport in `reminderJob.js`
   - ✅ Design HTML email template for eligibility reminders
   - ✅ Add health tips content

**Sprint 3 — ✅ COMPLETE:**

5. **F15 — FeedbackForm.jsx + DonorFeedbackSection.jsx** ✅ Done:
   - ✅ Star rating (1-5), gratitude message input, "Make Public" checkbox
   - ✅ Display public feedback on donor profile
   - ✅ API: `POST /api/community/feedback`, `GET /api/community/feedback/donor/:id`

6. **F20 — FAQPage.jsx + AdminContentEditor.jsx** ✅ Done:
   - ✅ Public accordion-style FAQ page with category tabs
   - ✅ Blood compatibility reference chart (color-coded grid)
   - ✅ Admin CRUD form for managing FAQ entries
   - ✅ API: `GET /api/community/faqs`, `POST/PUT/DELETE /api/admin/faqs`

---

## 🔵 Athoy's Features (7 Total)

| # | Feature | Sprint | Backend | Frontend | Status |
|---|---------|--------|---------|----------|--------|
| F8 | Emergency Blood Request Posting | 1 | ✅ Done | ✅ Basic form exists | Needs Enhancement |
| F9 | Blood Compatibility Matching Algorithm | 1 | ✅ Done | N/A (backend only) | Needs Postman Testing |
| F10 | Location-Based Donor Search (Map) | 2 | ⚠️ Partial | ❌ Need DonorMapPage.jsx | Pending |
| F11 | Request Status Workflow Tracker | 2 | ✅ Done | ❌ Need StatusTracker.jsx | Pending |
| F17 | Blood Inventory & Supply Overview | 3 | ✅ Done | ❌ Need InventoryPage.jsx | Pending |
| F18 | Platform Analytics & Reporting | 3 | ✅ Done | ❌ Need AnalyticsDashboard.jsx | Pending |
| F19 | Broadcast Emergency Alerts | 3 | ✅ Done | ❌ Need BroadcastPage.jsx | Pending |

### What Athoy Should Know

**Sprint 1 — Immediate:**

1. **F8 — PostRequestPage.jsx** (file exists, needs enhancement):
   - Add address autocomplete or at least a city dropdown
   - Create `RequestCard.jsx` — reusable card with urgency color badges
   - The page already posts to `POST /api/requests` and shows eligible donor count

2. **F9 — Matching Algorithm** (backend complete, needs testing):
   - Test all 8 blood types with Postman
   - Verify that O- donors are matched for ALL request types (universal donor)
   - Verify that AB+ requests match ALL 8 donor types (universal recipient)
   - Test edge cases: no donors in city, all donors in cooldown, suspended donors excluded
   - File: `server/utils/bloodCompatibility.js`

**Sprint 2 — When Declared:**

3. **F10 — DonorMapPage.jsx** (Leaflet.js):
   - Create interactive map centered on user's city
   - Display donor pins colored by blood type
   - Add radius filter (5km / 10km / 20km circle overlay)
   - Use `client/src/utils/distance.js` (Haversine formula already written)
   - Need to add geocoding: convert city/area to lat/lng using OpenStreetMap Nominatim API
   - Dependencies already installed: `leaflet@1.9.4`, `react-leaflet@5.0.0`

4. **F11 — StatusTracker.jsx**:
   - Create a horizontal stepper component showing the 6 stages:
     `Open → Donors Notified → Donor Matched → Contact Shared → Scheduled → Completed`
   - Highlight current stage, show timestamps for completed stages
   - API: The `statusHistory` array in BloodRequest already tracks this

**Sprint 3 — When Declared:**

5. **F17 — InventoryPage.jsx**:
   - 8-card grid showing donor count per blood type
   - Red card for "critical shortage" (< 5 donors)
   - City filter dropdown
   - API: `GET /api/admin/inventory?city=Dhaka`

6. **F18 — AnalyticsDashboard.jsx**:
   - 4-panel layout using Recharts:
     - Line chart: requests per week (last 8 weeks)
     - Bar chart: donations by city
     - Pie chart: match rate by blood type
     - Stat card: average response time
   - APIs: `GET /api/admin/analytics/requests`, `/donations`, `/matchrate`, `/responsetime`

7. **F19 — BroadcastPage.jsx**:
   - Form: select blood type, city, type message (max 200 chars)
   - Preview: "X donors will be notified"
   - History table showing past broadcasts
   - API: `POST /api/admin/broadcast`, `GET /api/admin/broadcast/history`

---

## 🛠 Technical Things Everyone Must Know

### 1. How Authentication Works
```
Register/Login → Server returns JWT token → Stored in localStorage
Every API call → Send token in header: Authorization: Bearer <token>
AuthContext.js → Provides user, token, login(), logout() to all components
ProtectedRoute.jsx → Redirects to /login if no token
```

### 2. API Base URL
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```
All API calls use this. When deploying to production, set `REACT_APP_API_URL` in the client `.env`.

### 3. How to Make an Authenticated API Call
```javascript
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const { token } = useAuth();

// GET request
const res = await axios.get(`${API_URL}/endpoint`, {
    headers: { Authorization: `Bearer ${token}` }
});

// POST request
const res = await axios.post(`${API_URL}/endpoint`, bodyData, {
    headers: { Authorization: `Bearer ${token}` }
});
```

### 4. Adding a New Page (Step-by-Step)
1. Create the component file: `client/src/components/<module>/<PageName>.jsx`
2. Import it in `App.js`
3. Add a `<Route>` in `App.js` (wrap with `<ProtectedRoute>` if it needs auth)
4. Add a link in `Navbar.jsx` if needed
5. Use the existing CSS files or create a new one — follow the dark glassmorphism theme

### 5. Running the Project
```bash
# Terminal 1 — Server
cd server
npm install     # first time only
npm run dev     # starts on port 5000

# Terminal 2 — Client
cd client
npm install     # first time only
npm start       # starts on port 3000
```

### 6. Git Workflow
```bash
# Always work on dev branch
git checkout dev
git pull origin dev

# After making changes
git add -A
git commit -m "feat: short description of what you did"
git push origin dev

# Before submission — merge to main
git checkout main
git merge dev
git push origin main
```

### 7. Commit Message Convention
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation only
- `style:` — CSS/formatting changes
- `refactor:` — code restructuring

### 8. Hand-Written Algorithms (NO Libraries Allowed)
These are **course requirements** — must be our own code, not from npm:

| Algorithm | Location | What It Does |
|-----------|----------|-------------|
| Blood Compatibility Map | `server/utils/bloodCompatibility.js` | ABO-Rh donor-recipient matching for all 8 types |
| Haversine Distance | `client/src/utils/distance.js` | Calculates km distance between two lat/lng points |
| CSV Export | `DonationHistoryPage.jsx` | Generates CSV file from donation data in browser |
| Phone/Email Masking | `requestController.js` | Hides contact info until dual consent |
| Leaderboard Ranking | `communityController.js` | MongoDB aggregation pipeline for donor rankings |
| Eligibility Check | `donorController.js` | 56-day cooldown calculation |

### 9. Folder Structure
```
blood-donation-platform/
├── client/                     # React frontend
│   └── src/
│       ├── components/
│       │   ├── donor/          # Salman's pages
│       │   ├── patient/        # Athoy's pages
│       │   ├── community/      # Anika's pages
│       │   └── shared/         # Navbar, Footer, ProtectedRoute
│       ├── context/            # AuthContext
│       ├── pages/              # HomePage
│       └── utils/              # Haversine distance
├── server/                     # Node.js backend
│   ├── controllers/            # Business logic
│   ├── middleware/              # Auth + admin checks
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routes
│   ├── utils/                  # Blood compatibility
│   └── jobs/                   # Cron jobs
└── docs/                       # SRS, Class Diagram, Plans
```

---

## ⚠️ Important Faculty Rules

1. **Login/Logout is NOT a feature** — it's infrastructure
2. **Minimum 20 features** required (we have exactly 20)
3. **MVC architecture** is mandatory
4. **Hand-written algorithms** — no npm libraries for core logic
5. **4 sprints** with 7-14 day cycles
6. **Each member must contribute code** — visible in Git commits
7. **SRS + Class Diagram** due with Sprint 1/Assignment 1

---

## 📊 Feature-to-Sprint Mapping (Complete)

### Sprint 1 (Due March 2) — 6 Features
| Feature | Owner | Status |
|---------|-------|--------|
| F1: Registration & Profile | Salman | ✅ Done |
| F2: Availability Management | Salman | ✅ Done |
| F5: Donation History & Stats | Anika | ✅ Done |
| F8: Emergency Request Posting | Athoy | ⚠️ Needs RequestCard.jsx |
| F9: Matching Algorithm | Athoy | ⚠️ Needs Postman testing |
| F12: Request History | Anika | ✅ Done |

### Sprint 2 (TBD) — 6 Features
| Feature | Owner | Status |
|---------|-------|--------|
| F3: Notifications | Salman | ✅ Code Done |
| F4: Consent Flow | Salman | |
| F7: Privacy Contact Sharing | Salman | |
| F10: Location Map Search | Athoy | |
| F11: Status Workflow Tracker | Athoy | |
| F13: Leaderboard & Badges | Anika | ✅ Code Done |
| F14: Eligibility Reminders | Anika | ✅ Code Done |

### Sprint 3 (TBD) — 8 Features
| Feature | Owner | Status |
|---------|-------|--------|
| F6: Verification Badge | Salman | |
| F15: Feedback System | Anika | ✅ Code Done |
| F16: Admin User Management | Salman | |
| F17: Blood Inventory Overview | Athoy | |
| F18: Analytics Dashboard | Athoy | |
| F19: Broadcast Alerts | Athoy | |
| F20: FAQ & Content Management | Anika | ✅ Code Done |

### Sprint 4 (TBD) — Polish
- Bug fixes across all features
- UI improvements and consistency check
- End-to-end testing of all 20 features
- Deployment to cloud (Render/Vercel)
- Final documentation update

---

## ✅ Current Status Summary (March 2, 2026)

| Item | Status |
|------|--------|
| Assignment 1 / Sprint 1 deliverables | ✅ All complete |
| SRS Document | ✅ 793 lines, 20 features documented |
| Class Diagram | ✅ 3 Mermaid diagrams, verified against code |
| Backend (all 34 API endpoints) | ✅ Built and wired |
| Frontend (7 pages + shared components) | ✅ Built with dark glassmorphism theme |
| Git repo with Issues | ✅ 10 issues on GitHub |
| Anika: F5 Donation History (filters + stats) | ✅ Complete — 2 commits on `feature/anika-donation-history` |
| Anika: F12 Request History (filters + expand + CSV) | ✅ Complete — 1 commit on `feature/anika-request-history` |
| Anika: F13 Leaderboard & Badges | ✅ Complete — 100% coded and committed |
| Anika: F14 Eligibility Reminders & Tips | ✅ Complete — 100% coded and committed |
| Anika: F15 Feedback System | ✅ Complete — 100% coded and committed |
| Anika: F20 FAQ & Content Management | ✅ Complete — 100% coded and committed |
| Sprint tag | ✅ `sprint-1-complete` tagged on main |

**Next immediate action:** All Anika's assignments for Sprints 1, 2, and 3 are successfully executed. Currently preparing for Polish/Manual Testing (Sprint 4) and assisting teammates if needed.
