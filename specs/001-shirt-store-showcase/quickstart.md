# Quickstart: Arcanjus Shirt Store Showcase

**Branch**: `001-shirt-store-showcase`

## Prerequisites

- Node.js 20+ (LTS)
- PostgreSQL 16+
- pnpm 9+ (package manager)

## Setup

```bash
# Clone and checkout feature branch
git clone <repo-url>
cd arcanjus
git checkout 001-shirt-store-showcase

# Install dependencies
cd backend && pnpm install
cd ../frontend && pnpm install
```

## Environment Configuration

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/arcanjus
JWT_SECRET=<generate-a-secure-random-string>
S3_BUCKET=arcanjus-images
S3_REGION=sa-east-1
S3_ACCESS_KEY=<your-key>
S3_SECRET_KEY=<your-secret>
PORT=3001
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Database Setup

```bash
cd backend

# Create database
createdb arcanjus

# Run migrations
pnpm prisma migrate dev

# Seed initial admin user and store info
pnpm prisma db seed
```

## Running

```bash
# Terminal 1: Backend
cd backend
pnpm dev          # Starts on http://localhost:3001

# Terminal 2: Frontend
cd frontend
pnpm dev          # Starts on http://localhost:3000
```

## Default Admin Access

After seeding:
- **URL**: http://localhost:3000/admin
- **Email**: admin@arcanjus.com
- **Password**: (set during seed, check `backend/prisma/seed.ts`)

## Running Tests

```bash
# Backend unit + integration
cd backend && pnpm test

# Frontend unit
cd frontend && pnpm test

# E2E (requires both servers running)
cd frontend && pnpm test:e2e
```

## Verification Checklist

1. [ ] Homepage loads and displays navigation
2. [ ] Catalog page shows shirts in grid layout
3. [ ] Clicking a shirt opens detail page with images
4. [ ] Filters work (color, size, category)
5. [ ] Store info page shows address and map
6. [ ] About page shows brand story
7. [ ] Admin login works with seeded credentials
8. [ ] Admin can create/edit/delete shirts
9. [ ] Admin analytics dashboard shows data
10. [ ] Site is responsive on mobile viewport (375px)
