# Add GitHub Remote - Quick Commands

After creating your GitHub repository, run these:

```powershell
# Add GitHub as a second remote (replace YOUR-USERNAME with your GitHub username)
git remote add github https://github.com/YOUR-USERNAME/shakytails_barcode_scanner.git

# Push to GitHub
git push github main

# Verify both remotes
git remote -v
```

Now you'll have:
- **origin** → GitLab (existing)
- **github** → GitHub (new)

## Push to Both at Once (Optional)

To push to both GitLab and GitHub with one command:

```powershell
# Configure origin to push to both
git remote set-url --add --push origin https://gitlab.com/kiranpatil9762/shakytails_barcode_scanner.git
git remote set-url --add --push origin https://github.com/YOUR-USERNAME/shakytails_barcode_scanner.git

# Now this pushes to BOTH:
git push origin main
```

## Deploy from GitHub

After pushing to GitHub:

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose: `shakytails_barcode_scanner`
5. Railway auto-deploys!

Done! 🎉
