# CLAUDE.md - AI Assistant Guide for Blind75 Master

This document provides essential context for AI assistants working with the Blind75 Master codebase.

## Project Overview

Blind75 Master is a full-stack Next.js 14 application for practicing the Blind 75 LeetCode problems. It features an interactive code editor, test runner, algorithm visualizations, progress tracking, and premium subscriptions via Stripe.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14.2.35 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4.1 |
| UI Components | shadcn/ui + Radix UI |
| Code Editor | Monaco Editor 4.7.0 |
| State Management | Zustand 5.0.10 (with persistence) |
| Database | PostgreSQL 15 + Prisma 6.19.2 |
| Authentication | NextAuth.js 4.24.13 (JWT strategy) |
| Payments | Stripe 20.2.0 |

## Project Structure

```
blind75-master/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, signup) - public
│   ├── (dashboard)/              # Protected pages (problems, progress, pricing)
│   │   ├── problems/[slug]/      # Problem detail pages with SSR
│   │   ├── progress/             # User stats dashboard
│   │   └── pricing/              # Subscription plans
│   ├── api/                      # API Routes
│   │   ├── auth/                 # NextAuth + registration
│   │   ├── problems/             # Problem CRUD endpoints
│   │   └── stripe/               # Checkout + webhooks
│   ├── layout.tsx                # Root layout with metadata
│   ├── providers.tsx             # SessionProvider wrapper
│   └── page.tsx                  # Landing page
│
├── components/
│   ├── ui/                       # shadcn/ui components (button, dialog, etc.)
│   ├── problems/                 # Problem features
│   │   ├── CodeEditor.tsx        # Monaco editor wrapper
│   │   ├── TestRunner.tsx        # Test execution UI
│   │   ├── Visualizer.tsx        # Algorithm visualizations
│   │   ├── SolutionTab.tsx       # Solution display
│   │   ├── ProblemList.tsx       # Filterable problem grid
│   │   └── ProblemCard.tsx       # Problem preview card
│   └── layout/                   # Navbar, Sidebar
│
├── lib/
│   ├── auth.ts                   # NextAuth config with JWT callbacks
│   ├── prisma.ts                 # Singleton Prisma client
│   ├── store.ts                  # 5 Zustand stores
│   ├── stripe.ts                 # Stripe client + plan definitions
│   ├── utils.ts                  # Helpers (cn, dates, colors)
│   └── problems-data.ts          # Seed data for 75 problems
│
├── prisma/
│   ├── schema.prisma             # Database schema (6 models)
│   └── seed.ts                   # Database seeder
│
├── types/
│   └── problem.ts                # TypeScript interfaces
│
└── docker-compose.yml            # PostgreSQL service
```

## Quick Commands

```bash
# Development
npm run dev                       # Start dev server at localhost:3000
npm run build                     # Production build
npm run lint                      # Run ESLint

# Database
docker-compose up -d              # Start PostgreSQL
npx prisma generate               # Generate Prisma client
npx prisma db push                # Sync schema to database
npx prisma db seed                # Seed with 75 problems
npx prisma studio                 # GUI for database
npx prisma migrate deploy         # Run migrations (production)

# Stripe (local testing)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Database Schema

### Core Models

**User**: Authentication and subscription
- Fields: `id`, `email`, `name`, `password` (bcrypt), `subscription` (free/premium)
- Stripe fields: `stripeCustomerId`, `stripeSubscriptionId`

**Problem**: LeetCode problems (75 total)
- Fields: `slug` (unique), `title`, `difficulty`, `category`, `pattern`
- JSON fields: `examples`, `starterCode`, `solution`, `testCases`, `hints`
- Boolean: `isPremium`

**Progress**: User-problem relationship
- Fields: `status` (not-started/attempted/solved), `lastCode`, `language`, `attempts`
- Unique constraint: `(userId, problemId)`

### Relationships
- User → Progress (one-to-many)
- Problem → Progress (one-to-many)
- Cascade delete on all foreign keys

## Code Conventions

### TypeScript
- Strict mode enabled
- All props must be typed
- Use types from `@/types/problem.ts`
- Path alias: `@/*` maps to project root

### React Components
- Use `'use client'` directive for client-side interactivity
- Server components for data fetching (problems pages use SSR)
- Controlled inputs with React state
- Loading/disabled states for async operations

### API Routes
- RESTful conventions (GET, POST, PUT, DELETE)
- Error format: `{ error: string }` with appropriate status codes
- Use `getServerSession(authOptions)` for authentication
- Wrap handlers in try-catch with console.error

```typescript
// Example API route pattern
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // ... business logic
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error message:', error);
    return NextResponse.json({ error: 'User-friendly message' }, { status: 500 });
  }
}
```

### State Management (Zustand)
- 5 stores in `lib/store.ts`: editor, filters, progress, theme, UI
- All stores except UI use `persist` middleware for localStorage
- Store naming: `use[Feature]Store`
- Immutable updates with spread operators

```typescript
// Example usage
const { language, setLanguage } = useEditorStore();
```

### Styling
- Utility-first Tailwind CSS
- Use `cn()` helper from `lib/utils.ts` for conditional classes
- Dark mode via `.dark` class (class-based strategy)
- HSL color variables defined in `globals.css`

### Prisma
- Import from `@/lib/prisma` (singleton pattern)
- Use `findMany`, `findUnique`, `create`, `update`, `upsert`
- Order problems by `order` field ascending

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/auth.ts` | NextAuth config, JWT callbacks, session types |
| `lib/store.ts` | All Zustand stores with persistence |
| `lib/stripe.ts` | Stripe client, plan definitions ($12/mo, $99/yr) |
| `types/problem.ts` | All TypeScript interfaces |
| `prisma/schema.prisma` | Database schema |
| `app/api/problems/route.ts` | GET all problems with user progress |
| `app/api/problems/[slug]/route.ts` | GET/PUT single problem and progress |

## Environment Variables

Required in `.env`:
```bash
DATABASE_URL="postgresql://..."       # PostgreSQL connection
NEXTAUTH_SECRET="..."                 # JWT signing secret
NEXTAUTH_URL="http://localhost:3000"  # Auth callback URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Frontend URL
```

Optional:
```bash
GOOGLE_CLIENT_ID="..."                # Google OAuth
GOOGLE_CLIENT_SECRET="..."
STRIPE_SECRET_KEY="sk_..."            # Stripe API key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Common Patterns

### Authentication Check
```typescript
const session = await getServerSession(authOptions);
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Premium Content Gating
```typescript
if (problem.isPremium && session.user.subscription !== 'premium') {
  return NextResponse.json({ error: 'Premium required' }, { status: 403 });
}
```

### Progress Tracking
```typescript
await prisma.progress.upsert({
  where: { userId_problemId: { userId, problemId } },
  update: { status: 'solved', solvedAt: new Date() },
  create: { userId, problemId, status: 'solved', solvedAt: new Date() },
});
```

## Testing Notes

- Test runner currently mocks results (70% pass rate demo)
- No test framework installed - add Jest/Vitest if needed
- Monaco editor requires browser environment

## Important Constraints

1. **Password Requirements**: Minimum 8 characters (validated in registration)
2. **Languages Supported**: JavaScript, Python, TypeScript only
3. **Difficulty Levels**: easy, medium, hard (lowercase)
4. **Progress Statuses**: not-started, attempted, solved
5. **Subscription Tiers**: free (15 problems), premium (75 problems)

## Git Workflow

- Main branch for production
- Feature branches: `feature/description`
- Commit messages: imperative mood, concise
- Run `npm run lint` before committing
