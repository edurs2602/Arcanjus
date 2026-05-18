# Tasks: Arcanjus Shirt Store Showcase

**Input**: Design documents from `specs/001-shirt-store-showcase/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md

**Tests**: Included (constitution mandates Test-First principle).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize monorepo with backend/ and frontend/ directories and root package.json
- [x] T002 [P] Initialize backend project with pnpm, TypeScript strict config in backend/tsconfig.json
- [x] T003 [P] Initialize frontend Next.js 14 project with App Router in frontend/
- [x] T004 [P] Configure ESLint and Prettier for backend in backend/.eslintrc.js and backend/.prettierrc
- [x] T005 [P] Configure ESLint and Prettier for frontend in frontend/.eslintrc.js and frontend/.prettierrc
- [x] T006 [P] Create backend Dockerfile and docker-compose.yml with PostgreSQL service
- [x] T007 [P] Configure Vitest for backend in backend/vitest.config.ts
- [x] T008 [P] Configure Vitest for frontend unit tests in frontend/vitest.config.ts
- [x] T009 [P] Configure Playwright for e2e tests in frontend/playwright.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T010 Create Prisma schema with all entities (Shirt, ShirtImage, StoreInfo, AdminUser, PageViewEvent, ProductClickEvent) in backend/prisma/schema.prisma
- [x] T011 Generate and run initial Prisma migration in backend/prisma/migrations/
- [x] T012 [P] Create Express app with structured JSON logging middleware in backend/src/app.ts
- [x] T013 [P] Create environment config loader with validation in backend/src/config/env.ts
- [x] T014 [P] Create Prisma client singleton in backend/src/config/database.ts
- [x] T015 [P] Create error handling middleware with structured error responses in backend/src/api/middleware/errorHandler.ts
- [x] T016 [P] Create input validation middleware using zod in backend/src/api/middleware/validate.ts
- [x] T017 [P] Create health check endpoint at GET /health in backend/src/api/routes/health.ts
- [x] T018 Implement JWT auth utilities (sign, verify, refresh) in backend/src/services/authService.ts
- [x] T019 Implement auth middleware for admin routes in backend/src/api/middleware/auth.ts
- [x] T020 [P] Create S3 upload service for shirt images in backend/src/services/storageService.ts
- [x] T021 [P] Create base API client utility in frontend/src/lib/api.ts
- [x] T022 [P] Create Tailwind CSS config with Arcanjus brand tokens in frontend/tailwind.config.ts
- [x] T023 [P] Create base UI layout component (header, nav, footer) in frontend/src/components/ui/Layout.tsx
- [x] T024 Create database seed script with admin user and sample store info in backend/prisma/seed.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse Shirt Catalog (Priority: P1) MVP

**Goal**: Visitors can browse all shirts in a grid, view details, and filter by category/color/size

**Independent Test**: Navigate to catalog, see shirt grid, click a shirt for details, apply filters and see filtered results

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T025 [P] [US1] Contract test for GET /shirts (list, pagination, filters) in backend/tests/contract/shirts.list.test.ts
- [ ] T026 [P] [US1] Contract test for GET /shirts/:id (detail, 404) in backend/tests/contract/shirts.detail.test.ts
- [ ] T027 [P] [US1] Contract test for GET /shirts/filters in backend/tests/contract/shirts.filters.test.ts
- [ ] T028 [P] [US1] Integration test for catalog page rendering in frontend/tests/unit/catalog.test.tsx
- [ ] T029 [P] [US1] E2E test for full catalog browsing flow in frontend/tests/e2e/catalog.spec.ts

### Implementation for User Story 1

- [x] T030 [US1] Implement ShirtService (list, getById, getFilters) with pagination and filtering in backend/src/services/shirtService.ts
- [x] T031 [US1] Create GET /shirts route handler with query param validation in backend/src/api/routes/shirts.ts
- [x] T032 [US1] Create GET /shirts/:id route handler in backend/src/api/routes/shirts.ts
- [x] T033 [US1] Create GET /shirts/filters route handler in backend/src/api/routes/shirts.ts
- [x] T034 [US1] Register shirt routes in Express router in backend/src/api/routes/index.ts
- [x] T035 [P] [US1] Create ShirtCard component (thumbnail, name, price) in frontend/src/components/catalog/ShirtCard.tsx
- [x] T036 [P] [US1] Create ShirtGrid component (responsive grid layout) in frontend/src/components/catalog/ShirtGrid.tsx
- [x] T037 [P] [US1] Create FilterSidebar component (category, color, size selectors) in frontend/src/components/catalog/FilterSidebar.tsx
- [x] T038 [US1] Create catalog page with SSR data fetching in frontend/src/app/(store)/camisas/page.tsx
- [x] T039 [US1] Create shirt detail page with image gallery in frontend/src/app/(store)/camisas/[id]/page.tsx
- [x] T040 [US1] Add progressive image loading with blur placeholder in frontend/src/components/catalog/ShirtImage.tsx
- [x] T041 [US1] Add empty state and no-results messaging to catalog page in frontend/src/components/catalog/EmptyState.tsx

**Checkpoint**: User Story 1 fully functional — visitors can browse, filter, and view shirt details

---

## Phase 4: User Story 2 - View Store Information (Priority: P2)

**Goal**: Visitors can see store address, hours, map, and brand story

**Independent Test**: Navigate to store info page, verify address/hours display, map renders with marker, about page shows brand content

### Tests for User Story 2

- [ ] T042 [P] [US2] Contract test for GET /store-info in backend/tests/contract/storeInfo.test.ts
- [ ] T043 [P] [US2] Integration test for store info page rendering in frontend/tests/unit/storeInfo.test.tsx
- [ ] T044 [P] [US2] E2E test for store info and about page flow in frontend/tests/e2e/storeInfo.spec.ts

### Implementation for User Story 2

- [x] T045 [US2] Implement StoreInfoService (get, update) in backend/src/services/storeInfoService.ts
- [x] T046 [US2] Create GET /store-info route handler in backend/src/api/routes/storeInfo.ts
- [x] T047 [US2] Register store info routes in Express router in backend/src/api/routes/index.ts
- [x] T048 [P] [US2] Create MapView component with Leaflet and OpenStreetMap in frontend/src/components/store/MapView.tsx
- [x] T049 [P] [US2] Create StoreHours component (formatted hours display) in frontend/src/components/store/StoreHours.tsx
- [x] T050 [P] [US2] Create StoreContact component (address, phone) in frontend/src/components/store/StoreContact.tsx
- [x] T051 [US2] Create store location page with map and info in frontend/src/app/(store)/localizacao/page.tsx
- [x] T052 [US2] Create about page with brand story content in frontend/src/app/(store)/sobre/page.tsx
- [ ] T053 [US2] Add map fallback (static address + external link) when map unavailable in frontend/src/components/store/MapFallback.tsx

**Checkpoint**: User Story 2 fully functional — visitors can find store location, hours, and brand story

---

## Phase 5: User Story 3 - Mobile-Friendly Browsing (Priority: P3)

**Goal**: All pages adapt seamlessly to mobile/tablet screens with touch-friendly navigation

**Independent Test**: Access all pages on 375px, 768px, and 1024px viewports — layout adapts, navigation is touch-friendly, images are swipeable

### Tests for User Story 3

- [ ] T054 [P] [US3] E2E test for responsive layout at mobile viewport (375px) in frontend/tests/e2e/responsive.mobile.spec.ts
- [ ] T055 [P] [US3] E2E test for responsive layout at tablet viewport (768px) in frontend/tests/e2e/responsive.tablet.spec.ts

### Implementation for User Story 3

- [x] T056 [P] [US3] Create MobileNav component (hamburger menu, slide-out drawer) in frontend/src/components/ui/MobileNav.tsx
- [x] T057 [P] [US3] Create ImageSwiper component (touch swipe for product images) in frontend/src/components/catalog/ImageSwiper.tsx
- [ ] T058 [US3] Update Layout component with responsive breakpoints and mobile nav toggle in frontend/src/components/ui/Layout.tsx
- [ ] T059 [US3] Update ShirtGrid for single-column mobile layout in frontend/src/components/catalog/ShirtGrid.tsx
- [ ] T060 [US3] Update FilterSidebar as collapsible bottom sheet on mobile in frontend/src/components/catalog/FilterSidebar.tsx
- [ ] T061 [US3] Update shirt detail page to use ImageSwiper on mobile in frontend/src/app/(store)/camisas/[id]/page.tsx

**Checkpoint**: All pages responsive — site works fully on mobile, tablet, and desktop

---

## Phase 6: Admin Panel - Content Management (Priority: P1-Admin)

**Goal**: Brand owner can log in, manage shirts and store info, and view analytics

**Independent Test**: Log in to admin, create/edit/delete a shirt, update store info, view analytics dashboard

### Tests for Admin Panel

- [ ] T062 [P] [US-Admin] Contract test for POST /admin/auth/login and /refresh in backend/tests/contract/admin.auth.test.ts
- [ ] T063 [P] [US-Admin] Contract test for admin CRUD /admin/shirts in backend/tests/contract/admin.shirts.test.ts
- [ ] T064 [P] [US-Admin] Contract test for PUT /admin/store-info in backend/tests/contract/admin.storeInfo.test.ts
- [ ] T065 [P] [US-Admin] Contract test for GET /admin/analytics/overview and /shirts/:id in backend/tests/contract/admin.analytics.test.ts
- [ ] T066 [P] [US-Admin] E2E test for admin login and shirt management flow in frontend/tests/e2e/admin.spec.ts

### Implementation for Admin Panel

- [x] T067 [US-Admin] Create POST /admin/auth/login route handler in backend/src/api/routes/admin/auth.ts
- [x] T068 [US-Admin] Create POST /admin/auth/refresh route handler in backend/src/api/routes/admin/auth.ts
- [x] T069 [US-Admin] Implement AdminShirtService (create, update, delete, list with inactive) in backend/src/services/adminShirtService.ts
- [x] T070 [US-Admin] Create admin shirt CRUD routes (GET, POST, PUT, DELETE /admin/shirts) in backend/src/api/routes/admin/shirts.ts
- [x] T071 [US-Admin] Create PUT /admin/store-info route handler in backend/src/api/routes/admin/storeInfo.ts
- [x] T072 [US-Admin] Implement AnalyticsService (overview, per-shirt stats, device breakdown) in backend/src/services/analyticsService.ts
- [x] T073 [US-Admin] Create GET /admin/analytics/overview route handler in backend/src/api/routes/admin/analytics.ts
- [x] T074 [US-Admin] Create GET /admin/analytics/shirts/:id route handler in backend/src/api/routes/admin/analytics.ts
- [x] T075 [US-Admin] Register all admin routes with auth middleware in backend/src/api/routes/admin/index.ts
- [x] T076 [P] [US-Admin] Create admin login page with form in frontend/src/app/admin/login/page.tsx
- [x] T077 [P] [US-Admin] Create admin auth context and token management in frontend/src/lib/adminAuth.tsx
- [x] T078 [P] [US-Admin] Create admin layout with sidebar navigation in frontend/src/app/admin/layout.tsx
- [x] T079 [US-Admin] Create admin dashboard page with analytics overview in frontend/src/app/admin/page.tsx
- [x] T080 [US-Admin] Create shirt list page with table and actions in frontend/src/app/admin/camisas/page.tsx
- [x] T081 [US-Admin] Create shirt create/edit form with image upload in frontend/src/app/admin/camisas/[id]/page.tsx
- [x] T082 [US-Admin] Create store info edit page in frontend/src/app/admin/loja/page.tsx
- [x] T083 [US-Admin] Create analytics detail page with charts per shirt in frontend/src/app/admin/analytics/page.tsx

**Checkpoint**: Admin panel fully functional — brand owner can manage all content and view analytics

---

## Phase 7: Analytics Tracking & Event Collection

**Purpose**: Wire up visitor event tracking on the public site

- [ ] T084 [P] Contract test for POST /analytics/event in backend/tests/contract/analytics.event.test.ts
- [x] T085 Implement EventTrackingService (record page views, product clicks) in backend/src/services/eventTrackingService.ts
- [x] T086 Create POST /analytics/event route handler in backend/src/api/routes/analytics.ts
- [x] T087 Register analytics route in Express router in backend/src/api/routes/index.ts
- [x] T088 Create useAnalytics hook for automatic page view tracking in frontend/src/lib/useAnalytics.ts
- [ ] T089 Add product click tracking to ShirtCard and detail page in frontend/src/components/catalog/ShirtCard.tsx
- [x] T090 Implement analytics data retention cron job (purge > 12 months) in backend/src/services/retentionService.ts

**Checkpoint**: Analytics flowing — admin dashboard shows real visitor data

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T091 [P] Add SEO metadata (title, description, OG tags) to all public pages in frontend/src/app/(store)/layout.tsx
- [ ] T092 [P] Create branded placeholder image for shirts without images in frontend/public/placeholder-shirt.png
- [ ] T093 [P] Add loading skeletons for catalog and detail pages in frontend/src/components/ui/Skeleton.tsx
- [ ] T094 [P] Add error boundary and 404 page in frontend/src/app/not-found.tsx
- [x] T095 Create homepage with hero, featured shirts, and nav to catalog in frontend/src/app/(store)/page.tsx
- [ ] T096 [P] Add favicon and brand assets in frontend/public/
- [ ] T097 Run full Playwright e2e suite and fix any failures
- [ ] T098 Run quickstart.md verification checklist end-to-end
- [ ] T099 Security audit: validate all inputs, check for XSS/CSRF, verify secrets handling
- [ ] T100 Performance audit: verify < 3s load on throttled 3G, check image optimization

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion, independent of US1
- **User Story 3 (Phase 5)**: Depends on US1 and US2 (responsive adjustments to existing components)
- **Admin Panel (Phase 6)**: Depends on Foundational phase completion, independent of US1/US2
- **Analytics Tracking (Phase 7)**: Depends on Admin Panel (Phase 6) for dashboard display
- **Polish (Phase 8)**: Depends on all prior phases

### Parallel Opportunities

- Phase 1: T002-T009 all parallelizable
- Phase 2: T012-T017, T020-T023 parallelizable
- Phase 3: T025-T029 (tests) parallelizable; T035-T037 (components) parallelizable
- Phase 4: T042-T044 (tests) parallelizable; T048-T050 (components) parallelizable
- Phase 5: T054-T055 (tests) parallelizable; T056-T057 (components) parallelizable
- Phase 6: T062-T066 (tests) parallelizable; T076-T078 (frontend) parallelizable
- After Foundational: Phases 3, 4, and 6 can proceed in parallel

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models/services before route handlers
- Backend before frontend (API must exist for frontend to consume)
- Core implementation before integration/polish

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (catalog browsing)
4. **STOP and VALIDATE**: Test catalog independently
5. Deploy/demo if ready — visitors can browse shirts

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Catalog live (MVP!)
3. Add User Story 2 → Store info + map live
4. Add Admin Panel → Brand owner can manage content
5. Add User Story 3 → Mobile experience polished
6. Add Analytics → Data flowing to admin dashboard
7. Polish → Production-ready

### Parallel Team Strategy

With multiple developers after Foundational is done:
- Developer A: User Story 1 (catalog)
- Developer B: User Story 2 (store info)
- Developer C: Admin Panel (Phase 6)
- Then converge on US3 (responsive) and Polish
