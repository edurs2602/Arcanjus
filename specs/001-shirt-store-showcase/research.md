# Research: Arcanjus Shirt Store Showcase

**Date**: 2026-05-16 | **Branch**: `001-shirt-store-showcase`

## Frontend Framework

- **Decision**: Next.js 14 with App Router
- **Rationale**: SSR provides SEO benefits critical for a brand showcase site (Google indexing of product pages). App Router offers server components for performance and streaming for progressive loading. Built-in image optimization handles the image-heavy catalog.
- **Alternatives considered**:
  - Vite + React SPA: Faster dev but poor SEO without additional SSR setup
  - Astro: Great for static content but less suited for admin panel SPA and dynamic filtering
  - Remix: Viable but smaller ecosystem, less community tooling for e-commerce patterns

## Backend Framework

- **Decision**: Express.js with TypeScript
- **Rationale**: Lightweight, well-understood, aligns with Simplicity principle. Sufficient for the scale (< 10k monthly visitors). Easy to add middleware for auth, logging, validation.
- **Alternatives considered**:
  - Fastify: Slightly faster but smaller ecosystem; unnecessary for this scale
  - Next.js API routes only: Would work for simple CRUD but analytics ingestion and scheduled jobs (data purge) benefit from a dedicated server
  - NestJS: Over-engineered for this scope; violates Simplicity principle

## Database

- **Decision**: PostgreSQL 16 with Prisma ORM
- **Rationale**: Relational data model fits well (shirts, categories, admin users, analytics events). Prisma provides type-safe queries aligned with TypeScript strict mode. JSON column support for flexible shirt attributes. Built-in support for scheduled deletion (analytics retention).
- **Alternatives considered**:
  - SQLite: Too limited for concurrent admin writes + analytics ingestion
  - MongoDB: Schema flexibility unnecessary; relational joins needed for analytics reports
  - Supabase: Adds vendor dependency; raw PostgreSQL keeps architecture simple and portable

## Map Service

- **Decision**: Leaflet with OpenStreetMap tiles
- **Rationale**: Free, no API key required for basic usage, no vendor lock-in. Lightweight library. Sufficient for showing a single store pin on a map.
- **Alternatives considered**:
  - Google Maps: Requires API key, billing account, and has usage costs
  - Mapbox: Better styling but adds cost and complexity for a single marker use case

## Image Handling

- **Decision**: Next.js Image component + cloud storage (S3-compatible)
- **Rationale**: Next.js Image provides automatic resizing, format conversion (WebP/AVIF), lazy loading, and blur placeholders — directly addressing FR-008 (progressive loading). S3-compatible storage (AWS S3, Cloudflare R2, or MinIO for self-hosted) keeps images separate from the application server.
- **Alternatives considered**:
  - Cloudinary: Excellent but adds cost and vendor dependency
  - Local filesystem: Not scalable, complicates deployment
  - Imgix: Good but unnecessary CDN costs for < 200 products

## Analytics Approach

- **Decision**: Custom event tracking stored in PostgreSQL
- **Rationale**: Simple page view and click events don't justify a third-party analytics service. Storing in PostgreSQL allows custom admin reports exactly matching requirements (most viewed, most clicked). 12-month retention with scheduled cleanup keeps data manageable.
- **Alternatives considered**:
  - Google Analytics: Privacy concerns, cookie banners required, limited custom reporting in admin panel
  - Plausible/Umami: Good privacy-first options but add external dependency; custom storage gives full control
  - Mixpanel: Overkill for simple view/click tracking

## Authentication (Admin)

- **Decision**: Custom JWT-based auth with bcrypt password hashing
- **Rationale**: Only 1-3 admin users with pre-created accounts. JWT keeps it stateless. Simple login form + token refresh. No need for complex OAuth flows or session stores.
- **Alternatives considered**:
  - next-auth: Heavier than needed for a simple email/password setup with no social login
  - Passport.js: Adds unnecessary abstraction for a single auth strategy
  - Session-based: Would require session store; JWT is simpler for this scale

## Styling

- **Decision**: Tailwind CSS
- **Rationale**: Utility-first approach enables rapid responsive design (critical for mobile-first requirement). No runtime overhead. Works seamlessly with Next.js. Easy to implement brand color tokens.
- **Alternatives considered**:
  - CSS Modules: More verbose for responsive patterns
  - styled-components: Runtime cost, less ideal with server components
  - Plain CSS: Slower development for responsive layouts
