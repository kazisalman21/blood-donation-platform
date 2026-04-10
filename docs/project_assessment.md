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

## 📈 Sprint 2 & 3 Progress Report (Active Development)

Based on a detailed check of the component files (`client/src/components`) and `git log`:

### ✅ Anika (100% Complete)
**Commit Count**: 49 commits
Anika has completed **all 6 of her assigned features** (Sprints 1, 2, and 3). The code for F5, F12, F13, F14, F15, and F20 is fully written, pushed, and merged to the `dev` branch.

### 🟡 Salman (Pending UI Components)
**Commit Count**: 38 commits
Salman has bootstrapped the App and completed F1, F2, and recently F3 (Notification Panel). However, several major UI components for Sprints 2 & 3 are **missing**:
- ❌ `ConsentModal.jsx` (for F4: Consent Flow)
- ❌ `VerificationRequestForm.jsx` (for F6: Verification Badge)
- ❌ `ContactCard.jsx` (for F7: Privacy Contact Sharing)
- ❌ `AdminUsersPage.jsx` (for F16: Admin User Management)

### 🔴 Athoy (0 Commits / Not Started Frontend)
**Commit Count**: 0 commits
Athoy currently has **no commits** in the repository. While Salman stubbed out basic elements for F8 and F9 early on, Athoy has not delivered any of the frontend components required for their assigned Sprint 2 and 3 features. The following are entirely **missing**:
- ❌ `RequestCard.jsx` (Enhancement for F8)
- ❌ `DonorMapPage.jsx` (for F10: Location Map)
- ❌ `StatusTracker.jsx` (for F11: Workflow Tracker)
- ❌ `InventoryPage.jsx` (for F17: Inventory Overview)
- ❌ `AnalyticsDashboard.jsx` (for F18: Analytics)
- ❌ `BroadcastPage.jsx` (for F19: Broadcast Alerts)

> **Team Action Required:** Athoy must urgently push their local work to feature branches, and Salman needs to finalize the Frontend components for F4, F6, F7, F16 to catch up with the timeline.
