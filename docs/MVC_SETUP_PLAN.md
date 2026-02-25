# MVC Architecture Setup Plan

## Blood Donation & Emergency Request Platform — CSE470 Group 6

> This document explains how MVC is implemented in the project and how each member should follow it.

---

## What is MVC in MERN?

```
┌───────────────┐     HTTP Request     ┌──────────────┐     Calls     ┌──────────────┐
│               │ ──────────────────▶  │              │ ──────────▶  │              │
│   VIEW        │                      │  CONTROLLER  │              │    MODEL     │
│   (React)     │ ◀──────────────────  │  (Express)   │ ◀──────────  │  (Mongoose)  │
│               │     JSON Response    │              │   DB Result  │              │
└───────────────┘                      └──────────────┘              └──────────────┘
 client/src/                           server/controllers/           server/models/
 components/                           server/routes/
```

| MVC Layer | MERN Equivalent | Folder | What Goes Here |
|-----------|----------------|--------|----------------|
| **Model** | Mongoose Schema | `server/models/` | Data structure, validation rules, DB interaction |
| **View** | React Components | `client/src/components/` | UI rendering, forms, user events — NO business logic |
| **Controller** | Express Controllers | `server/controllers/` | Business logic, validation, calls Model, returns JSON |
| **Router** | Express Routes | `server/routes/` | Maps URLs to Controller functions |

---

## Rules Every Member MUST Follow

### ✅ DO
1. **All database queries** go in **Controllers** (never in Routes or React)
2. **All business logic** (validation, calculations) goes in **Controllers**
3. React components **only** call API endpoints via `axios` — never import models
4. Each feature has files across **all 3 layers**: Model + Controller + View
5. Routes **only** call controller functions — zero logic in routes

### ❌ DON'T
1. ❌ Don't put `Donor.find()` or any Mongoose query inside a route file
2. ❌ Don't put blood compatibility logic inside a React component
3. ❌ Don't put validation logic inside React — validate on BOTH client AND server
4. ❌ Don't put `bcrypt.hash()` in the route — that's controller work

---

## File Naming Convention

```
server/
├── models/          → PascalCase:   Donor.js, BloodRequest.js
├── controllers/     → camelCase:    donorController.js
├── routes/          → camelCase:    donorRoutes.js
├── middleware/      → camelCase:    authMiddleware.js
└── utils/           → camelCase:    bloodCompatibility.js

client/src/
├── components/
│   ├── donor/       → PascalCase:   RegisterPage.jsx, DonorProfilePage.jsx
│   ├── patient/     → PascalCase:   PostRequestPage.jsx
│   ├── community/   → PascalCase:   LeaderboardPage.jsx
│   ├── admin/       → PascalCase:   AdminLayout.jsx
│   └── shared/      → PascalCase:   Navbar.jsx, Footer.jsx
├── context/         → PascalCase:   AuthContext.js
├── pages/           → PascalCase:   HomePage.jsx
└── utils/           → camelCase:    distance.js
```

---

## MVC Example — Feature Walkthrough

### Example: "Donor toggles availability" (Feature 2)

**Step 1 — View** (`AvailabilityToggle.jsx`)
```jsx
// React component — ONLY handles UI
const handleToggle = async () => {
  const res = await axios.put(`/api/donors/${user._id}/availability`, 
    { isAvailable: !isAvailable },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  setIsAvailable(res.data.isAvailable);
};
```

**Step 2 — Router** (`donorRoutes.js`)
```js
// Route — ONLY maps URL to controller function
router.put('/:id/availability', protect, toggleAvailability);
```

**Step 3 — Controller** (`donorController.js`)
```js
// Controller — ALL business logic lives here
const toggleAvailability = async (req, res) => {
  const donor = await Donor.findById(req.params.id);   // calls Model
  const today = new Date();
  
  // 56-day rule enforcement — THIS is business logic
  if (req.body.isAvailable && donor.nextEligibleDate > today) {
    return res.status(400).json({ message: 'Not eligible yet' });
  }
  
  donor.isAvailable = req.body.isAvailable;
  await donor.save();                                    // calls Model
  res.json({ success: true, isAvailable: donor.isAvailable });
};
```

**Step 4 — Model** (`Donor.js`)
```js
// Model — ONLY defines structure
isAvailable: { type: Boolean, default: true },
nextEligibleDate: { type: Date, default: null },
```

---

## MVC Mapping Per Member

### Salman (7 Features)
| Feature | Model | Controller | View |
|---------|-------|------------|------|
| F1: Registration | Donor.js | donorController.registerDonor | RegisterPage.jsx |
| F2: Availability | Donor.js | donorController.toggleAvailability | AvailabilityToggle.jsx |
| F3: Notifications | Notification.js | notificationController | NotificationBell.jsx, NotificationPanel.jsx |
| F4: Consent Flow | BloodRequest.js | requestController.respondToRequest | ConsentModal.jsx |
| F6: Verification | Donor.js | donorController.applyForVerification | VerificationRequestForm.jsx |
| F7: Contact Sharing | BloodRequest.js | contactController.getContactInfo | MaskedContact.jsx |
| F16: Admin Users | Donor.js | adminController.getAllUsers | UserManagementTable.jsx |

### Anika (6 Features)
| Feature | Model | Controller | View |
|---------|-------|------------|------|
| F5: Donation History | Donation.js | communityController.getDonationHistory | DonationHistoryPage.jsx |
| F12: Request History | BloodRequest.js | communityController.getRequesterHistory | RequestHistoryPage.jsx |
| F13: Leaderboard | Donation.js | communityController.getLeaderboard | LeaderboardPage.jsx |
| F14: Reminders | Donor.js | reminderJob.js (cron) | EligibilityReminderCard.jsx |
| F15: Feedback | Feedback.js | communityController.submitFeedback | FeedbackForm.jsx |
| F20: FAQ | FAQ.js | adminController.createFAQ | FAQPage.jsx |

### Athoy (7 Features)
| Feature | Model | Controller | View |
|---------|-------|------------|------|
| F8: Blood Request | BloodRequest.js | requestController.createRequest | PostRequestPage.jsx |
| F9: Matching Algo | — | utils/bloodCompatibility.js | — (called server-side) |
| F10: Map Search | Donor.js | donorController.searchDonors | DonorMapPage.jsx |
| F11: Status Tracker | BloodRequest.js | requestController.updateStatus | StatusTracker.jsx |
| F17: Inventory | Donor.js | adminController.getBloodInventory | InventoryDashboard.jsx |
| F18: Analytics | BloodRequest.js, Donation.js | adminController.getRequestAnalytics | AnalyticsDashboard.jsx |
| F19: Broadcast | AlertLog.js | adminController.sendBroadcast | BroadcastAlertPage.jsx |

---

## Viva Checkpoint

Before the viva, each member must answer:
1. "Where is the Controller in your feature? Show me."
2. "Why didn't you put this logic in the React component?"
3. "What does your Mongoose schema validate?"
4. "Trace the full request flow from button click to database and back."
