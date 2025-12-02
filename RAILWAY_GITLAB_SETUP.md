# 🚀 Railway GitLab Setup Guide

Railway can connect to GitLab, but needs proper setup. Follow these steps:

---

## Option 1: Deploy from GitLab (Recommended)

### Step 1: Connect GitLab to Railway

1. Go to https://railway.app
2. Sign up/Login
3. Click **"New Project"**
4. Look for **"Deploy from Git repository"** or **"GitLab"** option
5. Click **"Configure GitLab"**
6. Authorize Railway to access your GitLab account
7. Select repository: `shakytails_barcode_scanner`

### If GitLab option is not visible:

Railway may require GitHub for free tier. Use Option 2 below.

---

## Option 2: Deploy from GitHub (Mirror from GitLab)

Since Railway prioritizes GitHub, create a mirror:

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click **"New repository"**
3. Name: `shakytails_barcode_scanner`
4. Make it **Private** or **Public**
5. **DO NOT** initialize with README
6. Click **"Create repository"**

### Step 2: Add GitHub Remote

```powershell
# Add GitHub as a remote
git remote add github https://github.com/YOUR-GITHUB-USERNAME/shakytails_barcode_scanner.git

# Push to both GitLab and GitHub
git push github main

# Verify remotes
git remote -v
```

### Step 3: Deploy from GitHub

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account
5. Select: `shakytails_barcode_scanner`
6. Railway auto-deploys! ✅

### Step 4: Auto-Deploy from Both

Now you can push to both:

```powershell
# Push to both remotes at once
git push origin main    # GitLab
git push github main    # GitHub (triggers Railway deploy)
```

Or create an alias to push to both:

```powershell
# Add this to push to both at once
git remote set-url --add --push origin https://gitlab.com/kiranpatil9762/shakytails_barcode_scanner.git
git remote set-url --add --push origin https://github.com/YOUR-USERNAME/shakytails_barcode_scanner.git

# Now this pushes to both:
git push origin main
```

---

## Option 3: Manual Deploy (No Git Connection)

Deploy without Git integration:

### Step 1: Install Railway CLI

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Or using scoop
scoop install railway
```

### Step 2: Login & Deploy

```powershell
# Login to Railway
railway login

# Initialize project
railway init

# Link to new project
railway link

# Deploy
railway up
```

### Step 3: Set Environment Variables

```powershell
# Set variables via CLI
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set MONGODB_URI="mongodb+srv://theshakytails:Shakytails%40123@shakytails.6rnpitz.mongodb.net/shakytails"
# ... set all other variables
```

---

## Option 4: Deploy to Render (GitLab Native)

Render has native GitLab support and is similar to Railway:

### Step 1: Sign Up

1. Go to https://render.com
2. Sign up with **GitLab** account
3. Authorize Render

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitLab repository: `shakytails_barcode_scanner`
3. Configure:
   - **Name:** shakytails
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

### Step 3: Add Environment Variables

In Render dashboard, add all your .env variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://theshakytails:Shakytails%40123@shakytails.6rnpitz.mongodb.net/shakytails
JWT_SECRET=your_generated_secret
BASE_URL=https://app.shakytails.com
FRONTEND_URL=https://app.shakytails.com
... (all other variables)
```

### Step 4: Custom Domain

1. Go to **Settings** → **Custom Domain**
2. Add: `app.shakytails.com`
3. Update DNS:
   ```
   Type: CNAME
   Name: app
   Value: shakytails.onrender.com
   ```

### Benefits of Render:
✅ Native GitLab integration
✅ Auto-deploy on git push
✅ Free tier available
✅ Free SSL certificate
✅ Similar to Railway

---

## Recommendation: Use Render with GitLab

Since you already have GitLab, **Render** is the easiest option:

1. **Render.com** → Native GitLab support ⭐
2. **Railway** → Requires GitHub mirror
3. **Manual CLI** → No auto-deploy

---

## Quick Start with Render:

```powershell
# 1. Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 2. Go to render.com and sign up with GitLab
# 3. Create Web Service from your GitLab repo
# 4. Add environment variables
# 5. Deploy (automatic)
# 6. Add custom domain: app.shakytails.com
# 7. Update DNS CNAME
```

**Done in 15 minutes!** 🎉

---

## Which should you choose?

| Platform | GitLab Support | Free Tier | Difficulty |
|----------|---------------|-----------|------------|
| **Render** | ✅ Native | ✅ Yes | ⭐ Easy |
| Railway | ❌ GitHub only | ✅ Limited | ⭐⭐ Medium |
| Heroku | ✅ Native | ❌ Paid only | ⭐⭐ Medium |

**Best choice: Render.com** - Native GitLab, free tier, easy setup!

Would you like me to help with Render setup?
