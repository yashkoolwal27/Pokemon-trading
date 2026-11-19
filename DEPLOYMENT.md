# TRADEMON — Production Deployment Guide

This guide explains how to deploy **TRADEMON** (Pokémon GO Trading & Recommendation App) to production on **Vercel** with a **Supabase (PostgreSQL)** backend.

---

## 1. Quick Deploy to Vercel (Recommended)

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: TRADEMON production release"
   git remote add origin https://github.com/<your-username>/pokemon-go-trading-app.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New" ➔ "Project"**.
3. Import your GitHub repository.
4. Framework Preset will be automatically detected as **Next.js**.
5. Click **"Deploy"**!

---

## 2. Setting Up Supabase Database (Optional for live multi-user sync)

TRADEMON comes with a built-in offline-ready mock layer that works immediately without database configuration. To connect a live production PostgreSQL database:

1. Create a free project at [Supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in Supabase.
3. Open [`supabase/migrations/20261119_init.sql`](file:///c:/Users/yashk/Desktop/pokemon%20go%20trading%20app/supabase/migrations/20261119_init.sql) and paste its entire content into the SQL Editor.
4. Click **Run** to create all tables (`profiles`, `pokemon`, `variants`, `user_wants`, `user_gives`, `matches`, `conversations`, `messages`, `ratings`).
5. Go to **Project Settings ➔ API** and copy:
   - `Project URL`
   - `anon / public` API Key
6. Add these as Environment Variables in Vercel:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_APP_NAME="TRADEMON"
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

---

## 3. Running Locally in Production Mode

To test the exact production build on your local machine:

```bash
# 1. Clean build
npm run build

# 2. Start optimized production server
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. PWA (Progressive Web App) Installation

TRADEMON is configured with a mobile-first PWA manifest (`public/manifest.json`):
- **iOS Safari**: Tap the Share icon ➔ Tap **"Add to Home Screen"**.
- **Android Chrome**: Tap the three dots ➔ Tap **"Install App"**.
- **Desktop Chrome / Edge**: Click the install icon in the URL address bar.
