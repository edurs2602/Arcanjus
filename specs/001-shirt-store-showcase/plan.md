# Implementation Plan: Arcanjus Shirt Store Showcase

**Branch**: `001-shirt-store-showcase` | **Date**: 2026-05-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-shirt-store-showcase/spec.md`

## Summary

Build a responsive web application for the Arcanjus shirt brand that showcases their product catalog with filtering, displays store information with an interactive map, and provides an admin panel for content management and visitor analytics. The architecture follows a web application pattern with a Next.js frontend (SSR for SEO and performance), a Node.js/Express backend API, and PostgreSQL for persistence.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)

**Primary Dependencies**: Next.js 14 (frontend + SSR), Express.js (backend API), Prisma (ORM), next-auth or custom JWT (admin auth), Leaflet (maps)

**Storage**: PostgreSQL 16 (shirts, store info, admin users, analytics events)

**Testing**: Vitest (unit + integration), Playwright (e2e)

**Target Platform**: Web (modern browsers, mobile-first responsive)

**Project Type**: Web application (frontend + backend API + admin panel)

**Performance Goals**: < 3s page load on 3G mobile, < 500ms API response time, progressive image loading

**Constraints**: Portuguese (Brazil) only, < 200 shirts at launch, single physical store, 12-month analytics retention

**Scale/Scope**: Small-scale brand site, estimated < 10k monthly visitors initially, 1-3 admin users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First | ✅ PASS | Tests defined for each user story; Vitest + Playwright planned |
| II. Simplicity | ✅ PASS | Minimal stack (Next.js + Express + PostgreSQL), no over-engineering |
| III. Observability | ✅ PASS | Structured JSON logging, health endpoints, analytics built-in |
| IV. Security | ✅ PASS | Auth on admin panel, input validation, no secrets in code, OWASP addressed |
| V. Clean Architecture | ✅ PASS | Business logic in services layer, separated from delivery (API routes, UI components) |

All gates pass. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-shirt-store-showcase/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/          # Prisma schema + domain types
│   ├── services/        # Business logic (catalog, analytics, auth)
│   ├── api/
│   │   ├── routes/      # Express route handlers
│   │   └── middleware/  # Auth, validation, logging, error handling
│   └── config/          # Environment, database config
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # SQL migrations
└── tests/
    ├── unit/
    └── integration/

frontend/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── (store)/     # Public store pages (catalog, about, location)
│   │   └── admin/       # Admin panel pages (protected)
│   ├── components/      # Reusable UI components
│   │   ├── catalog/     # Shirt grid, filters, product card
│   │   ├── store/       # Map, store info, about
│   │   ├── admin/       # Admin dashboard, forms, charts
│   │   └── ui/          # Base UI components (buttons, inputs, layout)
│   ├── lib/             # Utilities, API client, hooks
│   └── styles/          # Global styles, theme
└── tests/
    ├── unit/
    └── e2e/             # Playwright tests
```

**Structure Decision**: Web application structure (Option 2) — frontend with Next.js App Router handles SSR for public pages and admin SPA; backend provides REST API for data operations and analytics collection.

## Complexity Tracking

> No violations. All choices align with constitution principles.
