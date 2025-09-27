# Fixing Authentication Issues on New Devices

## Problem
The site is asking for Vercel login on new devices instead of showing the public site.

## Solution Steps

### 1. Check Vercel Dashboard Settings
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **General**
4. Look for **Password Protection** or **Preview Protection**
5. **Disable** any password protection if enabled

### 2. Environment Variables
Make sure these environment variables are set in Vercel:

```bash
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
DATABASE_URL=your-database-url
NEXT_PUBLIC_BUSINESS_NAME=JANU ENTERPRISE
```

### 3. Redeploy
After making changes:
1. Push your changes to GitHub
2. Vercel will automatically redeploy
3. Or manually trigger a deployment from Vercel dashboard

### 4. Test Public Access
- Visit your site URL directly (not /admin)
- The homepage should load without asking for login
- Only /admin routes should require authentication

### 5. Admin Access
To access admin features:
- Go to `/admin/login`
- Use credentials:
  - Email: admin@januenterprise.com
  - Password: admin123

## Common Issues

### Issue: Site redirects to login
**Solution**: Check if password protection is enabled in Vercel settings

### Issue: Authentication errors
**Solution**: Ensure NEXTAUTH_SECRET is set in environment variables

### Issue: Database connection errors
**Solution**: Check DATABASE_URL is correctly configured

## Verification
After fixing:
1. ✅ Homepage loads without authentication
2. ✅ Products display correctly
3. ✅ Cart functionality works
4. ✅ Admin login works at /admin/login
5. ✅ Admin dashboard accessible after login
