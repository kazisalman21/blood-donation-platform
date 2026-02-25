# Git Setup & Workflow Plan

## Blood Donation & Emergency Request Platform — CSE470 Group 6

> Git usage is worth **3 marks** (commits, issues, branches, collaboration). This plan ensures maximum marks.

---

## 1. Initial Setup (Do This FIRST)

### Repository Already Created
The repo is at: `e:\coding\blood-donation-platform` with remote on GitHub.

### Step 1 — Create `dev` branch
```bash
git checkout -b dev
git push -u origin dev
```

### Step 2 — Set Branch Protection (GitHub Web)
1. Go to **Settings → Branches → Add Rule**
2. Branch: `main`
3. ✅ Require pull request before merging
4. ✅ Require 1 approval
5. This prevents accidental pushes to `main`

### Step 3 — Add Faculty as Collaborator
1. Go to **Settings → Collaborators**
2. Add your section faculty's GitHub username
3. Do this in Sprint 1 (required by course outline)

### Step 4 — Anika's Git Config (Shared Laptop)
Since Anika uses Salman's laptop, run this inside the project folder:
```bash
cd e:\coding\blood-donation-platform
git config --local user.name  "Miskatul Afrin Anika"
git config --local user.email "anika@example.com"
```
> This overrides Salman's global config ONLY inside this folder when Anika is working.
> Switch back for Salman:
```bash
git config --local user.name  "Kazi Salman Salim"
git config --local user.email "salman@example.com"
```

---

## 2. Branch Strategy

```
main              ← Production-ready code. Merge here at END of each sprint only.
│
└── dev           ← Integration branch. All feature branches merge here first.
    │
    ├── feature/salman-donor-registration       (Sprint 1)
    ├── feature/salman-availability             (Sprint 1)
    ├── feature/salman-notifications            (Sprint 2)
    ├── feature/salman-consent-flow             (Sprint 2)
    ├── feature/salman-verification             (Sprint 3)
    ├── feature/salman-contact-sharing          (Sprint 3)
    ├── feature/salman-admin-dashboard          (Sprint 3)
    │
    ├── feature/anika-donation-history          (Sprint 1)
    ├── feature/anika-request-history           (Sprint 1)
    ├── feature/anika-leaderboard               (Sprint 2)
    ├── feature/anika-reminders                 (Sprint 2)
    ├── feature/anika-feedback                  (Sprint 3)
    ├── feature/anika-faq-management            (Sprint 3)
    │
    ├── feature/athoy-blood-request             (Sprint 1)
    ├── feature/athoy-matching-algorithm        (Sprint 1)
    ├── feature/athoy-map-search                (Sprint 2)
    ├── feature/athoy-status-tracker            (Sprint 2)
    ├── feature/athoy-inventory                 (Sprint 3)
    ├── feature/athoy-analytics                 (Sprint 3)
    └── feature/athoy-broadcast                 (Sprint 3)
```

### Creating a Feature Branch
```bash
git checkout dev
git pull origin dev
git checkout -b feature/salman-donor-registration
```

---

## 3. Daily Workflow

### Morning — Sync with team
```bash
git checkout dev
git pull origin dev
git checkout feature/your-branch-name
git merge dev    # bring in teammates' latest changes
```

### While Working — Commit frequently
```bash
# GOOD commit messages (faculty sees these):
git add .
git commit -m "feat: add donor registration form with multi-step UI"
git commit -m "feat: implement 56-day availability lock in controller"
git commit -m "fix: blood compatibility map missing AB- types"
git commit -m "mvc: move validation from route to donorController"
git commit -m "ui: add urgency color badges to request cards"
git commit -m "test: add edge case for O- universal donor matching"
git commit -m "docs: update SRS with Feature 9 requirements"
```

### Commit Message Format
```
type: short description

Types:
  feat:     New feature or feature enhancement
  fix:      Bug fix
  mvc:      MVC architecture improvement
  ui:       UI/styling changes
  docs:     Documentation
  refactor: Code restructuring (no new feature)
  test:     Adding/updating tests
  chore:    Config, dependencies, cleanup
```

### End of Day — Push your branch
```bash
git push origin feature/your-branch-name
```

---

## 4. Merging Process (Pull Requests)

### When Feature is Complete
1. Push your branch:
   ```bash
   git push origin feature/salman-donor-registration
   ```
2. Go to **GitHub → Pull Requests → New Pull Request**
3. Base: `dev` ← Compare: `feature/salman-donor-registration`
4. Title: `feat: Donor Registration & Profile (Feature 1)`
5. Description: List what was implemented, files changed, MVC mapping
6. **Tag a teammate** as reviewer
7. After approval → **Merge** (use "Squash and Merge" for clean history)
8. Delete the feature branch after merge

### Sprint End — Merge to Main
At the end of each sprint:
```bash
git checkout main
git pull origin main
git merge dev
git push origin main
git tag sprint-1-complete    # tag the sprint
git push origin --tags
```

---

## 5. GitHub Issues (Required for Full Marks)

The rubric says: *"Excellent use of Git: commits, **issues**, branches, and collaboration clearly shown"*

### Create Issues During Development
Each member should create **5–8 issues** across all sprints.

**Go to:** GitHub → Issues → New Issue

### Issue Templates

#### Feature Issue
```
Title: [Feature X] Implement donor availability toggle
Labels: enhancement
Assignee: Salman

## Description
Implement the availability toggle with 56-day cooldown enforcement.

## Tasks
- [ ] Add isAvailable toggle endpoint in donorController
- [ ] Add 56-day check logic
- [ ] Create AvailabilityToggle.jsx component
- [ ] Add countdown display for locked state

## MVC Files
- Model: Donor.js (isAvailable, nextEligibleDate)
- Controller: donorController.toggleAvailability()
- View: AvailabilityToggle.jsx
```

#### Bug Issue
```
Title: [Bug] Leaderboard not filtering by city correctly
Labels: bug
Assignee: Anika

## Description
The leaderboard returns all donors regardless of city filter.

## Steps to Reproduce
1. Go to Leaderboard page
2. Select "Dhaka" in city filter
3. Results show donors from all cities

## Expected Behavior
Only show donors from the selected city.
```

### Required Issues Per Member

| Member | Minimum Issues | Example Titles |
|--------|---------------|----------------|
| **Salman** | 5-8 | "Implement 56-day lock", "Admin suspend user", "Notification bell badge count" |
| **Anika** | 5-8 | "Leaderboard city filter", "CSV export without library", "FAQ accordion state" |
| **Athoy** | 5-8 | "Blood compatibility edge case O-", "Haversine distance NaN fix", "Analytics weekly grouping" |

### Close Issues with Commits
```bash
git commit -m "feat: add city filter to leaderboard, closes #7"
```
This auto-closes Issue #7 on GitHub!

---

## 6. Sprint Submission Checklist

### At the End of Each Sprint
- [ ] All feature branches merged to `dev` via Pull Requests
- [ ] `dev` merged to `main`
- [ ] Sprint tagged: `git tag sprint-X-complete`
- [ ] All issues for this sprint are closed
- [ ] Submit Sprint form (Google Form from faculty)
- [ ] Verify faculty can see repo as collaborator

### Sprint Timeline
| Sprint | Dates | Branch Prefix |
|--------|-------|--------------|
| Sprint 1 | Days 1–12 | `feature/*-sprint1` or feature name |
| Sprint 2 | Days 13–26 | `feature/*-sprint2` or feature name |
| Sprint 3 | Days 27–40 | `feature/*-sprint3` or feature name |
| Sprint 4 | Days 41–56 | `fix/*`, `polish/*` |

---

## 7. Quick Reference Card

```
# Start new feature
git checkout dev && git pull origin dev
git checkout -b feature/your-feature-name

# Save progress
git add . && git commit -m "feat: description"
git push origin feature/your-feature-name

# Merge teammate's work
git checkout dev && git pull origin dev
git checkout feature/your-branch && git merge dev

# End of sprint
git checkout main && git merge dev && git push origin main
git tag sprint-1-complete && git push origin --tags

# Switch user (Anika on Salman's laptop)
git config --local user.name "Miskatul Afrin Anika"
git config --local user.email "anika@example.com"
```
