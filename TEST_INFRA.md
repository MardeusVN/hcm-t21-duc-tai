# E2E Test Infra: HCM-T21 "Đức hay Tài"

## Test Philosophy
- Opaque-box and requirement-driven test verification.
- Zero tolerance for logic divergence from original academic specifications.
- 100% path mathematical simulation (3^6 = 729 branches).

## Feature Inventory Coverage Matrix
| # | Feature | Unit Test | Integration Test | E2E Browser Test |
|---|---------|:---------:|:----------------:|:----------------:|
| F01 | Opening Screen & Initial Stance | ✓ | ✓ | ✓ |
| F02 | 6 Scenario Gameplay Engine | ✓ | ✓ | ✓ |
| F03 | Cumulative Delta Scoring ([-11..12], [-7..9]) | ✓ (729 paths) | ✓ | ✓ |
| F04 | Choice Feedback & Citations | ✓ | ✓ | ✓ |
| F05 | 2-Axis Interactive Coordinate Chart | ✓ (Math/SVG) | ✓ | ✓ |
| F06 | 4-Quadrant Boolean Classification | ✓ (All 729 paths) | ✓ | ✓ |
| F07 | Theoretical Framework Modals (5 triggers) | ✓ | ✓ | ✓ |
| F08 | 10-Question Academic Quiz Engine | ✓ (All 10 questions) | ✓ | ✓ |
| F09 | AI Declaration & Academic Scope | ✓ | ✓ | ✓ |
| F10 | Visual Assets Integration (14 images) | ✓ (DOM & Load) | ✓ | ✓ |
| F11 | Academic Luxury UI & Design Tokens | ✓ | ✓ | ✓ |
| F12 | Responsive Layout & Accessibility (WCAG AA) | ✓ | ✓ | ✓ |

## Test Suites Layout
1. `tests/unit_game_engine.test.js`: Validates all 6 scenarios, option delta scoring, cumulative score range, and 729-path quadrant distribution.
2. `tests/unit_chart_math.test.js`: Validates coordinate transformation, SVG mapping, boundary clamping, and threshold division.
3. `tests/unit_quiz_engine.test.js`: Validates 10 quiz questions, correct answer indexes, feedback generation, and summary statistics.
4. `tests/test_runner.html`: Standalone browser-based test runner that executes all unit and integration tests and outputs clear DOM test results with zero external dependencies.
