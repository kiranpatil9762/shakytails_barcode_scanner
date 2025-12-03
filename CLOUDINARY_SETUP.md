# 📸 Cloudinary Setup Guide

## Why Cloudinary?
- **Free tier**: 25GB storage, 25GB bandwidth/month
- **No MongoDB storage**: Images stored in the cloud, not your database
- **Railway compatible**: Files persist across deployments
- **Automatic optimization**: Images auto-compressed and optimized

---

## 🚀 Setup Steps (5 minutes)

### Step 1: Create Cloudinary Account
1. Go to: https://cloudinary.com/users/register_free
2. Sign up with email (or Google)
3. Choose **Free Plan** (no credit card needed)

### Step 2: Get Your Credentials
After signup, you'll see your dashboard with:
```
Cloud Name: dxxxxxx
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz
```

### Step 3: Update Local .env File
Open `.env` and update:
```env
CLOUDINARY_CLOUD_NAME=dxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### Step 4: Update Railway Environment Variables
1. Go to Railway Dashboard → Your Project → **Variables**
2. Add these 3 variables:
   ```
   CLOUDINARY_CLOUD_NAME=dxxxxxx
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
   ```
3. Click **Redeploy**

---

## ✅ What's Changed

### Before (Local Storage - ❌ Broken on Railway)
- Images saved to `/public/uploads/`
- Files deleted on every Railway deployment
- Used disk storage (ephemeral on Railway)

### After (Cloudinary - ✅ Works Everywhere)
- Images uploaded to Cloudinary cloud
- Permanent URLs like: `https://res.cloudinary.com/dxxxxxx/image/upload/v1234567890/shakytails/abc123.jpg`
- No local storage needed
- Automatic image optimization

---

## 📊 Free Tier Limits
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited

**Estimate**: 25GB = ~25,000 high-quality pet photos!

---

## 🔧 How It Works Now

### Image Upload Flow:
1. User uploads pet photo
2. File sent to Cloudinary API
3. Cloudinary stores image and returns URL
4. URL saved in MongoDB (not the image file)
5. Frontend displays image from Cloudinary URL

### Example MongoDB Entry:
```json
{
  "petName": "Max",
  "profileImage": "https://res.cloudinary.com/dxxxxxx/image/upload/v1733184000/shakytails/image-123456.jpg"
}
```

Only the **URL** is stored in MongoDB (tiny text), not the image!

---

## 🛠️ Testing

After setup, upload a pet photo:
1. Go to your app
2. Register/login
3. Create pet with photo
4. Photo URL should be: `https://res.cloudinary.com/...`
5. Check Cloudinary dashboard → Media Library → You'll see the uploaded image!

---

## 🚨 Important Notes

1. **Don't commit .env**: Your API secret is sensitive
2. **Use Railway variables**: Set Cloudinary credentials in Railway dashboard
3. **Old images**: Existing `/uploads/` images won't migrate automatically
4. **Folder**: All images go to `shakytails` folder on Cloudinary

---

## 📈 Benefits Summary

| Feature | Local Storage | Cloudinary |
|---------|---------------|------------|
| Railway Compatible | ❌ No | ✅ Yes |
| Persistent Storage | ❌ No | ✅ Yes |
| MongoDB Space Used | N/A | 0 bytes |
| Auto Optimization | ❌ No | ✅ Yes |
| CDN Delivery | ❌ No | ✅ Yes |
| Cost | Free | Free (25GB) |

---

## 🆘 Troubleshooting

### Error: "Invalid cloud name"
- Check `CLOUDINARY_CLOUD_NAME` spelling in Railway variables
- Redeploy after updating variables

### Error: "Invalid API credentials"
- Verify `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`
- Make sure no extra spaces in Railway variables

### Images not showing
- Check Network tab in browser dev tools
- URL should start with `https://res.cloudinary.com/`
- If it's `/uploads/`, Cloudinary isn't configured

### Still using local storage?
- Restart app after updating `.env`
- Clear browser cache
- Check Railway logs: `Successfully connected to Cloudinary`

---

## 🎯 Next Steps

1. Sign up for Cloudinary (2 min)
2. Copy credentials (1 min)
3. Update Railway variables (2 min)
4. Test upload (1 min)
5. ✅ Done!

Your images will now persist forever, and you'll save all your MongoDB storage for actual data! 🎉
