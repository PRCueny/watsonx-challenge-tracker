# How to Update Your Website When Airtable Changes

**Simple Guide for Non-Technical Users**

---

## What This Does

When someone submits a new challenge idea in Airtable, it doesn't automatically show up on your website. You need to manually "refresh" the website to pull in the new data. This guide shows you how.

Think of it like this:
- **Airtable** = Your filing cabinet with all the information
- **Website** = A display board showing copies of that information
- **This process** = Copying updated files from the cabinet to the display board

---

## ONE-TIME SETUP (Do This Once)

### Step 1: Get Your Airtable "Key"

Think of this as getting a key to access your Airtable filing cabinet.

1. Go to this website: https://airtable.com/create/tokens
2. Click the blue button that says **"Create new token"**
3. In the box that says "Name", type: **watsonx Tracker**
4. Under "Scopes", click **"Add a scope"** and select:
   - **data.records:read** (this lets you read the data)
5. Under "Access", click **"Add a base"** and select:
   - **watsonx Challenge Ideas** (your Airtable base)
6. Click the blue **"Create token"** button at the bottom
7. You'll see a long code starting with "pat..." - **COPY THIS** and save it somewhere safe (like a password manager or secure note)
   - ⚠️ You won't be able to see this code again!

### Step 2: Find Your Airtable "Address"

Think of this as finding the exact location of your filing cabinet.

1. Open your Airtable base (watsonx Challenge Ideas)
2. Look at the web address at the top of your browser
3. It will look like: `https://airtable.com/appABC123XYZ/tblDEF456UVW/...`
4. Write down these two parts:
   - The part starting with **app** (like `appABC123XYZ`) - this is your "Base ID"
   - The part starting with **tbl** (like `tblDEF456UVW`) - this is your "Table ID"

### Step 3: Put Your Key and Address in the Update Tool

1. On your computer, go to: **Documents → github → watsonx-challenge-tracker**
2. Find the file called **fetch-airtable-data.py**
3. Right-click it and choose **"Open With" → "TextEdit"** (or any text editor)
4. Near the top, you'll see three lines that look like this:

```
AIRTABLE_TOKEN = "patqfJXXXXXXXXXXXX.XXXXXXX..."
BASE_ID = "appOrzCHmG98YM4jf"
TABLE_NAME = "tblXXXXXXXXXXXXXX"
```

5. Replace the X's with your actual values:
   - Replace the first line with your token from Step 1 (keep the quotes)
   - Replace the second line with your Base ID from Step 2 (keep the quotes)
   - Replace the third line with your Table ID from Step 2 (keep the quotes)

6. Save the file (File → Save)

**You only need to do Steps 1-3 once!** After this, you can just follow the "Regular Update Process" below.

---

## REGULAR UPDATE PROCESS (Do This Whenever Data Changes)

### Step 1: Open Terminal

1. On your Mac, press **Command + Space**
2. Type **"Terminal"** and press Enter
3. A black window will open - this is where you'll type commands

### Step 2: Go to Your Project Folder

Copy and paste this command into Terminal and press Enter:

```
cd /Users/pollycueny/Documents/github/watsonx-challenge-tracker
```

### Step 3: Get the Latest Data from Airtable

Copy and paste this command and press Enter:

```
python3 fetch-airtable-data.py
```

You should see messages like:
```
Fetching data from Airtable...
Found 8 records
✓ Successfully saved 8 use cases
```

If you see an error, check the "Common Problems" section below.

### Step 4: Save the Changes

Copy and paste these three commands, one at a time, pressing Enter after each:

```
git add data/airtable-data.json
```

```
git commit -m "Update website data"
```

```
git push origin main
```

### Step 5: Wait for the Website to Update

- Wait about 2-3 minutes
- Go to your website: https://prcueny.github.io/watsonx-challenge-tracker/live-data.html
- Press **Command + Shift + R** (Mac) to refresh and see the new data

**That's it! Your website now shows the latest data from Airtable.**

---

## SUPER EASY VERSION (All Commands at Once)

Once you've done the one-time setup, you can run everything with just ONE command:

1. Open Terminal
2. Copy and paste this entire block and press Enter:

```
cd /Users/pollycueny/Documents/github/watsonx-challenge-tracker && python3 fetch-airtable-data.py && git add data/airtable-data.json && git commit -m "Update website data" && git push origin main
```

3. Wait 2-3 minutes, then refresh your website

---

## COMMON PROBLEMS & SOLUTIONS

### Problem: "command not found: python3"
**Solution**: Python isn't installed. Contact IT or skip this - I can help you install it.

### Problem: "ModuleNotFoundError: No module named 'requests'"
**Solution**: Copy and paste this command in Terminal:
```
pip3 install requests
```

### Problem: "401 Client Error: Unauthorized"
**Solution**: Your Airtable key (token) is wrong or expired. Go back to Step 1 of the One-Time Setup and create a new token.

### Problem: "I don't see the new data on the website"
**Solutions**:
1. Wait 2-3 minutes - it takes time to update
2. Hard refresh: Press **Command + Shift + R** (Mac)
3. Try opening the website in a private/incognito browser window
4. Check if GitHub is still processing: https://github.com/PRCueny/watsonx-challenge-tracker/actions

### Problem: "Names aren't showing correctly"
**Solution**: The system automatically creates names from email addresses. For example:
- `polly.cueny@ibm.com` becomes "Polly Cueny"
- `msider@ibm.com` becomes "Msider"

If you want better names, you can add them directly in Airtable in a "Name" column.

---

## HOW OFTEN SHOULD I UPDATE?

- **Daily**: If people are actively submitting new ideas
- **Weekly**: For regular maintenance
- **Whenever someone asks**: "Why isn't my submission showing up?"

---

## WHAT GETS UPDATED?

When you run this process, the website will show:
- ✅ New challenge ideas that were submitted
- ✅ Changes to existing ideas
- ✅ Updated team member lists
- ✅ All the latest information from Airtable

---

## NEED HELP?

If something goes wrong:
1. Take a screenshot of any error messages
2. Note which step you were on
3. Contact your IT support or the person who set this up

---

**Remember**: You only do the "One-Time Setup" once. After that, updating is just running a few commands in Terminal!

---

**Created**: July 2, 2026  
**For**: Polly Cueny - watsonx Challenge Tracker
