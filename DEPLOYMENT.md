# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist (COMPLETED)

- [x] Created Prisma migration files
- [x] Fixed Stripe initialization for production builds
- [x] Updated build script to run migrations automatically
- [x] Committed and pushed all changes to git

## 🚀 Deployment Steps

### Step 1: Set Up Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your repository: `lapolonio/blind75-master`
4. Select the branch: `claude/fix-verve-build-issues-rEcu9` (or merge to main first)

### Step 2: Create Vercel Postgres Database

1. Go to your Vercel project
2. Navigate to the **Storage** tab
3. Click **"Create Database"** → **"Postgres"**
4. Choose a region close to your users (e.g., `us-east-1`)
5. Click **"Create"**

✅ Vercel will automatically add `DATABASE_URL` to your environment variables!

### Step 3: Add Required Environment Variables

Go to **Project Settings** → **Environment Variables** and add:

#### Required Variables:

```env
# NextAuth (REQUIRED)
NEXTAUTH_SECRET="<generate-with: openssl rand -base64 32>"
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-app-name.vercel.app"

# Stripe (REQUIRED for payments)
STRIPE_SECRET_KEY="sk_test_... or sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_... or pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_MONTHLY_PRICE_ID="price_..."
STRIPE_YEARLY_PRICE_ID="price_..."

# Google OAuth (OPTIONAL)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### How to Get Each Variable:

**NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**NEXTAUTH_URL & NEXT_PUBLIC_APP_URL:**
- Use your Vercel deployment URL (e.g., `https://blind75-master.vercel.app`)
- Or your custom domain if you have one

**Stripe Keys:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → API keys
3. Copy the Secret Key and Publishable Key
4. For production, use **live keys** (starts with `sk_live_` and `pk_live_`)

**Stripe Price IDs:**
1. Go to Products in Stripe Dashboard
2. Create two products: "Premium Monthly" and "Premium Yearly"
3. Add prices: $12/month and $99/year
4. Copy the price IDs (starts with `price_`)

**Stripe Webhook Secret:**
1. Go to Developers → Webhooks in Stripe Dashboard
2. Click "Add endpoint"
3. Endpoint URL: `https://your-app-name.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the webhook signing secret (starts with `whsec_`)

**Google OAuth (Optional):**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-app-name.vercel.app/api/auth/callback/google`

### Step 4: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for the build to complete (2-3 minutes)
3. Vercel will automatically:
   - Run `prisma generate`
   - Run `prisma migrate deploy` (applies your migration)
   - Build the Next.js app

### Step 5: Seed the Database

After the first successful deployment, seed your database:

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm intall -g vercel

# Login
vercel login

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Seed the database (note: tr -d '"' removes quotes from the URL)
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"') npm run db:seed
```

#### Option B: Using Vercel Postgres Console

1. Go to Storage → Postgres in Vercel
2. Click "Query" tab
3. Manually run the seed queries (not recommended, use Option A)

### Step 6: Verify Deployment

1. Visit your deployed URL
2. Try to sign up for an account
3. Check if problems are loading
4. Test the code editor
5. Test Stripe checkout (if configured)

## 🔄 Future Deployments

After the initial setup:

1. Make changes to your code
2. Commit and push to git
3. Vercel automatically deploys
4. Migrations run automatically during build

## 🐛 Troubleshooting

### Build Fails with "DATABASE_URL not found"
- Ensure you created the Vercel Postgres database
- Check that `DATABASE_URL` is in environment variables

### Build Fails with Stripe Error
- Set `STRIPE_SECRET_KEY` in environment variables
- Use a valid test or live key from Stripe

### No Problems Showing After Deployment
- You need to seed the database (Step 5)
- Run: `DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"') npm run db:seed`

### Stripe Webhooks Not Working
- Add webhook endpoint in Stripe Dashboard
- Use the correct webhook secret
- Endpoint must be: `https://your-domain.vercel.app/api/stripe/webhook`

### "Invalid CSRF token" on Login
- Ensure `NEXTAUTH_URL` matches your deployment URL exactly
- Include https:// protocol
- No trailing slash

## 📝 Post-Deployment Tasks

- [ ] Test user registration and login
- [ ] Test Stripe checkout flow
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Test Stripe webhooks with real payments
- [ ] Update OAuth callback URLs if using custom domain
- [ ] Add SSL certificate (automatic with Vercel)

## 🎉 You're Done!

Your Blind75 Master app should now be live at your Vercel URL!

Need help? Check the [Vercel documentation](https://vercel.com/docs) or the [Next.js deployment guide](https://nextjs.org/docs/deployment).
