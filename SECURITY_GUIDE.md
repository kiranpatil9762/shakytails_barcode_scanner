# 🔐 Security Implementation Guide for ShakyTails

## ✅ What I've Implemented

### 1. **NoSQL Injection Protection**
- Installed `express-mongo-sanitize` to prevent MongoDB injection attacks
- Sanitizes user input to remove `$` and `.` operators

### 2. **Enhanced Security Headers**
- Configured Content Security Policy (CSP) properly
- Enabled HSTS (HTTP Strict Transport Security)
- Cross-Origin protection

### 3. **Parameter Pollution Prevention**
- Middleware to prevent duplicate query parameters

### 4. **Payload Size Limits**
- Limited request body size to 10MB to prevent DoS attacks

---

## 🚨 CRITICAL: Actions You Need to Take NOW

### 1. **Set Up Railway Environment Variables** (MOST IMPORTANT)
Never store credentials in `.env` file when deploying. Use Railway's environment variables:

**Steps:**
1. Go to Railway Dashboard: https://railway.app/dashboard
2. Select your project: `shakytails_barcode_scanner`
3. Go to **Variables** tab
4. Add these variables (copy from your `.env` file):

```
MONGODB_URI = mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shakytails?retryWrites=true&w=majority
JWT_SECRET = your_super_secret_jwt_key_change_this_in_production
EMAIL_USER = theshakytails@gmail.com
EMAIL_PASS = (use app password - see below)
ADMIN_EMAIL = theshakytails@gmail.com
ADMIN_PASSWORD = Shakytails@123
BASE_URL = https://web-production-d424.up.railway.app
NODE_ENV = production
```

5. Click **Redeploy** after adding variables

### 2. **Create Gmail App Password** (HIGH PRIORITY)
Current password `shakytails@123` is your regular Gmail password - NOT secure!

**Steps:**
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already)
3. Click on **App passwords**
4. Select **Mail** and **Other (Custom name)** → Type "ShakyTails"
5. Google will generate a 16-character password like `abcd efgh ijkl mnop`
6. Update in Railway Variables: `EMAIL_PASS = abcdefghijklmnop` (no spaces)

### 3. **Secure MongoDB Database**

**a) Enable IP Whitelist:**
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Navigate to **Network Access**
3. Remove `0.0.0.0/0` (allows all IPs)
4. Add Railway's IP addresses (get from Railway logs)
5. Or use: `0.0.0.0/0` temporarily but enable **Database Access** authentication

**b) Rotate Database Password:**
1. MongoDB Atlas → **Database Access**
2. Edit user `theshakytails`
3. Click **Edit Password** → Generate new secure password
4. Update `MONGODB_URI` in Railway Variables with new password

**c) Enable Audit Logs:**
1. MongoDB Atlas → **Database** → **Advanced Settings**
2. Enable **Database Auditing**

### 4. **Generate Strong JWT Secret**
Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and update `JWT_SECRET` in Railway Variables.

### 5. **Update Admin Password**
Change the default admin password:
1. Login to admin dashboard
2. Or directly update `ADMIN_PASSWORD` in Railway Variables with a strong password (16+ characters, mixed case, numbers, symbols)

---

## 📋 Security Checklist

### ✅ Already Done:
- [x] NoSQL injection protection (express-mongo-sanitize)
- [x] Security headers (Helmet with CSP)
- [x] Rate limiting (500 requests/15min general, 50/15min auth, 200/5min public)
- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] CORS configuration
- [x] Input validation in controllers
- [x] Parameter pollution prevention
- [x] Payload size limits

### 🔴 You Must Do:
- [ ] Move all secrets to Railway environment variables
- [ ] Set up Gmail App Password (not regular password)
- [ ] Enable MongoDB IP whitelisting
- [ ] Rotate MongoDB password
- [ ] Generate new JWT secret (64+ character random string)
- [ ] Change admin password
- [ ] Remove `.env` from git history (see below)

### 🟡 Recommended:
- [ ] Enable MongoDB audit logs
- [ ] Set up monitoring/alerts for suspicious activity
- [ ] Implement request logging (Morgan is already configured)
- [ ] Regular security audits with `npm audit`
- [ ] Keep dependencies updated

---

## 🗑️ Remove Secrets from Git History

Your `.env` file with real credentials might be in git history. Clean it:

```bash
# Make sure .env is in .gitignore
echo ".env" >> .gitignore

# Remove .env from git history (WARNING: rewrites history)
git filter-branch --force --index-filter \
"git rm --cached --ignore-unmatch .env" \
--prune-empty --tag-name-filter cat -- --all

# Force push (only if you're the only one using the repo)
git push origin --force --all
```

**Alternative (safer):** Rotate all passwords/secrets instead of cleaning history.

---

## 🔧 MongoDB Security Settings

### 1. **Connection String Options:**
Update your `MONGODB_URI` with these security parameters:

```
mongodb+srv://username:password@cluster.mongodb.net/shakytails?retryWrites=true&w=majority&authSource=admin&ssl=true&maxPoolSize=10&minPoolSize=2
```

### 2. **Database User Permissions:**
- Ensure `theshakytails` user has only `readWrite` role, not `dbAdmin` or `root`
- Create separate users for different access levels if needed

### 3. **Enable Network Encryption:**
Already enabled with `mongodb+srv://` (TLS/SSL)

---

## 🌐 Website Security Best Practices

### Current Security Measures:
1. **Helmet.js** - Sets secure HTTP headers
2. **Rate Limiting** - Prevents brute force attacks
3. **CORS** - Controls which domains can access your API
4. **JWT** - Secure authentication tokens
5. **Bcrypt** - Password hashing
6. **Express-Mongo-Sanitize** - NoSQL injection protection

### Additional Recommendations:
1. **HTTPS Only** - Railway provides this automatically
2. **Session Security** - JWT tokens expire (7 days for auth, 10 min for reset)
3. **Input Validation** - Already implemented in controllers
4. **Error Handling** - Avoid exposing stack traces in production

---

## 📊 Monitoring Security

### Check for vulnerabilities:
```bash
npm audit
npm audit fix  # Fix non-breaking changes
```

### Update dependencies regularly:
```bash
npm update
npm outdated  # Check for outdated packages
```

---

## 🆘 If Credentials Are Compromised

1. **Immediately rotate** all passwords:
   - MongoDB database password
   - Admin password
   - Email password
   
2. **Revoke JWT tokens:**
   - Change `JWT_SECRET` in Railway Variables
   - All users will need to log in again

3. **Check MongoDB logs:**
   - Look for suspicious queries or connections
   
4. **Enable MongoDB audit logs**
   - Track who accessed what data

---

## 📞 Quick Reference

**Railway Dashboard:** https://railway.app/dashboard  
**MongoDB Atlas:** https://cloud.mongodb.com/  
**Google Account Security:** https://myaccount.google.com/security  
**Your App:** https://web-production-d424.up.railway.app  

**Current Rate Limits:**
- General API: 500 requests / 15 minutes
- Authentication: 50 requests / 15 minutes  
- Public QR Scanning: 200 requests / 5 minutes

---

## ✨ Summary

Your application is now **more secure** with:
- NoSQL injection protection
- Enhanced security headers
- Parameter pollution prevention
- Better CSP configuration

**Next critical steps:**
1. Move all credentials to Railway environment variables
2. Set up Gmail App Password
3. Enable MongoDB IP whitelisting
4. Rotate all passwords
5. Generate new JWT secret

Once you complete these steps, your application will be **production-ready and secure**! 🚀
