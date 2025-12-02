# 🚀 ShakyTails - Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Security
- [ ] Change JWT_SECRET to a strong random string (min 32 characters)
- [ ] Change ADMIN_PASSWORD to a strong password
- [ ] Update MongoDB credentials
- [ ] Enable MongoDB IP whitelist for production
- [ ] Set up Gmail App Password for email

### 2. Environment Variables
- [ ] Copy `.env.production` to `.env` on server
- [ ] Update BASE_URL to your domain
- [ ] Update FRONTEND_URL to your domain
- [ ] Set NODE_ENV=production

### 3. Database
- [ ] MongoDB Atlas cluster created
- [ ] Network access configured (IP whitelist)
- [ ] Database user created with proper permissions
- [ ] Backup strategy in place

---

## 🌐 Deployment Options

### Option 1: Railway (Recommended - Free Tier Available)

1. **Sign up**: https://railway.app
2. **Deploy from GitHub/GitLab**:
   ```bash
   # Push your code to GitLab (already done)
   ```
3. **Connect Repository**:
   - New Project → Deploy from GitLab
   - Select `shakytails_barcode_scanner`
   - Railway auto-detects Node.js

4. **Set Environment Variables**:
   - Go to Project → Variables
   - Add all variables from `.env.production`
   
5. **Deploy**:
   - Railway automatically builds and deploys
   - Get your URL: `https://your-app.railway.app`

6. **Custom Domain** (Optional):
   - Settings → Domains → Add Custom Domain
   - Point your domain DNS to Railway

---

### Option 2: Render (Free Tier Available)

1. **Sign up**: https://render.com
2. **Create Web Service**:
   - New → Web Service
   - Connect GitLab repository
   - Select `shakytails_barcode_scanner`

3. **Configure**:
   - **Name**: shakytails-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables**:
   - Add all from `.env.production`

5. **Deploy**:
   - Click "Create Web Service"
   - URL: `https://shakytails-api.onrender.com`

---

### Option 3: Heroku

1. **Install Heroku CLI**: https://devcli.heroku.com/install

2. **Login and Create App**:
   ```bash
   heroku login
   heroku create shakytails-api
   ```

3. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_secret
   # ... add all other variables
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

5. **Open App**:
   ```bash
   heroku open
   ```

---

### Option 4: DigitalOcean App Platform

1. **Sign up**: https://www.digitalocean.com
2. **Create App**:
   - Apps → Create App → GitLab
   - Select repository

3. **Configure**:
   - Detected as Node.js automatically
   - Add environment variables
   - Choose $5/month plan or Free tier

4. **Deploy**: Click "Create Resources"

---

### Option 5: VPS (AWS EC2, DigitalOcean Droplet, etc.)

1. **Setup Server**:
   ```bash
   # SSH into your server
   ssh user@your-server-ip

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone Repository**:
   ```bash
   git clone https://gitlab.com/kiranpatil9762/shakytails_barcode_scanner.git
   cd shakytails_barcode_scanner
   npm install
   ```

3. **Setup Environment**:
   ```bash
   nano .env
   # Paste production environment variables
   ```

4. **Start with PM2**:
   ```bash
   pm2 start server.js --name shakytails
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx Reverse Proxy**:
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/shakytails
   ```

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/shakytails /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **SSL Certificate (HTTPS)**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔧 Post-Deployment Configuration

### 1. Update Frontend URLs
After deployment, update these files with your production URL:

**qr-landing.html** (line ~577):
```javascript
const API_BASE = 'https://your-production-url.com';
```

**admin-dashboard.html** (line ~375):
```javascript
const API_BASE = 'https://your-production-url.com';
```

**admin-qr-generator.html**:
```javascript
const API_BASE = 'https://your-production-url.com';
```

### 2. Test Production
- [ ] Test QR code scanning
- [ ] Test pet registration
- [ ] Test owner login and editing
- [ ] Test image upload
- [ ] Test WhatsApp location sharing
- [ ] Test admin dashboard login
- [ ] Test QR code generation

### 3. DNS Configuration (If using custom domain)
Point your domain to deployment:
- **Type**: A Record or CNAME
- **Name**: @ or www
- **Value**: Your deployment URL or IP

---

## 📊 Monitoring & Maintenance

### Logs
- **Railway**: Project → Deployments → View Logs
- **Render**: Dashboard → Logs
- **Heroku**: `heroku logs --tail`
- **PM2**: `pm2 logs shakytails`

### Database Backups
- MongoDB Atlas → Clusters → Backup
- Schedule automatic backups

### Updates
```bash
git pull origin main
npm install
pm2 restart shakytails  # If using PM2
```

---

## 🌍 Domain Setup

### Update QR Codes
After going live, your QR codes will point to:
```
https://yourdomain.com/qr-landing.html?qr=QR-CODE-ID
```

All previously generated QR codes will automatically work with the new domain!

---

## 💰 Cost Estimate

| Platform | Free Tier | Paid |
|----------|-----------|------|
| Railway | 500 hours/month free | $5/month |
| Render | 750 hours/month free | $7/month |
| Heroku | No free tier | $7/month |
| DigitalOcean | Free tier available | $5/month |
| VPS | - | $5-10/month |

**Recommended for production**: Railway or Render (easier setup) or VPS (more control)

---

## 🆘 Support

If you encounter issues:
1. Check logs for errors
2. Verify all environment variables are set
3. Ensure MongoDB connection is working
4. Check firewall/security group settings
5. Verify domain DNS propagation (24-48 hours)

---

## ✅ You're Ready!

Your ShakyTails system is production-ready with all features:
- ✅ Pet QR code registration
- ✅ Owner dashboard with image upload
- ✅ Admin monitoring dashboard
- ✅ WhatsApp location sharing
- ✅ Email notifications
- ✅ QR code inventory management
