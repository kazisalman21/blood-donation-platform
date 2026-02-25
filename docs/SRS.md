# Software Requirements Specification (SRS)

## 🩸 Blood Donation & Emergency Request Platform

**Course:** CSE470 — Software Engineering  
**Semester:** Spring 2026  
**Group:** 6

| Student ID | Name | Module Responsibility |
|---|---|---|
| 23101209 | Kazi Salman Salim | Donor Interface + Admin (7 features) |
| 23101409 | Miskatul Afrin Anika | Community + History + Content (6 features) |
| 23101197 | Athoy Roy | Patient Side + System + Analytics (7 features) |

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the **Blood Donation & Emergency Request Platform**, a web application designed to connect blood donors with patients in emergency situations. The platform facilitates donor registration, emergency blood request posting, intelligent donor-patient matching, and community engagement — ultimately streamlining the blood donation process and saving lives.

### 1.2 Scope
The platform is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application following MVC architecture. It covers:

- **Donor Management** — registration, profiles, availability tracking, verification
- **Emergency Requests** — posting, matching, status tracking, consent-based contact sharing
- **Community** — donation history, leaderboard, feedback, health tips
- **Administration** — user management, blood inventory, analytics, broadcast alerts, content management

### 1.3 Definitions & Acronyms

| Term | Definition |
|---|---|
| **MERN** | MongoDB, Express.js, React, Node.js |
| **MVC** | Model-View-Controller architecture pattern |
| **JWT** | JSON Web Token — used for stateless authentication |
| **Donor** | A registered user willing to donate blood |
| **Requester** | A user (patient/hospital representative) posting a blood request |
| **Admin** | A user with elevated permissions for platform management |
| **Blood Type** | One of 8 ABO-Rh types: A+, A−, B+, B−, AB+, AB−, O+, O− |
| **56-Day Rule** | Minimum gap between two whole-blood donations (FDA standard) |
| **Compatibility** | Medical rule determining which blood types a recipient can receive |

### 1.4 Technology Stack

| Layer | Technology |
|---|---|
| Frontend (View) | React.js |
| Backend (Controller) | Node.js + Express.js |
| Database (Model) | MongoDB + Mongoose ODM |
| Authentication | JWT + bcrypt |
| Maps | Leaflet.js + OpenStreetMap |
| Charts | Recharts |
| Email | Nodemailer |
| Scheduling | node-cron |

### 1.5 References
- CSE470 Project Outline (Spring 2026)
- FDA Blood Donation Eligibility Guidelines
- ABO Blood Group Compatibility Charts

---

## 2. Overall Description

### 2.1 Product Perspective
The platform is a standalone web application. It does not integrate with external hospital management systems. All data is self-contained within its MongoDB database. The system supports three user roles: **Donor**, **Requester** (implicit — any logged-in user can post a request), and **Admin**.

### 2.2 Product Functions (High-Level)
1. Donor registration, profile management, and availability control
2. Emergency blood request posting with urgency classification
3. Intelligent donor-patient matching based on blood compatibility, location, and eligibility
4. Multi-step consent workflow before sharing contact information
5. Real-time notifications (in-app + email)
6. Location-based donor search with interactive map
7. Request lifecycle tracking (6-stage workflow)
8. Community features: leaderboard, donation history, feedback
9. Administrative tools: user management, blood inventory, analytics, broadcast alerts
10. Content management: FAQ editor, blood compatibility reference

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| **Donor** | Individuals who register to donate blood. May also post blood requests. | Standard — can manage own profile, view notifications, respond to requests, view community features |
| **Requester** | Any logged-in user posting a blood request on behalf of a patient. | Standard — can post requests, track status, provide feedback |
| **Admin** | Platform administrators managing users, content, and system-wide operations. | Elevated — all donor/requester capabilities + user management, inventory, analytics, broadcasts, content editing |

### 2.4 Operating Environment
- **Client:** Modern web browsers (Chrome, Firefox, Edge, Safari)
- **Server:** Node.js runtime (v18+)
- **Database:** MongoDB Atlas (cloud-hosted)
- **Deployment:** Localhost for development; cloud deployment (e.g., Render/Vercel) for production

### 2.5 Design Constraints
- Must follow **MVC architecture** (course requirement)
- No Django, FastAPI, or Flask — Node.js + Express only
- Login/Registration is **not counted** as a feature
- Core algorithms (blood compatibility, distance calculation, leaderboard ranking, CSV export) must be **hand-written** — no libraries implementing these
- Minimum **20 features** required
- **4 sprints** of 7–14 days each

### 2.6 Assumptions and Dependencies
- Users have a stable internet connection
- MongoDB Atlas is available and accessible
- Users provide accurate blood type information
- Email delivery via Nodemailer (Gmail SMTP) is functional
- OpenStreetMap Nominatim API is available for geocoding

---

## 3. System Features — Detailed Requirements

> **Note:** Login/Logout is implemented as foundational infrastructure but is **not** counted as one of the 20 features per course rules.

---

### Feature 1: Donor Registration & Profile Management
**Owner:** Kazi Salman Salim  
**Priority:** High  
**Sprint:** 1

#### 3.1.1 Description
Donors register with personal details, blood type, location, and medical flags. After registration, donors can view and edit their profile, which displays donation statistics, badges, and eligibility status.

#### 3.1.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-1.1 | System SHALL provide a multi-step registration form collecting: name, email, password, blood type (dropdown with 8 options), city, area, and medical flags (diabetic, on medication, recent surgery) |
| FR-1.2 | System SHALL hash passwords using bcrypt before storing in the database |
| FR-1.3 | System SHALL generate a JWT token upon successful registration and return it to the client |
| FR-1.4 | System SHALL validate email uniqueness and return an error if the email is already registered |
| FR-1.5 | System SHALL display a profile page showing: blood type badge, total donation count, lives helped, next eligible date, earned badges, and verification status |
| FR-1.6 | System SHALL allow donors to edit their profile (name, city, area, medical flags) but NOT blood type or email |

#### 3.1.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/Donor.js` | Mongoose schema with all donor fields |
| Controller | `server/controllers/donorController.js` | `registerDonor()`, `getDonorProfile()`, `updateDonorProfile()` |
| Route | `server/routes/donorRoutes.js` | `POST /register`, `GET /:id`, `PUT /:id` |
| View | `client/src/components/donor/RegisterPage.jsx` | Multi-step form |
| View | `client/src/components/donor/DonorProfilePage.jsx` | Profile card with stats |

---

### Feature 2: Donor Availability Management
**Owner:** Kazi Salman Salim  
**Priority:** High  
**Sprint:** 1

#### 3.2.1 Description
Donors can toggle their availability status (available/unavailable). The system enforces a **56-day cooldown** after each donation — a donor cannot mark themselves as available until 56 days have passed since their last donation date.

#### 3.2.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-2.1 | System SHALL display an availability toggle switch on the donor dashboard |
| FR-2.2 | System SHALL prevent a donor from enabling availability if `today < nextEligibleDate` (lastDonationDate + 56 days) |
| FR-2.3 | System SHALL display a countdown showing days remaining until next eligible date when the toggle is locked |
| FR-2.4 | System SHALL gray out the toggle and show an explanatory message when the donor is in the cooldown period |
| FR-2.5 | System SHALL update `isAvailable` in the database when toggled successfully |

#### 3.2.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/Donor.js` | `isAvailable`, `nextEligibleDate` fields |
| Controller | `server/controllers/donorController.js` | `toggleAvailability()` |
| Route | `server/routes/donorRoutes.js` | `PUT /:id/availability` |
| View | `client/src/components/donor/AvailabilityToggle.jsx` | Toggle switch with countdown |

---

### Feature 3: Incoming Request Notifications
**Owner:** Kazi Salman Salim  
**Priority:** High  
**Sprint:** 2

#### 3.3.1 Description
When a new blood request is posted, the system notifies all compatible and eligible donors via in-app notifications and email alerts. Donors see a notification bell with an unread count badge in the navbar.

#### 3.3.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-3.1 | System SHALL create a Notification record for each eligible donor when a new blood request is posted |
| FR-3.2 | System SHALL display a bell icon in the navbar showing the count of unread notifications |
| FR-3.3 | System SHALL provide a slide-out notification panel listing all notifications with blood type, hospital, urgency (color-coded), and time |
| FR-3.4 | System SHALL allow donors to mark individual notifications as read |
| FR-3.5 | System SHALL send email alerts via Nodemailer to eligible donors for Critical and Urgent requests |

#### 3.3.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/Notification.js` | Notification schema |
| Controller | `server/controllers/notificationController.js` | `getNotifications()`, `markAsRead()`, `sendNotification()` |
| Route | `server/routes/donorRoutes.js` | `GET /notifications/:donorId`, `PUT /notifications/:id/read` |
| View | `client/src/components/donor/NotificationBell.jsx` | Bell icon with badge |
| View | `client/src/components/donor/NotificationPanel.jsx` | Slide-out drawer |

---

### Feature 4: Request Response & Consent Flow
**Owner:** Kazi Salman Salim  
**Priority:** High  
**Sprint:** 2

#### 3.4.1 Description
When a donor accepts a request, the system implements a **dual-consent workflow**. Contact information is only revealed when **both** the donor and the requester have given consent — ensuring privacy and mutual agreement.

#### 3.4.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-4.1 | System SHALL allow a donor to Accept or Decline a blood request from the notification panel |
| FR-4.2 | When a donor accepts, system SHALL set `donorConsent = true` on the BloodRequest |
| FR-4.3 | System SHALL notify the requester that a donor has been matched and request their acknowledgment |
| FR-4.4 | When the requester acknowledges, system SHALL set `requesterConsent = true` |
| FR-4.5 | Contact information SHALL only be accessible via API when BOTH `donorConsent` AND `requesterConsent` are `true` |
| FR-4.6 | System SHALL display a consent confirmation modal before either party submits their consent |

#### 3.4.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/BloodRequest.js` | `donorConsent`, `requesterConsent` fields |
| Controller | `server/controllers/requestController.js` | `respondToRequest()`, `requesterConsent()` |
| Route | `server/routes/requestRoutes.js` | `PUT /:id/respond`, `PUT /:id/consent` |
| View | `client/src/components/donor/ConsentModal.jsx` | Confirmation popup |
| View | `client/src/components/donor/ContactReveal.jsx` | Masked vs. revealed contact |

---

### Feature 5: Donation History & Statistics
**Owner:** Miskatul Afrin Anika  
**Priority:** Medium  
**Sprint:** 1

#### 3.5.1 Description
Donors can view their complete donation history in a filterable table and see summary statistics (total donations, lives helped, monthly breakdown chart).

#### 3.5.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-5.1 | System SHALL display a table of all past donations with columns: Date, Recipient (anonymized), Blood Type, Location, Status |
| FR-5.2 | System SHALL support filtering by date range, blood type, and status |
| FR-5.3 | System SHALL provide a CSV export button that generates a downloadable file without using any external library |
| FR-5.4 | System SHALL display summary statistics: Total Donations, Lives Helped, Current Streak |
| FR-5.5 | System SHALL render a bar chart (using Recharts) showing monthly donation count |

#### 3.5.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/Donation.js` | Donation schema |
| Controller | `server/controllers/communityController.js` | `getDonationHistory()`, `getDonorStats()` |
| Route | `server/routes/communityRoutes.js` | `GET /donors/:id/history`, `GET /donors/:id/stats` |
| View | `client/src/components/community/DonationHistoryPage.jsx` | Table + filters |
| View | `client/src/components/community/DonationStatsCard.jsx` | Stats + chart |

---

### Feature 6: Verification Badge System
**Owner:** Kazi Salman Salim  
**Priority:** Medium  
**Sprint:** 3

#### 3.6.1 Description
Donors can apply for a "Verified Donor" badge by submitting identification documents. Admins review and approve/reject verification requests. Verified donors appear with a blue checkmark and are ranked higher in search results.

#### 3.6.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-6.1 | System SHALL allow donors to submit a verification request with a document upload |
| FR-6.2 | System SHALL track verification status: `none` → `pending` → `verified` or `rejected` |
| FR-6.3 | System SHALL allow admins to approve or reject pending verification requests |
| FR-6.4 | System SHALL display a blue checkmark badge next to verified donor names throughout the platform |
| FR-6.5 | System SHALL sort verified donors higher in search results |

#### 3.6.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/Donor.js` | `verificationStatus` field |
| Controller | `server/controllers/donorController.js` | `applyForVerification()` |
| Controller | `server/controllers/adminController.js` | `approveVerification()` |
| View | `client/src/components/donor/VerificationRequestForm.jsx` | Upload + status |
| View | `client/src/components/donor/VerifiedBadge.jsx` | Blue checkmark |

---

### Feature 7: Privacy-Protected Contact Sharing
**Owner:** Kazi Salman Salim  
**Priority:** Medium  
**Sprint:** 3

#### 3.7.1 Description
Contact information (phone, email) is masked by default and only revealed after both donor and requester provide consent. The masking logic is hand-written (no library).

#### 3.7.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-7.1 | System SHALL display masked contact info (e.g., `+880-1***-***34`) by default |
| FR-7.2 | System SHALL only return real contact info from the API when both `donorConsent` and `requesterConsent` are `true` |
| FR-7.3 | System SHALL use a hand-written masking function — no external library |
| FR-7.4 | System SHALL show a "Contact Unlocked" UI state with full details when both consents are granted |

#### 3.7.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/BloodRequest.js` | `donorConsent`, `requesterConsent` |
| Controller | `server/controllers/contactController.js` | `getContactInfo()` |
| Route | `server/routes/requestRoutes.js` | `GET /:id/contact` |
| View | `client/src/components/donor/MaskedContact.jsx` | Masked display |
| View | `client/src/components/donor/ContactUnlocked.jsx` | Full contact |

---

### Feature 8: Emergency Blood Request Posting
**Owner:** Athoy Roy  
**Priority:** High  
**Sprint:** 1

#### 3.8.1 Description
Users can post emergency blood requests specifying blood type, units needed, hospital, location, and urgency level. Upon submission, the system triggers the matching algorithm and notifies eligible donors.

#### 3.8.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-8.1 | System SHALL provide a request form with: blood type selector, units (1–10), hospital name, address, and urgency (Critical/Urgent/Normal) |
| FR-8.2 | System SHALL validate all required fields before submission |
| FR-8.3 | System SHALL save the request with initial status `Open` and a timestamp in `statusHistory` |
| FR-8.4 | System SHALL trigger the blood compatibility matching algorithm upon successful creation |
| FR-8.5 | System SHALL display urgency levels with color-coded badges: Critical=red, Urgent=orange, Normal=green |

#### 3.8.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/BloodRequest.js` | BloodRequest schema |
| Controller | `server/controllers/requestController.js` | `createRequest()` |
| Route | `server/routes/requestRoutes.js` | `POST /` |
| View | `client/src/components/patient/PostRequestPage.jsx` | Request form |
| View | `client/src/components/patient/RequestCard.jsx` | Summary card |

---

### Feature 9: Blood Compatibility Matching Algorithm
**Owner:** Athoy Roy  
**Priority:** High  
**Sprint:** 1

#### 3.9.1 Description
A hand-written algorithm that maps each blood type to its compatible donor types (based on ABO-Rh medical rules) and queries the database for eligible, available donors in the same city. **No external library is used** — this is entirely custom code.

#### 3.9.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-9.1 | System SHALL maintain a compatibility map for all 8 blood types |
| FR-9.2 | `getCompatibleDonorTypes(bloodType)` SHALL return the array of blood types that can donate to the given type |
| FR-9.3 | `findEligibleDonors(bloodType, city)` SHALL query donors matching: compatible blood type, same city, `isAvailable = true`, and past the 56-day eligibility window |
| FR-9.4 | Results SHALL be sorted with verified donors first |
| FR-9.5 | The algorithm SHALL be implemented as a utility module — no external library |

#### 3.9.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Utility | `server/utils/bloodCompatibility.js` | `getCompatibleDonorTypes()`, `findEligibleDonors()` |
| Controller | `server/controllers/requestController.js` | Calls the utility after `createRequest()` |

---

### Feature 10: Location-Based Donor Search
**Owner:** Athoy Roy  
**Priority:** Medium  
**Sprint:** 2

#### 3.10.1 Description
An interactive map (Leaflet.js) displaying donor locations as pins, with radius-based filtering (5km/10km/20km) using a hand-written Haversine distance formula.

#### 3.10.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-10.1 | System SHALL display an interactive Leaflet.js map centered on Dhaka |
| FR-10.2 | System SHALL show donor pins colored by blood type |
| FR-10.3 | System SHALL provide radius filter buttons (5km, 10km, 20km) |
| FR-10.4 | Distance filtering SHALL use a hand-written Haversine formula — no library |
| FR-10.5 | System SHALL display a sidebar list of donors sorted by nearest first |
| FR-10.6 | Clicking a donor in the sidebar SHALL zoom the map to that donor's location |

#### 3.10.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Utility | `client/src/utils/distance.js` | `haversineDistance()` |
| Controller | `server/controllers/donorController.js` | `searchDonors()` |
| View | `client/src/components/patient/DonorMapPage.jsx` | Map + pins |
| View | `client/src/components/patient/DonorListSidebar.jsx` | Sorted donor list |

---

### Feature 11: Request Status Workflow Tracking
**Owner:** Athoy Roy  
**Priority:** Medium  
**Sprint:** 2

#### 3.11.1 Description
Blood requests progress through a 6-stage workflow: Open → Donors Notified → Donor Matched → Contact Shared → Scheduled → Completed. A visual progress tracker shows current status with timestamps.

#### 3.11.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-11.1 | System SHALL enforce a 6-stage linear workflow for each blood request |
| FR-11.2 | System SHALL log each stage transition with a timestamp in `statusHistory[]` |
| FR-11.3 | System SHALL display a horizontal progress bar with: completed=green, current=blue (pulsing), upcoming=gray |
| FR-11.4 | System SHALL show the timestamp for each completed stage |
| FR-11.5 | System SHALL validate role-based permissions before allowing stage advancement |

#### 3.11.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/BloodRequest.js` | `status`, `statusHistory[]` |
| Controller | `server/controllers/requestController.js` | `updateStatus()` |
| Route | `server/routes/requestRoutes.js` | `GET /:id/status`, `PUT /:id/status` |
| View | `client/src/components/patient/StatusTracker.jsx` | Progress bar |

---

### Feature 12: Request History & Records
**Owner:** Miskatul Afrin Anika  
**Priority:** Medium  
**Sprint:** 1

#### 3.12.1 Description
Requesters can view their past blood requests in a filterable table with date range, blood type, and status filters. Includes a hand-written CSV export function.

#### 3.12.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-12.1 | System SHALL display a table of past requests with columns: Date, Blood Type, Units, Urgency, Matched Donor (anonymized), Status |
| FR-12.2 | System SHALL support filtering by date range, blood type, and status |
| FR-12.3 | System SHALL allow clicking a row to expand and show full request details |
| FR-12.4 | System SHALL provide a CSV export button using hand-written logic (array join, no library) |

#### 3.12.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/BloodRequest.js` | (uses existing schema) |
| Controller | `server/controllers/communityController.js` | `getRequesterHistory()` |
| Route | `server/routes/communityRoutes.js` | `GET /requesters/:id/history` |
| View | `client/src/components/community/RequestHistoryPage.jsx` | Table + filters |
| View | `client/src/components/community/ExportCSVButton.jsx` | CSV export |

---

### Feature 13: Donor Leaderboard & Recognition
**Owner:** Miskatul Afrin Anika  
**Priority:** Medium  
**Sprint:** 2

#### 3.13.1 Description
A leaderboard ranking donors by donation count, with monthly and all-time views, city filtering, and badge recognition. Uses MongoDB aggregation pipeline — no external ranking library.

#### 3.13.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-13.1 | System SHALL display a leaderboard with Monthly and All-Time tabs |
| FR-13.2 | System SHALL support filtering by city |
| FR-13.3 | Top 3 donors SHALL be displayed with medal icons (gold, silver, bronze) |
| FR-13.4 | System SHALL use MongoDB aggregation pipeline to compute rankings — no library |
| FR-13.5 | System SHALL display earned badges in color and unearned badges in grayscale |
| FR-13.6 | System SHALL show an animated milestone popup when a new badge is earned |

#### 3.13.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Controller | `server/controllers/communityController.js` | `getLeaderboard()` |
| Route | `server/routes/communityRoutes.js` | `GET /leaderboard` |
| View | `client/src/components/community/LeaderboardPage.jsx` | Ranked table |
| View | `client/src/components/community/BadgeShowcase.jsx` | Badge grid |
| View | `client/src/components/community/MilestonePopup.jsx` | Popup animation |

---

### Feature 14: Eligibility Reminder & Health Tips
**Owner:** Miskatul Afrin Anika  
**Priority:** Low  
**Sprint:** 2

#### 3.14.1 Description
A daily cron job (node-cron) checks for donors approaching eligibility and sends reminder emails. The donor dashboard shows a countdown and rotating health tips.

#### 3.14.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-14.1 | System SHALL run a cron job daily at 8:00 AM to check donor eligibility dates |
| FR-14.2 | System SHALL send reminder emails to donors whose `nextEligibleDate` is within 2 days |
| FR-14.3 | System SHALL display an eligibility countdown card on the donor dashboard |
| FR-14.4 | System SHALL display rotating health tips (stored as a static array, rotated by day index) |

#### 3.14.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Cron Job | `server/jobs/reminderJob.js` | Scheduled task |
| View | `client/src/components/community/EligibilityReminderCard.jsx` | Countdown |
| View | `client/src/components/community/HealthTipsSection.jsx` | Tips rotation |

---

### Feature 15: Donor-Requester Feedback System
**Owner:** Miskatul Afrin Anika  
**Priority:** Medium  
**Sprint:** 3

#### 3.15.1 Description
After a donation is completed, the requester can leave a star rating (1–5) and a message for the donor. Feedback can be marked as public (with donor consent) and displayed on the donor's profile.

#### 3.15.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-15.1 | System SHALL only allow feedback submission when request status is `Completed` |
| FR-15.2 | System SHALL provide a star rating (1–5) built with clickable star icons and React state — no library |
| FR-15.3 | System SHALL limit feedback messages to 300 characters |
| FR-15.4 | System SHALL include a "Make Public" checkbox requiring donor consent |
| FR-15.5 | System SHALL display approved public feedback on the donor's profile page |

#### 3.15.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/Feedback.js` | Feedback schema |
| Controller | `server/controllers/communityController.js` | `submitFeedback()`, `getDonorFeedback()` |
| Route | `server/routes/communityRoutes.js` | `POST /feedback`, `GET /feedback/donor/:id` |
| View | `client/src/components/community/FeedbackForm.jsx` | Star rating form |
| View | `client/src/components/community/DonorFeedbackSection.jsx` | Feedback cards |

---

### Feature 16: Admin User Management Dashboard
**Owner:** Kazi Salman Salim  
**Priority:** Medium  
**Sprint:** 3

#### 3.16.1 Description
Admins can view all registered users in a searchable/filterable table, suspend accounts, approve verification requests, and view user activity logs.

#### 3.16.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-16.1 | System SHALL display all users in a paginated table with columns: Name, Email, Blood Type, Role, Status, Actions |
| FR-16.2 | System SHALL support search by name/email and filter by role and status |
| FR-16.3 | System SHALL allow admins to suspend/unsuspend user accounts |
| FR-16.4 | System SHALL allow admins to approve/reject donor verification requests |
| FR-16.5 | System SHALL display a user activity log modal showing login history |
| FR-16.6 | All admin routes SHALL be protected by `authMiddleware` + `adminOnly` middleware |

#### 3.16.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Controller | `server/controllers/adminController.js` | `getAllUsers()`, `suspendUser()`, `approveVerification()` |
| Route | `server/routes/adminRoutes.js` | `GET /users`, `PUT /users/:id/suspend`, `PUT /users/:id/verify` |
| View | `client/src/components/admin/AdminLayout.jsx` | Sidebar layout |
| View | `client/src/components/admin/UserManagementTable.jsx` | User table |
| View | `client/src/components/admin/ActivityLogModal.jsx` | Activity log |

---

### Feature 17: Blood Inventory & Supply Overview
**Owner:** Athoy Roy  
**Priority:** Medium  
**Sprint:** 3

#### 3.17.1 Description
An admin dashboard displaying available donor counts per blood type per city, with color-coded shortage alerts and bar charts.

#### 3.17.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-17.1 | System SHALL display 8 blood type cards in a grid showing available donor count per type |
| FR-17.2 | Cards SHALL be color-coded: green (>10 donors), yellow (3–10), red (<3) |
| FR-17.3 | System SHALL support city-based filtering |
| FR-17.4 | System SHALL display a red shortage alert banner when any blood type has <3 donors |
| FR-17.5 | System SHALL render a bar chart (Recharts) showing donor count per blood type |

#### 3.17.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Controller | `server/controllers/adminController.js` | `getBloodInventory()` |
| Route | `server/routes/adminRoutes.js` | `GET /inventory` |
| View | `client/src/components/patient/InventoryDashboard.jsx` | Blood type cards |
| View | `client/src/components/patient/CriticalShortageAlert.jsx` | Alert banner |
| View | `client/src/components/patient/BloodTypeBarChart.jsx` | Recharts bar chart |

---

### Feature 18: Platform Analytics & Reporting
**Owner:** Athoy Roy  
**Priority:** Medium  
**Sprint:** 3

#### 3.18.1 Description
An admin analytics dashboard with 4 charts: requests per week (line), donations by city (bar), match rate by blood type (pie), and average donor response time.

#### 3.18.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-18.1 | System SHALL display a line chart showing requests per week for the last 8 weeks |
| FR-18.2 | System SHALL display a bar chart showing donations grouped by city |
| FR-18.3 | System SHALL display a pie chart showing match rate per blood type |
| FR-18.4 | System SHALL display the average donor response time as a stat card |
| FR-18.5 | All chart data SHALL be computed via MongoDB aggregation — no external analytics library |

#### 3.18.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Controller | `server/controllers/adminController.js` | `getRequestAnalytics()`, `getDonationAnalytics()`, `getMatchRate()`, `getResponseTime()` |
| Route | `server/routes/adminRoutes.js` | `GET /analytics/requests`, `GET /analytics/donations`, `GET /analytics/matchrate`, `GET /analytics/responsetime` |
| View | `client/src/components/patient/AnalyticsDashboard.jsx` | 4-section chart layout |

---

### Feature 19: Broadcast Emergency Alerts
**Owner:** Athoy Roy  
**Priority:** Medium  
**Sprint:** 3

#### 3.19.1 Description
Admins can send broadcast email alerts to all eligible donors matching a specific blood type and city. Past broadcasts are logged and viewable.

#### 3.19.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-19.1 | System SHALL provide a broadcast form with: blood type selector, city selector, message input (200 char limit) |
| FR-19.2 | System SHALL preview the estimated donor count before sending |
| FR-19.3 | System SHALL show a confirmation dialog before sending |
| FR-19.4 | System SHALL send emails to all matching donors via Nodemailer loop |
| FR-19.5 | System SHALL log each broadcast in AlertLog with donor count and timestamp |
| FR-19.6 | System SHALL display a history table of past broadcasts |

#### 3.19.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/AlertLog.js` | AlertLog schema |
| Controller | `server/controllers/adminController.js` | `sendBroadcast()` |
| Route | `server/routes/adminRoutes.js` | `POST /broadcast`, `GET /broadcast/history` |
| View | `client/src/components/patient/BroadcastAlertPage.jsx` | Form + preview |
| View | `client/src/components/patient/AlertHistoryTable.jsx` | History table |

---

### Feature 20: Content & FAQ Management
**Owner:** Miskatul Afrin Anika  
**Priority:** Low  
**Sprint:** 3

#### 3.20.1 Description
A public FAQ page with categorized accordion-style questions, a blood compatibility reference chart, and an admin editor for CRUD operations on FAQ entries.

#### 3.20.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-20.1 | System SHALL display FAQs in an accordion format grouped by category tabs (Eligibility, Blood Types, Preparation, After Donation) |
| FR-20.2 | System SHALL display a color-coded blood compatibility chart (static component, hand-coded data) |
| FR-20.3 | System SHALL allow admins to create, edit, and delete FAQ entries |
| FR-20.4 | Each FAQ entry SHALL have: question, answer, category, display order, and active/inactive flag |

#### 3.20.3 MVC Mapping

| Layer | File | Functions |
|---|---|---|
| Model | `server/models/FAQ.js` | FAQ schema |
| Controller | `server/controllers/adminController.js` | `createFAQ()`, `updateFAQ()`, `deleteFAQ()` |
| Controller | `server/controllers/communityController.js` | `getFAQs()` |
| Route | `server/routes/adminRoutes.js` | `POST /faqs`, `PUT /faqs/:id`, `DELETE /faqs/:id` |
| Route | `server/routes/communityRoutes.js` | `GET /faqs` |
| View | `client/src/components/community/FAQPage.jsx` | Accordion + tabs |
| View | `client/src/components/community/BloodCompatibilityChartPage.jsx` | Static chart |
| View | `client/src/components/admin/AdminContentEditor.jsx` | CRUD form |

---

## 4. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-1 | System SHALL follow MVC architecture throughout all features |
| NFR-2 | System SHALL respond to API requests within 2 seconds under normal load |
| NFR-3 | System SHALL hash all passwords — plaintext passwords SHALL NOT be stored |
| NFR-4 | System SHALL use JWT tokens with expiration for authentication |
| NFR-5 | System SHALL be responsive and functional on screen widths ≥ 320px |
| NFR-6 | System SHALL use HTTPS in production deployment |
| NFR-7 | System SHALL protect admin routes with role-based middleware |
| NFR-8 | System SHALL mask sensitive contact information until consent is granted |
| NFR-9 | System SHALL support the latest versions of Chrome, Firefox, Edge, and Safari |
| NFR-10 | System SHALL use meaningful git commit messages and branch-per-feature workflow |

---

## 5. External Interface Requirements

### 5.1 User Interface
- Modern, responsive web interface built with React
- Dark-mode design with glassmorphism cards
- Blood-red accent color palette
- Inter font family for typography
- Consistent urgency color coding (Critical=red, Urgent=orange, Normal=green)

### 5.2 Hardware Interface
- No specific hardware requirements beyond a standard web browser

### 5.3 Software Interface
- **MongoDB Atlas** — cloud database
- **OpenStreetMap Nominatim** — geocoding API (free, no key)
- **Gmail SMTP** — email delivery via Nodemailer

### 5.4 Communication Interface
- RESTful HTTP API (JSON format)
- JWT Bearer token authentication
- WebSocket not required (polling-based notifications)

---

## 6. Appendix

### 6.1 Feature-to-Member Mapping

| # | Feature | Owner | Sprint |
|---|---|---|---|
| 1 | Donor Registration & Profile | Salman | 1 |
| 2 | Donor Availability Management | Salman | 1 |
| 3 | Incoming Request Notifications | Salman | 2 |
| 4 | Request Response & Consent Flow | Salman | 2 |
| 5 | Donation History & Statistics | Anika | 1 |
| 6 | Verification Badge System | Salman | 3 |
| 7 | Privacy-Protected Contact Sharing | Salman | 3 |
| 8 | Emergency Blood Request Posting | Athoy | 1 |
| 9 | Blood Compatibility Matching Algorithm | Athoy | 1 |
| 10 | Location-Based Donor Search | Athoy | 2 |
| 11 | Request Status Workflow Tracking | Athoy | 2 |
| 12 | Request History & Records | Anika | 1 |
| 13 | Donor Leaderboard & Recognition | Anika | 2 |
| 14 | Eligibility Reminder & Health Tips | Anika | 2 |
| 15 | Donor-Requester Feedback System | Anika | 3 |
| 16 | Admin User Management Dashboard | Salman | 3 |
| 17 | Blood Inventory & Supply | Athoy | 3 |
| 18 | Platform Analytics & Reporting | Athoy | 3 |
| 19 | Broadcast Emergency Alerts | Athoy | 3 |
| 20 | Content & FAQ Management | Anika | 3 |

### 6.2 Blood Type Compatibility Chart

| Recipient | Can Receive From |
|---|---|
| A+ | A+, A−, O+, O− |
| A− | A−, O− |
| B+ | B+, B−, O+, O− |
| B− | B−, O− |
| AB+ | A+, A−, B+, B−, AB+, AB−, O+, O− (Universal Recipient) |
| AB− | AB−, A−, B−, O− |
| O+ | O+, O− |
| O− | O− (Universal Donor) |
