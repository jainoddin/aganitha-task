# Troubleshooting: DATABASE_URL Not Working on Vercel

## Problem
You added `DATABASE_URL` to Vercel but still getting the error:
```
"Database not configured. Please set DATABASE_URL environment variable."
```

## Solution Steps

### Step 1: Verify Environment Variable is Saved
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Make sure you see `DATABASE_URL` in the list
3. **IMPORTANT**: Check which environments it's set for:
   - Look at the environment dropdown (top of the page)
   - Make sure `DATABASE_URL` is set for **Production** environment
   - If you only see it for "Preview", that's the problem!

### Step 2: Add to Production Environment
If `DATABASE_URL` is missing for Production:

1. In the Environment Variables page, look at the top dropdown
2. Select **"Production"** from the dropdown
3. If `DATABASE_URL` is not there, click **"Add New"**
4. Enter:
   - **Key**: `DATABASE_URL`
   - **Value**: Your connection string (same one you used before)
5. Make sure **"Production"** is checked
6. Click **"Save"**

### Step 3: Redeploy (CRITICAL!)
**You MUST redeploy after adding environment variables!**

1. Go to **Deployments** tab in Vercel
2. Find your latest deployment
3. Click the **three dots (⋯)** on the right
4. Click **"Redeploy"**
5. Wait for deployment to complete (2-3 minutes)

**OR** push a new commit to trigger automatic deployment:
```bash
git commit --allow-empty -m "Trigger redeploy with DATABASE_URL"
git push
```

### Step 4: Verify It's Working
1. After redeploy completes, visit: `https://aganitha-task-alpha.vercel.app/api/links`
2. You should see `[]` (empty array) instead of an error
3. If still error, check deployment logs in Vercel

## Common Mistakes

❌ **Mistake 1**: Added variable but didn't redeploy
- **Fix**: Redeploy your app

❌ **Mistake 2**: Only added to Preview, not Production
- **Fix**: Add `DATABASE_URL` to Production environment

❌ **Mistake 3**: Typo in variable name
- **Fix**: Make sure it's exactly `DATABASE_URL` (all caps, no spaces)

❌ **Mistake 4**: Forgot to click "Save"
- **Fix**: Go back and make sure you clicked "Save" button

## Quick Checklist

- [ ] `DATABASE_URL` exists in Vercel Environment Variables
- [ ] `DATABASE_URL` is set for **Production** environment (not just Preview)
- [ ] Clicked "Save" after adding the variable
- [ ] Redeployed the application after adding the variable
- [ ] Waited for deployment to complete
- [ ] Tested the API endpoint again

## Still Not Working?

Check Vercel deployment logs:
1. Go to **Deployments** tab
2. Click on your latest deployment
3. Click **"View Function Logs"** or check the build logs
4. Look for any errors related to `DATABASE_URL`

You should see in the logs:
```
✓ DATABASE_URL is set (length: XXX characters)
```

If you see:
```
ERROR: DATABASE_URL environment variable is not set!
```

Then the variable is not being passed to the production build.

