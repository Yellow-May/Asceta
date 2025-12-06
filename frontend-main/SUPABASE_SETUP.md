# Supabase Setup Guide

This guide will walk you through setting up a Supabase project and configuring it for the ACCADD application.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using:
   - GitHub account (recommended), or
   - Email and password
4. Verify your email if required

## Step 2: Create a New Project

1. Once logged in, you'll see the Supabase dashboard
2. Click **"New Project"** button (usually in the top right or center)
3. Fill in the project details:
   - **Name**: `ASCETA ACCADD` (or any name you prefer)
   - **Database Password**: Create a strong password (save this securely!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Select **Free** (for development)
4. Click **"Create new project"**
5. Wait 1-2 minutes for the project to be provisioned

## Step 3: Get Your Project Credentials

Once your project is ready:

1. In your project dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:

### Project URL

- Look for **"Project URL"** section
- Copy the URL (it looks like: `https://xxxxxxxxxxxxx.supabase.co`)
- This is your `VITE_SUPABASE_URL`

### API Keys

- Scroll down to **"Project API keys"** section
- Find the **"anon public"** key (this is the public key, safe to use in frontend)
- Click the **eye icon** or **"Reveal"** to show the key
- Copy the entire key (it's a long string starting with `eyJ...`)
- This is your `VITE_SUPABASE_ANON_KEY`

⚠️ **Important**:

- Use the **"anon public"** key, NOT the "service_role" key
- The "service_role" key has admin privileges and should NEVER be exposed in frontend code

## Step 4: Configure Authentication Settings

1. In the left sidebar, click **Authentication**
2. Click **Settings** (or go to Authentication → Settings)
3. Configure the following:

### Email Auth Settings

- **Enable Email provider**: Make sure it's enabled (should be by default)
- **Confirm email**:
  - For development: Set to **OFF** (allows immediate signup without email verification)
  - For production: Set to **ON** (requires email verification)

### Site URL

- Set **Site URL** to: `http://localhost:3000` (for development)
- Add **Redirect URLs**:
  - `http://localhost:3000/accadd/payment` (redirects to payment page after signup/login and email confirmation)
  - `http://localhost:3000/**` (allows redirects to any page after auth)

**Note**: The payment page (`/accadd/payment`) is where users will be redirected after:

- Successful signup (if email confirmation is disabled)
- Clicking the email confirmation link (if email confirmation is enabled)
- Successful login

### Email Templates (Optional)

- You can customize email templates for signup, password reset, etc.

## Step 5: Configure Your .env File

1. In your project root (`frontend-main/`), create a `.env` file (if it doesn't exist)
2. Copy the contents from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and replace the placeholder values:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwMDAwMDAwLCJleHAiOjE2NDAwMDAwMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Replace**:

- `https://xxxxxxxxxxxxx.supabase.co` with your actual Project URL
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` with your actual anon public key

## Step 6: Verify Configuration

1. Make sure your `.env` file is in the `frontend-main/` directory
2. Restart your Vite dev server:
   ```bash
   # Stop the current server (Ctrl+C)
   yarn dev
   ```
3. Check the browser console - you should NOT see any Supabase configuration errors
4. Try signing up - it should work now!

## Troubleshooting

### Error: "ERR_NAME_NOT_RESOLVED"

- **Cause**: Invalid or incorrect Supabase URL
- **Fix**: Double-check your `VITE_SUPABASE_URL` in `.env` file
- Make sure it starts with `https://` and ends with `.supabase.co`
- Make sure there are no extra spaces or quotes

### Error: "Invalid API key"

- **Cause**: Wrong API key or key not copied completely
- **Fix**: Go back to Supabase dashboard → Settings → API
- Copy the **"anon public"** key again (make sure you copy the entire key)
- Make sure there are no spaces or line breaks in the key

### Error: "Email already registered"

- This is normal if you've already signed up
- Try signing in instead, or use a different email

### Still having issues?

1. Check browser console for specific error messages
2. Verify your `.env` file is in the correct location (`frontend-main/.env`)
3. Make sure you restarted the dev server after updating `.env`
4. Check that your Supabase project is active (not paused)

## Quick Reference

**Where to find your credentials:**

- Supabase Dashboard → Your Project → Settings → API
- **Project URL**: Under "Project URL" section
- **Anon Key**: Under "Project API keys" → "anon public"

**Your .env file should look like:**

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

Need help? Check the [Supabase Documentation](https://supabase.com/docs) or [Supabase Discord](https://discord.supabase.com)
