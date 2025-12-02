# 🌐 Path-Based Setup: Main Website + QR System

Your domain will work like this:

## URLs:
- **https://shakytails.com** → Your main marketing website (from Hostinger)
- **https://shakytails.com/qr** → QR Pet ID System (from Railway)
- **https://shakytails.com/qr/admin-dashboard.html** → Admin panel
- **https://shakytails.com/qr/admin-qr-generator.html** → QR generator

---

## Setup Steps:

### 1️⃣ Deploy QR System to Railway (10 min)

1. Go to https://railway.app
2. Sign up/login with GitHub or email
3. Click "New Project" → "Deploy from GitLab"
4. Connect GitLab and select `shakytails_barcode_scanner`
5. Railway auto-deploys your code

### 2️⃣ Configure Railway Environment (5 min)

In Railway Dashboard → Your Project → Variables tab, add:

```env
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shakytails?retryWrites=true&w=majority

# JWT (IMPORTANT: Generate new secret!)
JWT_SECRET=RUN_THIS_COMMAND_TO_GENERATE: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_EXPIRE=7d
JWT_RESET_EXPIRE=10m

# Email (IMPORTANT: Get Gmail App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=theshakytails@gmail.com
EMAIL_PASS=GET_FROM_https://myaccount.google.com/apppasswords
EMAIL_FROM=ShakyTails <theshakytails@gmail.com>

# Domain
BASE_URL=https://shakytails.com
FRONTEND_URL=https://shakytails.com

# Admin
ADMIN_EMAIL=theshakytails@gmail.com
ADMIN_PASSWORD=your_secure_admin_password
```

**Railway gives you a URL like:** `shakytails-production.up.railway.app`

### 3️⃣ Keep Your Hostinger Website (2 min)

Your existing website stays on Hostinger. Just keep it as is.

### 4️⃣ Configure DNS & Reverse Proxy (Option A: Recommended)

#### At your domain registrar:
```
Type: A or CNAME (keep existing for main site)
Name: @
Value: [Your Hostinger IP/domain]

Type: CNAME
Name: api
Value: shakytails-production.up.railway.app
```

#### On Hostinger (in .htaccess or Nginx config):
Add this to proxy `/qr` and `/api` paths to Railway:

**If using Apache (.htaccess):**
```apache
RewriteEngine On

# Proxy API calls to Railway
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ https://shakytails-production.up.railway.app/$1 [P,L]

# Proxy QR system to Railway
RewriteCond %{REQUEST_URI} ^/qr/
RewriteRule ^qr/(.*)$ https://shakytails-production.up.railway.app/qr/$1 [P,L]

# Proxy uploads and QR codes
RewriteCond %{REQUEST_URI} ^/(uploads|qrcodes)/
RewriteRule ^(.*)$ https://shakytails-production.up.railway.app/$1 [P,L]
```

**If using Nginx:**
```nginx
location /api/ {
    proxy_pass https://shakytails-production.up.railway.app;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /qr/ {
    proxy_pass https://shakytails-production.up.railway.app;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location ~ ^/(uploads|qrcodes)/ {
    proxy_pass https://shakytails-production.up.railway.app;
    proxy_set_header Host $host;
}
```

---

### 5️⃣ Alternative: Use Subdomain (Easier!)

If you can't configure reverse proxy, use a subdomain instead:

**DNS Configuration:**
```
Type: CNAME
Name: app
Value: shakytails-production.up.railway.app
```

**Then access as:**
- Main site: https://shakytails.com
- QR System: https://app.shakytails.com

Update .env:
```env
BASE_URL=https://app.shakytails.com
FRONTEND_URL=https://app.shakytails.com
```

---

## 🧪 Testing:

### Test API:
```bash
curl https://shakytails.com/api/
# or
curl https://app.shakytails.com/
```

### Test QR System:
Visit: https://shakytails.com/qr (or https://app.shakytails.com)

### Test Admin:
Visit: https://shakytails.com/qr/admin-dashboard.html

---

## 📱 QR Code URLs:

Your QR codes will redirect to:
```
https://shakytails.com/qr?qr=QR-CODE-HERE
```
or with subdomain:
```
https://app.shakytails.com/?qr=QR-CODE-HERE
```

---

## 🎯 Recommendation:

**Use Subdomain (app.shakytails.com)** - It's much simpler!

Pros:
✅ No need to configure reverse proxy
✅ Clean separation of services
✅ Easier SSL management
✅ Independent deployments
✅ Can update main site without affecting QR system

Path-based routing requires server configuration that may not be available on shared hosting.

---

## 💰 Cost:

- Railway: FREE (500 hrs/month) or $5/month for 24/7
- Domain: Already have it!
- Hostinger: Keep your existing plan

---

## 🚀 Quick Deploy Checklist:

- [ ] Generate JWT_SECRET with crypto command
- [ ] Get Gmail App Password
- [ ] Deploy to Railway
- [ ] Set all environment variables in Railway
- [ ] Choose: subdomain (easier) or path-based (requires proxy setup)
- [ ] Configure DNS accordingly
- [ ] Test all features
- [ ] Update QR codes if needed

Your main website and QR system will work perfectly together! 🎉
