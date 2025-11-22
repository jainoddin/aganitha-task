# Step-by-Step: Verify DATABASE_URL is Working on Vercel

## ⚠️ CRITICAL: You MUST Redeploy After Adding Environment Variables!

Environment variables are only available **after a new deployment**. Adding them doesn't update the running app.

---

## Step 1: Verify Variable is Added Correctly

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Check the dropdown at the top** - Make sure it says **"Production"** (not "Preview")

3. **Verify `DATABASE_URL` exists:**
   - You should see `DATABASE_URL` in the list
   - Click on it to see the value
   - Value should start with: `postgresql://neondb_owner:...`

4. **Check all environments:**
   - Switch dropdown to **"Production"** → Should see `DATABASE_URL`
   - Switch to **"Preview"** → Should see `DATABASE_URL`  
   - Switch to **"Development"** → Should see `DATABASE_URL`

---

## Step 2: Redeploy (THIS IS THE MOST IMPORTANT STEP!)

**If you haven't redeployed after adding the variable, that's why it's not working!**

### Option A: Redeploy from Vercel Dashboard
1. Go to **Deployments** tab
2. Find your latest deployment (should be at the top)
3. Click the **three dots (⋯)** on the right side
4. Click **"Redeploy"**
5. **Wait 2-3 minutes** for deployment to complete
6. You'll see a green checkmark when it's done

### Option B: Trigger via Git (if you have git connected)
```bash
git commit --allow-empty -m "Redeploy with DATABASE_URL"
git push
```

---

## Step 3: Check Deployment Logs

After redeploying, check if the variable is being loaded:

1. Go to **Deployments** tab
2. Click on your latest deployment
3. Click **"View Build Logs"** or **"View Function Logs"**
4. Look for these messages:

**✅ GOOD (should see this):**
```
✓ DATABASE_URL is set (length: XXX characters)
```

**❌ BAD (if you see this, variable is not set):**
```
ERROR: DATABASE_URL environment variable is not set!
```

---

## Step 4: Test the API

After redeploy completes:

1. Visit: `https://aganitha-task-alpha.vercel.app/api/links`
2. **Expected result:** `[]` (empty array) - This means it's working!
3. **If still error:** Continue to Step 5

---

## Step 5: Debug Endpoint (If Still Not Working)

I've created a debug endpoint. First, enable it:

1. Go to **Settings** → **Environment Variables**
2. Add new variable:
   - **Key**: `ALLOW_DEBUG`
   - **Value**: `true`
   - Select all environments
   - Click **Save**
3. **Redeploy again** (important!)
4. Visit: `https://aganitha-task-alpha.vercel.app/api/debug-env`
5. This will show you exactly what environment variables are available

---

## Common Issues & Solutions

### Issue 1: "I added it but didn't redeploy"
**Solution:** Go to Deployments → Click three dots → Redeploy

### Issue 2: "I only added it to Preview, not Production"
**Solution:** 
- Go to Environment Variables
- Select "Production" from dropdown
- Add `DATABASE_URL` for Production
- Redeploy

### Issue 3: "There's a typo in the variable name"
**Solution:**
- Make sure it's exactly: `DATABASE_URL` (all caps, underscore, no spaces)
- Not: `database_url`, `DATABASE-URL`, `DATABASE URL`, etc.

### Issue 4: "I forgot to click Save"
**Solution:**
- Go back to Environment Variables
- Make sure you clicked the "Save" button
- Redeploy

---

## Quick Checklist

Before asking for help, verify:

- [ ] `DATABASE_URL` exists in Vercel Environment Variables
- [ ] `DATABASE_URL` is set for **Production** environment (check dropdown)
- [ ] Clicked **"Save"** after adding the variable
- [ ] **Redeployed** the application (Deployments → three dots → Redeploy)
- [ ] Waited for deployment to complete (2-3 minutes)
- [ ] Checked deployment logs for "✓ DATABASE_URL is set"
- [ ] Tested the API endpoint again

---

## Still Not Working?

If you've done all the above and it still doesn't work:

1. **Check Vercel Function Logs:**
   - Go to Deployments → Latest deployment → View Function Logs
   - Look for any error messages

2. **Verify Connection String:**
   - Make sure the connection string is complete
   - Should start with: `postgresql://`
   - Should include: `?sslmode=require`

3. **Try the debug endpoint:**
   - Add `ALLOW_DEBUG=true` to environment variables
   - Redeploy
   - Visit `/api/debug-env` to see what's available

4. **Contact Support:**
   - Share the debug endpoint output
   - Share a screenshot of your Environment Variables page
   - Share the deployment logs

