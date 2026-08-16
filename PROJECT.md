# PROJECT PLAN: HCM-T21 "Đức hay Tài" Modernization

## 1. Overview & Architecture
An interactive academic web application exploring Ho Chi Minh's philosophy on "Đức" (Virtue/Morality) and "Tài" (Talent/Competence).
Modernized into an **Academic Luxury / Modern Editorial** web application with 100% gameplay logic preservation, complete Digital Editorial Art illustrations, modular clean architecture, and rigorous multi-tier test automation.

```
                  ┌──────────────────────────────────────────────┐
                  │                 index.html                   │
                  │  (Semantic HTML5, Accessible ARIA, Preload)  │
                  └──────────────────────┬───────────────────────┘
                                         │
     ┌───────────────────────────────────┼───────────────────────────────────┐
     ▼                                   ▼                                   ▼
┌──────────────────┐           ┌──────────────────┐                ┌──────────────────┐
│   css/styles.css │           │  js/data/*.js    │                │  js/engine/*.js  │
│  - tokens.css    │           │  - scenarios.js  │                │  - gameState.js  │
│  - components.css│           │  - quiz.js       │                │  - quizEngine.js │
│  - main.css      │           │  - theory.js     │                │  - chartMath.js  │
└──────────────────┘           └─────────┬────────┘                └─────────┬────────┘
                                         │                                   │
                                         └─────────────────┬─────────────────┘
                                                           ▼
                                               ┌───────────────────────┐
                                               │      js/ui/*.js       │
                                               │ - screenController.js │
                                               │ - chartRenderer.js    │
                                               │ - modalController.js  │
                                               │ - quizRenderer.js     │
                                               └───────────────────────┘
```

## 2. Feature Inventory
Every feature identified during the survey phase with its milestone assignment:

| # | Feature | Description | Milestone | Status |
|---|---------|-------------|-----------|--------|
| F01 | Opening Screen & Initial Vote | Survey user's initial stance on Đức vs Tài with interactive choices | M2: Core Engine & UI | DONE |
| F02 | 6 Scenario Gameplay Engine | 3-Layer progression (Student, Career, Leadership), 2 scenarios each, 3 choices per scenario | M2: Core Engine & UI | DONE |
| F03 | Real-time Delta Scoring | Cumulative tracking of Đức and Tài score deltas ([-11..12], [-7..9]) | M2: Core Engine & UI | DONE |
| F04 | Choice Feedback & Citations | Contextual feedback, Ho Chi Minh quotes, and textbook page citations (tr. 136, 141, 142, 144, 146, 147, 157) | M2: Core Engine & UI | DONE |
| F05 | 2-Axis Interactive Coordinate Chart | Dynamic SVG chart plotting (Tài, Đức) with animated marker and quadrant highlighting | M2, M3 | DONE |
| F06 | 4 Quadrant Classification | Exact boolean classification (Vừa hồng vừa chuyên, Đáng tin nhưng bất lực, Nguy hiểm nhất, Vô hại vì vô dụng) | M2: Core Engine & UI | DONE |
| F07 | Theoretical Framework Modals | Dynamic modal rendering for Đức, Tài, 3 Layer contexts, and Conclusion | M2: Core Engine & UI | DONE |
| F08 | 10-Question Academic Quiz Engine | Multiple-choice quiz, immediate answer feedback, scoring, retry, and explanation display | M2: Core Engine & UI | DONE |
| F09 | AI Declaration & Academic Scope | AI assistance disclosure, pedagogical scope notes, and real-world case studies | M2: Core Engine & UI | DONE |
| F10 | Visual Assets Production | 14 Digital Editorial Art assets (1 Hero, 3 Layers, 6 Scenarios, 4 Quadrants) | M1: Visual Assets | DONE |
| F11 | Academic Luxury Design System | Typography (Playfair Display + Plus Jakarta Sans), Imperial Gold / Royal Sapphire palette, Glassmorphism, Micro-interactions | M3: UI/UX Redesign | DONE |
| F12 | Responsive & Accessible Layout | WCAG AA contrast (>=4.5:1), touch targets (>=44px), smooth 60fps transitions | M3: UI/UX Redesign | DONE |
| F13 | E2E & Unit Test Automation Suite | Unit test runner (729 simulation paths, chart math, scoring engine) & E2E browser tests | M4: Testing & Verification | DONE |

## 3. Milestones & Final Status

| # | Milestone Name | Scope | Dependencies | Status |
|---|----------------|-------|--------------|--------|
| M1 | Visual Assets Generation | 14 bespoke Digital Editorial Art illustrations in `assets/images/` | None | DONE |
| M2 | Clean Architecture & Core Engine | Modularized codebase: Data Store (`js/data/`), Game Engine (`js/engine/`), UI (`js/ui/`) | None | DONE |
| M3 | UI/UX Redesign & Asset Integration | Academic Luxury design tokens, responsive typography, glassmorphism, 2-axis chart, 14 assets wired | M1, M2 | DONE |
| M4 | E2E Testing Suite & Multi-Tier Verification | Automated test suites in `tests/`, 729 simulation paths, standalone test runner | M2 | DONE |
| M5 | Multi-Agent Review, Adversarial Challenge & Forensic Audit | 2 Reviewers (APPROVE), 2 Challengers (APPROVE), 1 Forensic Auditor (CLEAN) | M1, M2, M3, M4 | DONE |

## 4. Verification Gate Summary
- **Reviewer 1 (Architecture & Logic)**: `APPROVE` (162/162 checks passed, 100% logic preserved)
- **Reviewer 2 (UI/UX & Accessibility)**: `APPROVE` (WCAG AA compliant, touch targets >=44px, 60fps transitions)
- **Challenger 1 (Math Simulation & Fuzzing)**: `APPROVE` (4,587 assertions passed across all 729 paths)
- **Challenger 2 (State & Edge Case Stress)**: `APPROVE` (59 adversarial tests passed, focus traps & retry verified)
- **Forensic Auditor (Integrity Forensics)**: `CLEAN` (0 cheating patterns, 0 placeholders, authentic calculations)
