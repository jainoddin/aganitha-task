# Database Setup Guide for Vercel Deployment

## Problem
When deploying to Vercel, you're seeing the error: "Database not configured. Please set DATABASE_URL environment variable."

## Understanding DATABASE_URL

**What is `DATABASE_URL`?**
- It's an **environment variable name** that your code looks for
- Your code reads it using: `process.env.DATABASE_URL`
- The **Name** in Vercel must match exactly: `DATABASE_URL`

**Where does your code use it?**
- `lib/db.js` line 14: `connectionString: process.env.DATABASE_URL`
- `pages/api/links/index.js` line 35: checks if `process.env.DATABASE_URL` exists
- `pages/api/links/[code].js` line 21: checks if `process.env.DATABASE_URL` exists

**In Vercel Environment Variables:**
- **Name** = `DATABASE_URL` (this is what your code searches for)
- **Value** = Your database connection string (e.g., `postgresql://user:pass@host/db`)

Think of it like this:
```
Vercel Environment Variable:
  Name: DATABASE_URL  ← Your code looks for this name
  Value: postgresql://...  ← Your actual database connection string

Your code:
  process.env.DATABASE_URL  ← Reads the value using the name
```

## Solution: Set up a Production PostgreSQL Database

### Option 1: Neon (Recommended - Free & Easy)

1. **Create a Neon Account**
   - Go to https://neon.tech
   - Sign up with GitHub (easiest) or email
   - Create a new project

2. **Get Your Connection String**
   - In your Neon dashboard, go to your project
   - Click on "Connection Details" or "Connection String"
   - Copy the connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)

3. **Add to Vercel**
   - Go to your Vercel project dashboard: https://vercel.com/dashboard
   - Click on your project
   - Go to **Settings** → **Environment Variables**
   - Click **Add New**
   - **Name**: `DATABASE_URL` ← This is the variable name your code looks for
     - Your code in `lib/db.js` (line 14) uses: `process.env.DATABASE_URL`
     - The "Name" must be exactly `DATABASE_URL` (case-sensitive, no spaces)
   - **Value**: Paste your Neon connection string (the long `postgresql://...` string)
   - Select all environments (Production, Preview, Development)
   - Click **Save**

   **Why `DATABASE_URL`?**
   - Your code checks for this exact name: `process.env.DATABASE_URL`
   - See `lib/db.js` line 14: `connectionString: process.env.DATABASE_URL`
   - If you use a different name, your code won't find it!

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots (⋯) on your latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a new deployment

### Option 2: Supabase (Free Tier Available)

1. **Create a Supabase Account**
   - Go to https://supabase.com
   - Sign up and create a new project

2. **Get Connection String**
   - Go to Project Settings → Database
   - Find "Connection string" section
   - Copy the "URI" connection string (starts with `postgresql://`)

3. **Add to Vercel** (same steps as Neon above)

### Option 3: Railway (Simple & Fast)

1. **Create a Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Railway will create a database automatically

3. **Get Connection String**
   - Click on your PostgreSQL service
   - Go to "Variables" tab
   - Copy the `DATABASE_URL` value

4. **Add to Vercel** (same steps as Neon above)

### Option 4: Vercel Postgres (All-in-One)

1. **In Vercel Dashboard**
   - Go to your project
   - Click on **Storage** tab
   - Click **Create Database**
   - Select **Postgres**
   - Choose a name and region
   - Click **Create**

2. **Get Connection String**
   - Vercel will automatically create a `POSTGRES_URL` environment variable
   - However, your code uses `DATABASE_URL`, so you need to:
     - Go to **Settings** → **Environment Variables**
     - Add a new variable:
       - Name: `DATABASE_URL`
       - Value: Copy the value from `POSTGRES_URL` (or use `POSTGRES_URL` directly)

3. **Update Code (Optional)**
   - You can modify `lib/db.js` to also check for `POSTGRES_URL` if you prefer

## Important Notes

1. **SSL Required**: Production databases require SSL connections. Your code already handles this in `lib/db.js` (line 15).

2. **Environment Variables**: Make sure to add `DATABASE_URL` to all environments (Production, Preview, Development) in Vercel.

3. **Redeploy After Adding Variables**: After adding environment variables, you MUST redeploy your application for the changes to take effect.

4. **Database Schema**: The database will automatically create the required tables on first connection (see `lib/db.js` lines 24-43).

5. **Base URL**: Also make sure to set `NEXT_PUBLIC_BASE_URL` in Vercel:
   - Name: `NEXT_PUBLIC_BASE_URL`
   - Value: `https://your-app-name.vercel.app` (your actual Vercel URL)

## Quick Checklist

- [ ] Created a PostgreSQL database (Neon/Supabase/Railway/etc.)
- [ ] Copied the connection string
- [ ] Added `DATABASE_URL` to Vercel environment variables
- [ ] Added `NEXT_PUBLIC_BASE_URL` to Vercel environment variables
- [ ] Redeployed the application
- [ ] Tested the application

## Troubleshooting

**Still seeing the error?**
- Make sure you redeployed after adding the environment variable
- Check that the variable name is exactly `DATABASE_URL` (case-sensitive)
- Verify the connection string is correct (should start with `postgresql://`)
- Check Vercel deployment logs for more details

**Connection timeout errors?**
- Make sure your database allows connections from anywhere (0.0.0.0/0)
- Check if your database provider requires IP whitelisting (most don't)

**SSL errors?**
- Your code already handles SSL, but if issues persist, check the connection string includes `?sslmode=require`

