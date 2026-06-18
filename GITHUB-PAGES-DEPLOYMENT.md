# GitHub Pages Deployment Guide

This guide will help you deploy the IBM watsonx Challenge Ideas Tracker to GitHub Pages so your team can access it via a URL.

## 📋 Prerequisites

- A GitHub account (free at https://github.com)
- Git installed on your computer (download from https://git-scm.com)
- Basic familiarity with command line (or use GitHub Desktop)

## 🚀 Deployment Steps

### Option A: Using Command Line (Recommended)

#### Step 1: Create a GitHub Repository

1. Go to https://github.com and sign in
2. Click the "+" icon in the top right → "New repository"
3. Repository settings:
   - **Name**: `watsonx-challenge-tracker` (or your preferred name)
   - **Description**: "IBM watsonx Challenge Ideas Tracker"
   - **Visibility**: 
     - Choose "Public" (free) or "Private" (requires GitHub Pro/Team)
     - Note: Private repos require paid GitHub account for Pages
   - **DO NOT** initialize with README, .gitignore, or license
4. Click "Create repository"

#### Step 2: Initialize Git in Your Project

Open Terminal/Command Prompt and navigate to your project folder:

```bash
cd "/Users/pollycueny/Marketing/watsonx challenge/2026/website files"
```

Initialize Git and push to GitHub:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: IBM watsonx Challenge Ideas Tracker"

# Add your GitHub repository as remote (replace YOUR-USERNAME and REPO-NAME)
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source":
   - Select branch: `main`
   - Select folder: `/ (root)`
5. Click "Save"
6. Wait 1-2 minutes for deployment

#### Step 4: Access Your Site

Your site will be available at:
```
https://YOUR-USERNAME.github.io/REPO-NAME/
```

For example: `https://pollycueny.github.io/watsonx-challenge-tracker/`

---

### Option B: Using GitHub Desktop (Easier for Non-Developers)

#### Step 1: Install GitHub Desktop

1. Download from https://desktop.github.com
2. Install and sign in with your GitHub account

#### Step 2: Create Repository

1. Open GitHub Desktop
2. Click "File" → "New Repository"
3. Fill in:
   - **Name**: `watsonx-challenge-tracker`
   - **Local Path**: Choose parent folder
   - **Initialize with README**: Uncheck this
4. Click "Create Repository"

#### Step 3: Copy Your Files

1. Copy all files from "website files" folder
2. Paste into the new repository folder GitHub Desktop created
3. In GitHub Desktop, you'll see all files listed
4. Add commit message: "Initial commit: IBM watsonx Challenge Ideas Tracker"
5. Click "Commit to main"
6. Click "Publish repository"
7. Choose visibility (Public or Private)
8. Click "Publish Repository"

#### Step 4: Enable GitHub Pages

Follow Step 3 from Option A above.

---

## 🔗 Sharing the URL with Your Team

Once deployed, share this URL with your team:

```
https://YOUR-USERNAME.github.io/REPO-NAME/
```

**Direct link to submission form:**
```
https://YOUR-USERNAME.github.io/REPO-NAME/form.html
```

### Create a Short Link (Optional)

Use a URL shortener for easier sharing:
- IBM's internal URL shortener (if available)
- bit.ly
- tinyurl.com

Example: `bit.ly/watsonx-ideas`

---

## ⚠️ Important Notes About GitHub Pages

### Data Storage Limitation

**CRITICAL**: Each user's data is stored in their own browser's localStorage. This means:

- ✅ **Good**: Fast, no server needed, works offline
- ❌ **Limitation**: Data is NOT shared between users automatically
- ❌ **Limitation**: Data is NOT shared between different browsers/devices

### Solutions for Data Sharing

**Option 1: Export/Import Workflow** (Recommended)
1. One person creates use cases
2. They click "Export Data" to download JSON file
3. Share JSON file via email/Slack
4. Team members click "Import Data" and select the file
5. Everyone now has the same data

**Option 2: Centralized Data Manager**
1. Designate one person as "data manager"
2. All team members submit use cases on their own browsers
3. Each person exports their data
4. Data manager imports all files (using "merge" option)
5. Data manager exports combined data
6. Share combined data with everyone

**Option 3: Future Enhancement - Backend Database**
If you need real-time data sharing, you would need to:
- Add a backend server (Node.js, Python, etc.)
- Use a database (Firebase, MongoDB, etc.)
- This requires more technical setup and hosting costs

---

## 🔄 Updating Your Site

When you make changes to the website:

### Using Command Line:
```bash
cd "/Users/pollycueny/Marketing/watsonx challenge/2026/website files"
git add .
git commit -m "Description of changes"
git push
```

### Using GitHub Desktop:
1. Make your changes to the files
2. Open GitHub Desktop
3. Review changes
4. Add commit message
5. Click "Commit to main"
6. Click "Push origin"

Changes will appear on your site within 1-2 minutes.

---

## 🎨 Custom Domain (Optional)

If you want a custom domain like `watsonx-ideas.ibm.com`:

1. You'll need access to IBM's DNS settings
2. In GitHub Pages settings, add your custom domain
3. Configure DNS records as instructed by GitHub
4. This typically requires IT/admin approval at IBM

---

## 🔒 Security Considerations

### For Public Repositories:
- ✅ Code is visible to everyone
- ✅ No sensitive data in the code
- ✅ User data stays in their browser (not on GitHub)
- ⚠️ Don't commit any API keys or credentials

### For Private Repositories:
- ✅ Code only visible to collaborators
- ✅ Requires GitHub Pro/Team/Enterprise
- ✅ Better for internal IBM projects

---

## 📞 Troubleshooting

### Site Not Loading?
- Wait 2-3 minutes after enabling Pages
- Check that branch is set to "main" and folder to "/ (root)"
- Verify files are in the repository root (not in a subfolder)

### 404 Error?
- Make sure `index.html` is in the root of your repository
- Check the exact URL (case-sensitive)

### Changes Not Appearing?
- Wait 1-2 minutes for GitHub to rebuild
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check that you pushed your commits

### Data Not Saving?
- This is normal - data is stored locally per browser
- Use Export/Import to share data between users

---

## 📧 Example Email to Send Your Team

```
Subject: New watsonx Challenge Ideas Tracker - Submit Your Ideas!

Hi Team,

I've set up a new tracker for our watsonx challenge ideas. You can now submit 
and view all use cases in one place!

🔗 Access the tracker: https://YOUR-USERNAME.github.io/REPO-NAME/
📝 Submit a use case: https://YOUR-USERNAME.github.io/REPO-NAME/form.html

Features:
- Submit use cases with scope, benefits, and outputs
- Add team member information
- Search and filter all submissions
- Export/import data to share with teammates

Note: Data is stored in your browser. To share your submissions with others, 
use the Export/Import buttons.

Questions? Check the README or contact me.

Thanks!
```

---

## 🎯 Next Steps After Deployment

1. ✅ Test the site yourself
2. ✅ Add the IBM logo (see IBM-LOGO-INSTRUCTIONS.txt)
3. ✅ Create a test use case to verify everything works
4. ✅ Share the URL with a small group first
5. ✅ Gather feedback and make improvements
6. ✅ Roll out to the full team

---

**Need Help?** 
- GitHub Pages Documentation: https://pages.github.com
- GitHub Support: https://support.github.com
- Git Tutorial: https://try.github.io

Good luck with your deployment! 🚀