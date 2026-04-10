# AncestryTracker

A full-stack ancestry tracking web application built with React + Vite, Clerk auth, Supabase, and Stripe.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| Tree UI | React Flow |
| Payments | Stripe |
| State | Zustand |
| Routing | React Router v6 |
| Deployment | Vercel |

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ancestry-tracker
cd ancestry-tracker
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

```
VITE_CLERK_PUBLISHABLE_KEY=    # from Clerk dashboard
VITE_SUPABASE_URL=             # from Supabase project settings
VITE_SUPABASE_ANON_KEY=        # from Supabase project settings
VITE_STRIPE_PUBLISHABLE_KEY=   # from Stripe dashboard
VITE_STRIPE_PRICE_ID=          # Price ID of your $4.99/mo product
FIGMA_ACCESS_TOKEN=            # optional — for Figma MCP
```

### 3. Run locally

```bash
npm run dev
```

---

## Clerk Setup

1. Create a free account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the **Publishable Key** into `VITE_CLERK_PUBLISHABLE_KEY`
4. In **JWT Templates**, create a template named `supabase` with the following claims:
   ```json
   { "sub": "{{user.id}}" }
   ```
   This token is passed to Supabase as the `Authorization` header for RLS.

---

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy **Project URL** and **Anon Key** into `.env.local`
3. Open the **SQL Editor** and run the migration in `supabase/migrations/` (tables + RLS policies)
4. In **Storage**, create a bucket named `avatars` and set it to **Public**

### Supabase JWT Setup (RLS)

For RLS policies to identify the Clerk user, go to **Supabase → Settings → API → JWT Settings** and paste in your Clerk JWT secret (found in Clerk → JWT Templates → your `supabase` template → signing key).

---

## Stripe Setup

1. Create an account at [stripe.com](https://stripe.com)
2. In **Products**, create a product with a **$4.99/month recurring price**
3. Copy the **Publishable Key** → `VITE_STRIPE_PUBLISHABLE_KEY`
4. Copy the **Price ID** → `VITE_STRIPE_PRICE_ID`

### Stripe Webhook (local testing)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to the Supabase Edge Function
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

### Deploy the Edge Function

```bash
supabase functions deploy stripe-webhook
```

Set the following secrets in Supabase:
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Figma MCP Configuration

Create `.mcp.json` in the project root (already in `.gitignore`):

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    }
  }
}
```

Set `FIGMA_ACCESS_TOKEN` in `.env.local`. Never commit `.mcp.json`.

---

## GitHub Repository Setup

```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/ancestry-tracker
git checkout -b develop
git add .
git commit -m "chore: initial project scaffold"
git push -u origin develop
```

---

## Vercel Deployment

1. Connect your GitHub repository at [vercel.com](https://vercel.com)
2. Set **Framework Preset** to `Vite`
3. Set **Build Command** to `npm run build`, **Output Directory** to `dist`
4. Add all `VITE_*` environment variables under **Settings → Environment Variables**
5. **Push to `main`** for production; **push to `develop`** for preview deployments

---

## Git Workflow

```bash
# Pull latest develop
git checkout develop && git pull origin develop

# Create a feature branch
git checkout -b feature/your-feature

# Commit
git add src/components/MyComponent.jsx
git commit -m "feat: add MyComponent"

# Push + open PR into develop
git push origin feature/your-feature
```

**Branch strategy:**
- `main` — production (auto-deploys to Vercel)
- `develop` — integration branch
- `feature/*` — short-lived feature branches

---

## Running Tests

```bash
# Unit + component tests (Vitest)
npm run test

# E2E tests (Playwright — requires dev server running)
npx playwright test
```

---

## Project Structure

```
src/
├── components/
│   ├── tree/         PersonCard, TreeCanvas, PersonModal
│   ├── layout/       Sidebar, Toolbar
│   └── ui/           Avatar, Toast, UpgradeModal
├── pages/            Landing, Auth, Dashboard
├── store/            useStore (Zustand)
├── lib/              supabaseClient, stripeClient
└── hooks/            useSubscription

supabase/
└── functions/
    └── stripe-webhook/   Deno Edge Function

tests/
├── unit/             store, useSubscription
├── components/       PersonCard
└── e2e/              landing (Playwright)
```
