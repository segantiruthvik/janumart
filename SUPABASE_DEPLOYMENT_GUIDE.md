# Supabase Deployment Guide for JANU ENTERPRISE

## Issues Fixed

### 1. Database URL Configuration
- ✅ **Fixed**: Updated `prisma/schema.prisma` to use `POSTGRES_PRISMA_URL` instead of `DATABASE_URL`
- ✅ **Fixed**: Updated build script to use `prisma generate` instead of `prisma db push`

### 2. Environment Variables You Need to Add

Based on your current Supabase environment variables, you need to add these **missing** environment variables to your Vercel deployment:

#### Required Environment Variables for Vercel:

```bash
# Database (You already have these)
POSTGRES_HOST=your-supabase-host.supabase.co
POSTGRES_URL=postgresql://postgres:[password]@[host]:5432/postgres
POSTGRES_PRISMA_URL=postgresql://postgres:[password]@[host]:5432/postgres?pgbouncer=true&connect_timeout=15
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth.js (MISSING - You need to add these)
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secure-random-string

# Optional Admin Credentials (MISSING - You need to add these)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
```

## Step-by-Step Deployment Instructions

### Step 1: Add Missing Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these **missing** variables:

```
NEXTAUTH_URL = https://your-app-name.vercel.app
NEXTAUTH_SECRET = [generate a random string - you can use: openssl rand -base64 32]
```

### Step 2: Set Up Your Supabase Database

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the setup script from `scripts/setup-supabase.sql`
4. Or manually create an admin user:

```sql
INSERT INTO "User" (id, name, email, "isAdmin", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@example.com',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
```

### Step 3: Push Your Database Schema

Run this command locally (make sure you have your Supabase environment variables set):

```bash
npx prisma db push
```

Or use the Supabase dashboard to run the schema creation.

### Step 4: Deploy to Vercel

1. Commit your changes:
```bash
git add .
git commit -m "Fix Supabase deployment configuration"
git push
```

2. Vercel will automatically redeploy with the new configuration.

## Common Issues and Solutions

### Issue 1: "Database connection failed"
**Solution**: Make sure `POSTGRES_PRISMA_URL` is correctly formatted with `pgbouncer=true&connect_timeout=15`

### Issue 2: "NextAuth configuration error"
**Solution**: Add `NEXTAUTH_URL` and `NEXTAUTH_SECRET` environment variables

### Issue 3: "Prisma client not found"
**Solution**: The build script now uses `prisma generate` which will create the Prisma client

### Issue 4: "Authentication not working"
**Solution**: 
1. Make sure you have created an admin user in the database
2. Check that `NEXTAUTH_SECRET` is set
3. Verify `NEXTAUTH_URL` matches your Vercel domain

## Testing Your Deployment

1. **Test Database Connection**: Check if your app loads without database errors
2. **Test Admin Login**: Go to `/admin/login` and try logging in
3. **Test Product Management**: Try adding/editing products in admin panel
4. **Test Customer Interface**: Verify products display on the main page

## Current Status

✅ Prisma schema updated to use Supabase URL format
✅ Build script fixed for production deployment
✅ Environment variables identified
✅ Database setup script created
⚠️ **Action Required**: Add missing environment variables to Vercel
⚠️ **Action Required**: Set up database schema in Supabase

## Next Steps

1. Add the missing environment variables to Vercel
2. Run the database setup in Supabase
3. Redeploy your application
4. Test all functionality

Your app should now deploy successfully to Vercel with Supabase as the database!
