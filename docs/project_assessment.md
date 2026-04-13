# 🩸 Project Assessment — Blood Donation Platform

## Project Overview

**Course:** CSE470 — Software Engineering | **Group:** 6 | **Semester:** Spring 2026

The Blood Donation & Emergency Request Platform is a full-stack MERN web application that connects voluntary blood donors with patients in urgent need. The system uses hand-written algorithms for blood compatibility matching, geographic proximity filtering, and community engagement.

---

## Is the Project Idea Strong?

| Strength | Why It Works |
|---|---|
| **Real-world relevance** | Blood donation platforms solve an actual problem — demonstrates social impact |
| **Feature complexity** | 20 features across 4 modules, covering the full donation lifecycle |
| **MERN stack** | Industry-standard tech stack with clear MVC architecture |
| **Multiple user roles** | Donor, Requester, Admin — demonstrates role-based access control |
| **Hand-written algorithms** | Blood compatibility, Haversine distance, CSV export, MongoDB aggregation — all custom-built |
| **Balanced workload** | ~7 features per member — well distributed across 3 team members |

---

## Sprint 1 Quality Review

### ✅ Strengths

| Area | Details |
|---|---|
| **MVC adherence** | All business logic in controllers, React handles only UI — clean separation |
| **Git workflow** | Feature branches, meaningful commits, sprint tags, 20 GitHub issues |
| **Code quality** | Proper error handling, loading states, empty states, input validation |
| **CSS consistency** | Dark glassmorphism theme with shared stylesheets |
| **Hand-written algorithms** | CSV export with RFC 4180 escaping, MongoDB aggregation pipeline — no forbidden libraries |
| **Documentation** | SRS (793 lines), Class Diagram (3 Mermaid diagrams), Git Plan, MVC Plan, Project Plan |

### 🔧 Issues Identified & Fixed

| Severity | Issue | Resolution |
|---|---|---|
| 🔴 Fixed | `authMiddleware.js` could send double HTTP responses | Added `else` branch to prevent second response |
| 🔴 Fixed | No authorization check — any user could edit another user's profile | Added `req.user._id` ownership verification |
| 🔴 Fixed | Password `minLength: 6` validated the bcrypt hash instead of plaintext | Added pre-hash validation in controller |
| 🔴 Fixed | CORS open to all origins (`*`) | Restricted to `localhost:3000` with `credentials: true` |

### 📝 Notes for Future Sprints

| Priority | Item | Sprint |
|---|---|---|
| 🟡 | No UI endpoint to create Donation records yet | Sprint 2 (tied to consent flow) |
| 🟢 | Some `.js` files could use `.jsx` extension for JSX components | Sprint 4 (polish) |

---

## 📊 Sprint 1 Scorecard

| Criteria | Score | Notes |
|---|---|---|
| **Features** | 🟢 Strong | 6 Sprint 1 features implemented, 20 total planned |
| **MVC Architecture** | 🟢 Strong | Clean separation, traceable through all layers |
| **Git Usage** | 🟢 Strong | Feature branches, issues, tags, 2 contributors |
| **Documentation** | 🟢 Strong | SRS, Class Diagram, Git Plan, MVC Plan, Project Plan |
| **Code Quality** | 🟢 Strong | Critical bugs identified and resolved |

---

## 💡 Recommendations for Sprint 2

1. **Use feature branches consistently** — create `feature/<name>` for every feature, merge via Pull Request
2. **All 3 members contribute commits** — ensure Git activity is visible for every team member
3. **Write smaller, focused commits** — one logical change per commit for cleaner history
4. **Close issues with commits** — use `closes #X` in commit messages for automatic issue tracking

**Bottom line: Sprint 1 deliverables are complete, codebase is clean after bug fixes, and the project is well-positioned for Sprint 2.** 👍

---

## 📈 Sprint 2 & 3 Progress Report (Updated April 14, 2026)

Based on a detailed audit of all component files and `git log`:

### ✅ Salman (100% Complete — 7/7 Features)
**Features:** F1, F2, F3, F4, F6, F7, F16 — ALL DONE
**Branches:** `feature/salman-verification`, `feature/salman-admin-dashboard`

| Sprint | Feature | Files Created |
|---|---|---|
| 1 | F1: Registration & Profile | `RegisterPage.jsx`, `LoginPage.jsx`, `DonorProfilePage.jsx` |
| 1 | F2: Availability Management | `AvailabilityToggle.jsx` |
| 2 | F3: Notifications | `NotificationBell.jsx`, `NotificationPanel.jsx` |
| 2 | F4: Consent Flow | `respondToRequest`, `requesterConsent` in controllers |
| 2 | F7: Privacy Contact Sharing | `getContactInfo` with hand-written masking |
| 3 | F6: Verification Badge | `VerificationRequestForm.jsx`, `VerificationRequest.css` |
| 3 | F16: Admin User Management | `AdminUsersPage.jsx`, `AdminUsers.css`, `AdminRoute.jsx` |

**Security Fixes Applied:**
- ✅ Authorization checks on `toggleAvailability` and `applyForVerification`
- ✅ Prevented duplicate donor matches in `respondToRequest`
- ✅ Requester notification created on donor acceptance
- ✅ Profile edit mode with inline inputs (name, city, area, phone)
- ✅ `AdminRoute.jsx` frontend guard — non-admin users redirected away from admin pages
- ✅ Admin-only Navbar links (gold accent, conditionally rendered)
- ✅ FAQ link added to Navbar
- ✅ ESLint CI build warnings fixed for Vercel deployment

### ✅ Anika (100% Complete — 6/6 Features)
**Features:** F5, F12, F13, F14, F15, F20 — ALL DONE
All code is fully written, pushed, and merged to `dev`.

### 🔴 Athoy (2/7 Features Complete)
**Features Complete:** F8, F9
**Features Pending:** F10 (Map), F11 (Status Tracker), F17 (Inventory), F18 (Analytics), F19 (Broadcast)

> **Team Action Required:** Athoy must urgently deliver F10, F11, F17, F18, F19 frontend components.

