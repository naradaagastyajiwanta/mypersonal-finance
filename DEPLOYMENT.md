# Vercel Deployment Guide

## 🚀 Deploying Finance Tracker to Vercel

### Prerequisites
1. GitHub account
2. Vercel account (free tier is sufficient)
3. Google Cloud Console project with OAuth 2.0 credentials

### Step 1: Prepare Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Finance Tracker PWA"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/finance-tracker.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com/
2. **Sign in** with your GitHub account
3. **Import Project**:
   - Click "New Project"
   - Select your finance-tracker repository
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: `./` (default)

4. **Environment Variables**:
   Add these in Vercel dashboard:
   ```
   VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
   VITE_SPREADSHEET_ID=your-spreadsheet-id-here (optional)
   ```

5. **Deploy**: Click "Deploy"

### Step 3: Update Google OAuth Configuration

After deployment, update your Google Cloud Console:

1. **Go to Google Cloud Console**
2. **APIs & Services → Credentials**
3. **Edit your OAuth 2.0 Client ID**
4. **Add to Authorized JavaScript origins**:
   ```
   https://your-app-name.vercel.app
   ```
5. **Add to Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app
   ```

### Step 4: Test Production Deployment

1. **Visit your Vercel URL**
2. **Test Google Sign-in**
3. **Verify PWA functionality**:
   - Install prompt should appear
   - Offline functionality works
   - Service worker registered

### Production Features Enabled

✅ **PWA Capabilities**:
- Installable on mobile devices
- Offline functionality
- Service worker for caching

✅ **Performance Optimizations**:
- Static asset caching
- Google APIs caching
- Automatic updates

✅ **Security Headers**:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection

### Environment Variables

**Required**:
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID

**Optional**:
- `VITE_SPREADSHEET_ID`: Pre-configured spreadsheet ID

### Custom Domain (Optional)

To use a custom domain:
1. **Vercel Dashboard** → Your Project → Settings → Domains
2. **Add Domain**: your-domain.com
3. **Update DNS** settings as instructed
4. **Update Google OAuth** origins with new domain

### Troubleshooting

**Common Issues**:
1. **OAuth Error**: Check authorized origins in Google Cloud Console
2. **Build Fails**: Ensure all dependencies are in package.json
3. **Environment Variables**: Make sure they're set in Vercel dashboard

**Support**:
- Vercel Docs: https://vercel.com/docs
- Google OAuth: https://developers.google.com/identity/protocols/oauth2

---

**Your Finance Tracker will be live at**: `https://your-app-name.vercel.app`