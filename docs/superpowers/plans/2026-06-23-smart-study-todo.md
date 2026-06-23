# Smart Study Todo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js MVP for an Apple-style intelligent study Todo app with localStorage persistence and dynamic planning.

**Architecture:** The app uses client-side state over `localStorage`, a pure planner function, shared types, reusable UI primitives, and focused route pages. The planner and storage helpers are testable without React.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, shadcn-style components, lucide-react, Vitest, localStorage.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `next.config.mjs`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `components.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`

- [ ] Add Next.js, TypeScript, Tailwind, lucide-react, clsx, tailwind-merge, class-variance-authority, and Vitest scripts.
- [ ] Configure Tailwind content paths and Apple-inspired theme tokens.
- [ ] Create the root layout and global CSS.

### Task 2: Core Domain and Tests

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/planner.ts`
- Create: `src/lib/storage.ts`
- Create: `src/lib/planner.test.ts`
- Create: `src/lib/storage.test.ts`

- [ ] Write failing planner tests for high completion growth, low completion reduction, recovery mode, priority allocation, and stress/energy adjustments.
- [ ] Write failing storage tests for safe default load and persisted save/load.
- [ ] Implement the minimum types, planner, and storage helpers to pass.

### Task 3: App State and Layout

**Files:**
- Create: `src/lib/app-store.tsx`
- Create: `src/components/layout/AppSidebar.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/MobileNav.tsx`
- Create: `src/components/layout/AppShell.tsx`

- [ ] Add a client store that loads from localStorage, seeds example data when empty, and exposes goal/module/status/task/review actions.
- [ ] Implement desktop sidebar, top header, mobile tab bar, and responsive app shell.

### Task 4: UI Primitives and Feature Components

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/textarea.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/progress.tsx`
- Create: `src/components/ui/tabs.tsx`
- Create: `src/components/dashboard/TodayOverviewCard.tsx`
- Create: `src/components/dashboard/GoalProgressCard.tsx`
- Create: `src/components/tasks/TaskList.tsx`
- Create: `src/components/tasks/TaskCard.tsx`
- Create: `src/components/goals/GoalForm.tsx`
- Create: `src/components/goals/ModuleForm.tsx`

- [ ] Add shadcn-style local primitives with shared variants.
- [ ] Add reusable dashboard, task, and form components.

### Task 5: Route Pages

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/goals/page.tsx`
- Create: `src/app/goals/[goalId]/page.tsx`
- Create: `src/app/today/page.tsx`
- Create: `src/app/review/page.tsx`
- Create: `src/app/history/page.tsx`
- Create: `src/app/settings/page.tsx`

- [ ] Implement all requested pages with real local interactions.
- [ ] Keep copy calm and non-punitive.
- [ ] Ensure mobile layout has stable dimensions and no text overflow.

### Task 6: Verification

- [ ] Run `npm test` and confirm all unit tests pass.
- [ ] Run `npm run lint` and `npm run build`.
- [ ] Start the dev server, inspect desktop and mobile browser views, and verify the main workflow.
