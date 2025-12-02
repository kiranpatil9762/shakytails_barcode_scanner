# 🌐 Publishing ShakyTails on shakytails.com

## Option 1: Railway (Recommended - Easiest)

### Step 1: Deploy Backend to Railway
1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitLab"
3. Connect your GitLab account and select `shakytails_barcode_scanner`
4. Railway will auto-deploy your app

### Step 2: Configure Environment Variables
In Railway Dashboard → Variables, set:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://theshakytails:Shakytails%40123@shakytails.6rnpitz.mongodb.net/shakytails?retryWrites=true&w=majority
JWT_SECRET=generate_new_64_char_secret_run_node_crypto_randomBytes
JWT_EXPIRE=7d
JWT_RESET_EXPIRE=10m
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=theshakytails@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=ShakyTails <theshakytails@gmail.com>
BASE_URL=https://shakytails.com
FRONTEND_URL=https://shakytails.com
ADMIN_EMAIL=theshakytails@gmail.com
ADMIN_PASSWORD=your_secure_admin_password
```

### Step 3: Get Railway Domain
Railway gives you: `https://shakytails-production.up.railway.app`

### Step 4: Point shakytails.com to Railway

#### Configure DNS at Your Domain Registrar:
1. Login to your domain registrar (GoDaddy, Namecheap, etc.)
2. Go to DNS Management for shakytails.com
3. Add these DNS records:

**For Railway:**
```
Type: CNAME
Name: @ (or leave empty for root domain)
Value: shakytails-production.up.railway.app
TTL: Automatic or 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: shakytails-production.up.railway.app
TTL: Automatic or 3600
```

### Step 5: Add Custom Domain in Railway
1. Railway Dashboard → Settings → Domains
2. Click "Add Domain"
3. Enter: `shakytails.com`
4. Railway will provision SSL certificate automatically (5-10 minutes)

### Step 6: Update Frontend URLs
Update API_BASE in these files:

**public/qr-landing.html:**
```javascript
const API_BASE = 'https://shakytails.com';
```

**public/admin-dashboard.html:**
```javascript
const API_BASE = 'https://shakytails.com';
```

**public/admin-qr-generator.html:**
```javascript
const API_BASE = 'https://shakytails.com';
```

Commit and push:
```bash
git add .
git commit -m "Update to production domain shakytails.com"
git push origin main
```

Railway auto-deploys! ✅

---

## Option 2: VPS Hosting (Full Control)

### Recommended VPS Providers:
- **DigitalOcean** ($6/month) - Best for beginners
- **Vultr** ($6/month) - Fast global network
- **Linode** ($5/month) - Great documentation
- **AWS Lightsail** ($5/month) - Scalable

### Step 1: Setup VPS
1. Create Ubuntu 22.04 server
2. SSH into your server:
   ```bash
   ssh root@your-server-ip
   ```

### Step 2: Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (web server)
apt install -y nginx

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

### Step 3: Clone Your Code
```bash
cd /var/www
git clone https://gitlab.com/kiranpatil9762/shakytails_barcode_scanner.git shakytails
cd shakytails
npm install --production
```

### Step 4: Setup Environment
```bash
nano .env
```
Paste your production .env (update JWT_SECRET and passwords):
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shakytails?retryWrites=true&w=majority
JWT_SECRET=your_new_64_character_secret_here
JWT_EXPIRE=7d
JWT_RESET_EXPIRE=10m
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=theshakytails@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=ShakyTails <theshakytails@gmail.com>
BASE_URL=https://shakytails.com
FRONTEND_URL=https://shakytails.com
ADMIN_EMAIL=theshakytails@gmail.com
ADMIN_PASSWORD=your_secure_admin_password
```

### Step 5: Start with PM2
```bash
# Create necessary directories
mkdir -p public/uploads public/qrcodes logs

# Start app
pm2 start server.js --name shakytails
pm2 save
pm2 startup
```

### Step 6: Configure Nginx
```bash
nano /etc/nginx/sites-available/shakytails
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name shakytails.com www.shakytails.com;

    # Redirect HTTP to HTTPS (will be configured after SSL)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name shakytails.com www.shakytails.com;

    # SSL certificates (will be added by certbot)
    ssl_certificate /etc/letsencrypt/live/shakytails.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/shakytails.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client upload limit (for images)
    client_max_body_size 10M;

    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /uploads {
        alias /var/www/shakytails/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /qrcodes {
        alias /var/www/shakytails/public/qrcodes;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/shakytails /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 7: Point Domain to VPS

#### Configure DNS:
1. Login to your domain registrar
2. Go to DNS Management
3. Add these records:

```
Type: A
Name: @
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600

Type: A
Name: www
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600
```

Wait 5-30 minutes for DNS propagation.

### Step 8: Setup SSL Certificate
```bash
# Get SSL certificate from Let's Encrypt (FREE)
certbot --nginx -d shakytails.com -d www.shakytails.com

# Follow prompts:
# - Enter your email
# - Agree to terms
# - Choose redirect HTTP to HTTPS: Yes

# Auto-renewal is configured automatically!
# Test renewal:
certbot renew --dry-run
```

### Step 9: Firewall Setup
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## Option 3: Heroku (Simple but Paid)

### Deploy:
```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create shakytails-backend

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shakytails"
heroku config:set JWT_SECRET="your_new_secret"
heroku config:set BASE_URL="https://shakytails.com"
heroku config:set FRONTEND_URL="https://shakytails.com"
# ... add all other env vars

# Deploy
git push heroku main

# Add custom domain
heroku domains:add shakytails.com
heroku domains:add www.shakytails.com
```

Configure DNS:
```
Type: CNAME
Name: @
Value: shakytails-backend.herokuapp.com
```

---

## 🎯 Testing Your Deployment

### 1. Test API
```bash
curl https://shakytails.com/
```
Should return: "Welcome to ShakyTails API"

### 2. Test Admin Dashboard
Visit: https://shakytails.com/admin-dashboard.html
Login with: theshakytails@gmail.com / [Your Admin Password]

### 3. Test QR Generator
Visit: https://shakytails.com/admin-qr-generator.html
Generate a test QR code

### 4. Test QR Scanning
Visit: https://shakytails.com/qr-landing.html?qr=YOUR-TEST-CODE
Test registration and profile viewing

### 5. Test Image Upload
- Login as pet owner
- Try uploading a pet image
- Verify image displays correctly

### 6. Test WhatsApp Location
- View a pet profile
- Click "Share Location"
- Verify WhatsApp opens with pre-filled message

---

## 📊 Post-Launch Monitoring

### Railway:
- Dashboard shows logs, metrics, deployments
- Auto-scales based on traffic
- Free tier: 500 hours/month (~21 days)
- Paid: $5/month for 24/7

### VPS:
- Monitor with PM2: `pm2 monit`
- View logs: `pm2 logs shakytails`
- Restart: `pm2 restart shakytails`
- Check Nginx: `systemctl status nginx`
- View Nginx logs: `tail -f /var/log/nginx/error.log`

---

## 🔐 Security Checklist

✅ Change JWT_SECRET to random 64-character string
✅ Use Gmail App Password (not regular password)
✅ MongoDB IP whitelist updated
✅ SSL certificate installed (HTTPS)
✅ Rate limiting active (100 req/15min)
✅ Helmet security headers enabled
✅ Regular backups (MongoDB Atlas auto-backup)

---

## 💰 Cost Comparison

| Platform | Monthly Cost | Setup Time | Best For |
|----------|-------------|------------|----------|
| Railway | $0-5 | 15 min | Fastest, auto-deploy |
| DigitalOcean | $6 | 30 min | Full control, learning |
| Vultr | $6 | 30 min | Global performance |
| Heroku | $7 | 20 min | Simple, managed |

---

## 🚀 Recommended: Railway + shakytails.com

**Why Railway?**
- Connects directly to GitLab
- Auto-deploys on every push
- Free SSL certificate
- Easy custom domain setup
- Built-in monitoring
- Free tier available
- Scales automatically

**Steps:**
1. Deploy to Railway (10 min)
2. Point DNS to Railway (5 min)
3. Add custom domain in Railway (5 min)
4. Update frontend URLs (2 min)
5. Push to GitLab (auto-deploys)

**Total time: 22 minutes** ⚡

---

## 📞 Need Help?

**DNS Issues:**
- DNS can take 5-30 minutes to propagate
- Check with: https://dnschecker.org
- Enter: shakytails.com

**SSL Issues:**
- Railway auto-provisions SSL (5-10 min)
- VPS: Run `certbot renew --dry-run` to test

**Deployment Issues:**
- Check logs in Railway dashboard
- VPS: `pm2 logs shakytails`

---

Your shakytails.com will be live! 🎉🐾
