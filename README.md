# Blind75 Master

An interactive platform for learning and practicing the Blind 75 LeetCode problems with visualizations, explanations, and progress tracking.

## Features

- **Interactive Code Editor**: Write and test solutions in JavaScript, Python, or TypeScript
- **Test Runner**: Run code against test cases with instant feedback
- **Visualizations**: Step-by-step algorithm visualizations
- **Progress Tracking**: Track your learning journey with stats and streaks
- **Pattern Recognition**: Learn common algorithm patterns
- **Dark Mode**: Easy on the eyes with full dark mode support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Code Editor**: Monaco Editor
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or Docker)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blind75-master.git
cd blind75-master
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/blind75master?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Start the database (using Docker):
```bash
docker-compose up -d
```

5. Initialize the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

6. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
blind75-master/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # Main app pages
│   └── api/              # API routes
├── components/
│   ├── ui/               # shadcn components
│   ├── problems/         # Problem-related components
│   └── layout/           # Layout components
├── lib/
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Auth configuration
│   ├── stripe.ts         # Stripe configuration
│   └── problems-data.ts  # Initial problems data
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeder
└── types/
    └── problem.ts        # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio

## Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Run migrations (production)
npx prisma migrate deploy

# Seed the database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

## Setting Up Stripe (Optional)

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Dashboard
3. Create products and prices in Stripe
4. Add the keys to your `.env`:
```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

5. For local webhook testing, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Setting Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add the credentials to your `.env`:
```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
