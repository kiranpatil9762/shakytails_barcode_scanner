# 🚀 Simple Subdomain Setup - app.shakytails.com

Your sites will work like this:
- **shakytails.com** → Main website (Hostinger - unchanged)
- **app.shakytails.com** → QR Pet ID System (Railway - new)

---

## Step 1: Deploy to Railway (10 minutes)

### 1.1 Sign Up & Deploy
1. Go to https://railway.app
2. Sign up with GitHub or Email
3. Click **"New Project"**
4. Select **"Deploy from GitLab"**
5. Connect your GitLab account
6. Select repository: `shakytails_barcode_scanner`
7. Railway automatically deploys! ✅

### 1.2 Generate Secrets (IMPORTANT!)

**Generate JWT Secret:**
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output - you'll need it!

**Get Gmail App Password:**
1. Visit: https://myaccount.google.com/apppasswords
2. Login with: theshakytails@gmail.com
3. Create new app password
4. Copy the 16-character password

### 1.3 Configure Environment Variables

In Railway Dashboard → Your Project → **Variables** tab, add these:

```env
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shakytails?retryWrites=true&w=majority

# JWT Secret (paste the one you generated above!)
JWT_SECRET=paste_your_generated_64_character_secret_here
JWT_EXPIRE=7d
JWT_RESET_EXPIRE=10m

# Email Settings (use Gmail app password!)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=theshakytails@gmail.com
EMAIL_PASS=paste_your_gmail_app_password_here
EMAIL_FROM=ShakyTails <theshakytails@gmail.com>

# Domain URLs
BASE_URL=https://app.shakytails.com
FRONTEND_URL=https://app.shakytails.com

# Admin Credentials
ADMIN_EMAIL=theshakytails@gmail.com
ADMIN_PASSWORD=your_secure_admin_password

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Click "Deploy"** - Railway will redeploy with new settings!

Railway gives you a temporary URL like: `shakytails-production.up.railway.app`

---

## Step 2: Configure DNS (5 minutes)

### 2.1 Login to Your Domain Registrar
- GoDaddy, Namecheap, Hostinger DNS, or wherever you bought shakytails.com

### 2.2 Add DNS Record

Go to **DNS Management** for shakytails.com and add:

```
Type: CNAME
Name: app
Value: shakytails-production.up.railway.app
TTL: 3600 (or Automatic)
```

**Important:** Use the Railway URL WITHOUT `https://`

### 2.3 Wait for DNS Propagation
- Usually takes 5-30 minutes
- Check progress: https://dnschecker.org (enter: app.shakytails.com)

---

## Step 3: Add Custom Domain in Railway (2 minutes)

### 3.1 In Railway Dashboard:
1. Go to your project
2. Click **Settings** tab
3. Scroll to **Domains** section
4. Click **"Add Domain"**
5. Enter: `app.shakytails.com`
6. Click **"Add"**

### 3.2 SSL Certificate
- Railway automatically provisions FREE SSL certificate
- Takes 5-10 minutes
- Your site will be HTTPS automatically! 🔒

---

## Step 4: Test Everything (5 minutes)

### 4.1 Test API
Visit: https://app.shakytails.com/health

Should see:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### 4.2 Test QR Landing Page
Visit: https://app.shakytails.com

Should see the QR scanner/registration page

### 4.3 Test Admin Dashboard
Visit: https://app.shakytails.com/admin-dashboard.html

Login with:
- Email: theshakytails@gmail.com
- Password: [Your Admin Password]

### 4.4 Test QR Generator
Visit: https://app.shakytails.com/admin-qr-generator.html

Generate a test QR code and download it

### 4.5 Test QR Scanning
1. Scan the QR code you generated
2. Should redirect to: https://app.shakytails.com/?qr=YOUR-CODE
3. Test registration flow
4. Test pet profile viewing
5. Test image upload
6. Test WhatsApp location sharing

---

## 🎯 Final Result

Your domain structure:
```
shakytails.com
├── / → Your main website (Hostinger)
└── app.shakytails.com
    ├── / → QR Landing Page
    ├── /admin-dashboard.html → Admin Panel
    ├── /admin-qr-generator.html → QR Generator
    └── /api/* → Backend API
```

---

## 📱 QR Code URLs

All your QR codes will redirect to:
```
https://app.shakytails.com/?qr=QR-CODE-ID
```

When you generate QR codes, the system automatically uses the correct domain!

---

## 💰 Costs

| Service | Cost | Notes |
|---------|------|-------|
| Railway | $0-5/mo | Free tier: 500 hours/month (~21 days). $5/mo for 24/7 |
| Domain | $0 | You already own it! |
| MongoDB | $0 | Atlas free tier |
| SSL | $0 | Included with Railway |
| **Total** | **$0-5/mo** | 🎉 |

---

## 🔐 Security Checklist

✅ Changed JWT_SECRET from default
✅ Using Gmail App Password (not regular password)
✅ MongoDB IP whitelist configured
✅ SSL/HTTPS enabled automatically
✅ Rate limiting active (100 req/15min per IP)
✅ Helmet security headers enabled
✅ Production-ready configuration

---

## 📊 Monitoring

### Railway Dashboard:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: Auto-deploy on git push
- **Domains**: SSL status and custom domains

### MongoDB Atlas:
- Login to: https://cloud.mongodb.com
- View database statistics
- Monitor connections
- Automatic daily backups included

---

## 🔄 Making Updates

Any time you make changes:

```powershell
git add .
git commit -m "Your update message"
git push origin main
```

Railway automatically detects the push and redeploys! ✨

---

## 🆘 Troubleshooting

### Issue: DNS not resolving
**Solution:** Wait 30 minutes, check dnschecker.org

### Issue: SSL not working
**Solution:** Wait 10 minutes after adding domain in Railway

### Issue: Can't login to admin
**Solution:** 
- Check ADMIN_EMAIL and ADMIN_PASSWORD in Railway variables
- Try clearing browser cache
- Check browser console for errors

### Issue: MongoDB connection error
**Solution:**
- Verify MONGODB_URI in Railway variables
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0)
- Verify MongoDB user has read/write permissions

### Issue: Emails not sending
**Solution:**
- Verify EMAIL_PASS is Gmail App Password (not regular password)
- Check Gmail account settings
- View Railway logs for email errors

### Issue: Image upload failing
**Solution:**
- Check Railway logs for multer errors
- Verify file size < 5MB
- Ensure uploads directory exists (Railway creates automatically)

---

## ✅ You're Live!

Your QR Pet ID System is now running on **app.shakytails.com**! 🎉

**Next Steps:**
1. Print QR codes from the generator
2. Attach them to pet tags
3. Share the system with pet owners
4. Monitor usage in admin dashboard
5. Watch your business grow! 🚀

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
- DNS Help: https://dnschecker.org

Your main website stays untouched on shakytails.com! 🐾
