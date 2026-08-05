# Mission365

A personal Life OS dashboard — a 365-day discipline and productivity command center. Track daily rituals, XP/leveling, expenses, fitness, study subjects, mission goals, achievements, and performance statistics. All data stored in LocalStorage, no backend required.

## Run & Operate

- `pnpm --filter @workspace/mission365 run dev` — run the web app (port assigned by artifact config)
- `pnpm --filter @workspace/mission365 run typecheck` — typecheck the frontend
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React + Vite + Tailwind CSS (dark-first, Inter font)
- wouter for routing
- framer-motion for animations
- recharts for charts
- shadcn UI components
- LocalStorage for all persistence (no database used)

## Where things live

```
artifacts/mission365/src/
  lib/
    types.ts        — all shared TypeScript types + LocalStorage keys (KEYS enum)
    constants.ts    — default/seed data, XP thresholds, task definitions
    utils.ts        — formatCurrency (₹), getDayOfMission, calculateLevel, getStreak
    storage.ts      — typed localStorage helpers: get<T>, set<T>, remove
  hooks/
    useLocalStorage.ts   — generic hook (syncs across tabs via storage events)
    useProfile.ts        — user name + current goal + mission start date
    useXP.ts             — total XP + derived level info
    useDailyMission.ts   — per-day task state (key: mission365_tasks_YYYY-MM-DD)
    useExpenses.ts       — monthly budget + categories
    useFitness.ts        — weight logs, workouts, body measurements
    useStudy.ts          — subjects + study logs
    useGoals.ts          — mission progress sliders
    useAchievements.ts   — disciplined days + streak badges
    useStatistics.ts     — derived stats from other hooks
  pages/
    Dashboard, DailyMission, AICoach, Expenses, Fitness, Study, Goals, Achievements, Statistics, Settings
  components/
    layout/AppShell.tsx + Sidebar.tsx
    shared/StatCard, ProgressBar, PageHeader, SectionTitle, EmptyState
```

## Architecture decisions

- All data is LocalStorage-only — no backend, no database. The `useLocalStorage` hook uses `storage` events so state syncs instantly across pages.
- Per-day task key (`mission365_tasks_YYYY-MM-DD`) resets tasks each day without losing history. History is stored separately in `mission365_history`.
- Seed data is written once on first load using a `mission365_initialized` flag.
- Level system uses triangular number formula: Level N threshold = N*(N-1)/2 * 100 XP.
- `canvas-confetti` is installed as a runtime dependency for the Daily Mission "Mission Complete" celebration.

## Product

- **Dashboard** — hero with day/greeting, 4 stat cards, money widget, XP/level, mission progress
- **Daily Mission** — 4 section task checklist (morning/college/study/evening), XP per task, "Complete All" button, mission-complete confetti
- **AI Coach** — premium placeholder, ready for AI integration
- **Expenses** — monthly budget tracker with donut + bar charts
- **Fitness** — weight tracker line chart, workout log, body measurements
- **Study** — subject progress cards with actual vs target bars
- **Mission Goals** — draggable sliders for each mission's actual vs planned progress
- **Achievements** — tier cards (Bronze/Silver/Gold/Diamond) + streak badges
- **Statistics** — 30-day completion area chart, weekly bars, study/workout charts
- **Settings** — profile, appearance toggle, JSON export, data reset

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always add `canvas-confetti` and `@types/canvas-confetti` to `artifacts/mission365/package.json` if reinstalling from scratch.
- The `sheet.tsx` component required `SheetHeader`, `SheetTitle`, `SheetDescription` to be added manually — the scaffold didn't include them but the shadcn sidebar.tsx imports them.
- The `progress.tsx` component must use `import * as ProgressPrimitive from "@radix-ui/react-progress"` (namespace import), not `import { Progress as ProgressPrimitive }`.
- Run `pnpm --filter @workspace/mission365 run typecheck` before shipping any changes.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `react-vite` skill for frontend conventions
