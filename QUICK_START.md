# 🚀 Quick Start - Go Live in 15 Minutes

## ✅ Pre-Deployment (5 minutes)

1. **Generate Strong Secrets**:
   ```bash
   # Generate JWT Secret (run in terminal)
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy this for JWT_SECRET

2. **MongoDB Atlas**:
   - Login to MongoDB Atlas
   - Get your connection string
   - Add `0.0.0.0/0` to IP whitelist (or your server IP)

3. **Gmail App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Generate new app password
   - Copy for EMAIL_PASS

---

## 🌐 Deploy on Railway (Fastest - 10 minutes)

### Step 1: Push to GitLab (Already Done ✅)

### Step 2: Railway Deployment
1. Go to: https://railway.app
2. Click "Start a New Project"
3. Choose "Deploy from GitLab repo"
4. Select `shakytails_barcode_scanner`
5. Railway auto-detects and deploys!

### Step 3: Set Environment Variables
Click on your project → Variables → Raw Editor, paste:

```env
NODE_ENV=production
PORT=5000

# Your MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shakytails

# Generate this with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_generated_64_character_secret_here
JWT_EXPIRE=7d
JWT_RESET_EXPIRE=10m

# Gmail settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=theshakytails@gmail.com
EMAIL_PASS=your_gmail_app_password_here
EMAIL_FROM=ShakyTails <theshakytails@gmail.com>

# Your Railway URL (get this after first deployment)
BASE_URL=https://shakytails-production.up.railway.app
FRONTEND_URL=https://shakytails-production.up.railway.app

# Admin login
ADMIN_EMAIL=theshakytails@gmail.com
ADMIN_PASSWORD=YourStrongPassword123!

# Optional rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Get Your URL
- After deployment, Railway gives you a URL like: `https://shakytails-production.up.railway.app`
- Update BASE_URL and FRONTEND_URL with this URL

### Step 5: Update Frontend URLs
Edit these files and change `API_BASE`:

**public/qr-landing.html** (line ~577):
```javascript
const API_BASE = 'https://your-railway-url.up.railway.app';
```

**public/admin-dashboard.html** (line ~375):
```javascript
const API_BASE = 'https://your-railway-url.up.railway.app';
```

**public/admin-qr-generator.html**:
```javascript
const API_BASE = 'https://your-railway-url.up.railway.app';
```

Then commit and push:
```bash
git add .
git commit -m "Update API URLs for production"
git push origin main
```

Railway will auto-deploy the update!

---

## 🎯 Test Your Deployment

1. **Test API**: Visit `https://your-url.railway.app/`
   - Should see: "Welcome to ShakyTails API"

2. **Test Admin Login**: Visit `https://your-url.railway.app/admin-dashboard.html`
   - Login with your ADMIN_EMAIL and ADMIN_PASSWORD

3. **Generate QR Codes**: Visit `https://your-url.railway.app/admin-qr-generator.html`
   - Generate test QR codes

4. **Test QR Scanning**: 
   - Scan a QR code or visit: `https://your-url.railway.app/qr-landing.html?qr=YOUR-QR-CODE`
   - Test registration and pet profile

---

## 🌍 Custom Domain (Optional)

### Railway:
1. Project Settings → Domains
2. Add custom domain: `shakytails.com`
3. Update DNS:
   - Type: CNAME
   - Name: @
   - Value: your-app.up.railway.app

### Update URLs:
```bash
BASE_URL=https://shakytails.com
FRONTEND_URL=https://shakytails.com
```

---

## 📊 Monitor Your App

### Railway Dashboard:
- **Logs**: View real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: See deployment history

### Check Health:
```bash
curl https://your-url.railway.app/
```

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to MongoDB"
- Check MongoDB Atlas IP whitelist
- Verify MONGODB_URI is correct
- Check MongoDB Atlas user permissions

### Issue: "Failed to send email"
- Verify Gmail App Password is correct
- Check EMAIL_USER and EMAIL_PASS
- Ensure less secure app access is enabled

### Issue: "Admin login not working"
- Check ADMIN_EMAIL and ADMIN_PASSWORD in env variables
- Verify JWT_SECRET is set
- Check browser console for errors

---

## ✅ You're Live!

Your ShakyTails system is now live at:
- **Main Site**: https://your-url.railway.app
- **Admin Dashboard**: https://your-url.railway.app/admin-dashboard.html
- **QR Generator**: https://your-url.railway.app/admin-qr-generator.html

All QR codes will automatically point to your live URL! 🎉

---

## 📈 Next Steps

1. **Print QR Codes**: Use admin panel to generate and download
2. **Share with Customers**: Start selling QR pet tags
3. **Monitor**: Check Railway dashboard regularly
4. **Backup**: MongoDB Atlas handles automatic backups
5. **Scale**: Railway scales automatically as you grow

**Cost**: Railway free tier gives 500 hours/month (enough for 24/7 for ~21 days)
After that, it's ~$5/month for continuous uptime.

---

Need help? Check DEPLOYMENT.md for detailed instructions!
