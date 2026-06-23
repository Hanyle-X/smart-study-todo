# Smart Study Todo MVP Design

## Goal

Build a local-only intelligent study planning Todo web app for exam and learning users. The product is goal-driven, state-aware, and dynamically adjusts daily workload without punitive language.

## Scope

The MVP includes Dashboard, Goals, Today, Review, History, and Settings pages. Users can create goals, add modules, record daily status, generate a daily plan, mark task outcomes, submit daily review, and view recent history. Data persists in `localStorage`; no login, backend, AI API, Apple Health, social features, complex charts, pomodoro, streaks, points, or rankings.

## Architecture

Use Next.js App Router with TypeScript and Tailwind CSS. Keep model types in `src/lib/types.ts`, local persistence in `src/lib/storage.ts`, planning rules in `src/lib/planner.ts`, and a React state/provider layer in `src/lib/app-store.tsx`. Pages compose focused feature components and shared shadcn-style UI primitives.

## Visual System

The interface follows Apple Human Interface cues: `#F5F5F7` background, `#007AFF` accent, `#1D1D1F` primary text, `#6E6E73` secondary text, large whitespace, translucent white widget cards, soft shadows, calm green success, and gentle orange attention states. Desktop uses a translucent sidebar and header. Mobile uses a bottom tab bar. Copy remains low-pressure and encouraging.

## Planner Rules

`generateDailyPlan(goal, modules, dailyStatus, recentReviews)` computes total task minutes from available hours, energy, stress, and recent completion rates. Completion above 80% raises workload modestly, 50%-80% maintains it, below 50% reduces it by 20%, and two consecutive days below 50% enters recovery mode with only high-priority core tasks. High-priority modules receive more time; stress and low energy reduce difficulty and intensity.

## Verification

Planner behavior is covered by unit tests. The final app must pass type/build checks and be manually verified in the browser for navigation, localStorage flows, task status updates, review creation, and responsive layout.
