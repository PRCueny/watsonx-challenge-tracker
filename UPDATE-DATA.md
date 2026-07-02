# How to Update Airtable Data

This guide explains how to update the website with the latest data from Airtable.

## Quick Update Process

Whenever you want to refresh the website with new data from Airtable:

```bash
# 1. Navigate to the project directory
cd /Users/pollycueny/Documents/github/watsonx-challenge-tracker

# 2. Run the fetch script
python3 fetch-airtable-data.py

# 3. Commit the updated data
git add data/airtable-data.json
git commit -m "Update Airtable data"

# 4. Push to GitHub
git push origin main
```

## What This Does

1. **Fetches data** from your Airtable base using the API
2. **Transforms** it into the format needed by the website
3. **Saves** it as `data/airtable-data.json`
4. **Commits** the file to git
5. **Deploys** to GitHub Pages (automatically after push)

## How Often to Update

- **Daily**: If data changes frequently
- **Weekly**: For regular updates
- **On-demand**: Whenever someone submits a new use case

## The Live Data Page

Your coworkers can view the data at:
**https://prcueny.github.io/watsonx-challenge-tracker/live-data.html**

### Benefits:
✅ **No login required** - Anyone can view
✅ **Beautiful card layout** - Your custom design
✅ **Search functionality** - Find use cases easily
✅ **Statistics** - See totals at a glance

## Troubleshooting

### Script fails with "command not found"
Make sure Python 3 is installed:
```bash
python3 --version
```

### API error
Check that your Airtable token is still valid in `fetch-airtable-data.py`

### Data not updating on website
1. Wait 2-3 minutes for GitHub Pages to deploy
2. Hard refresh the page: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Try in incognito mode to bypass cache

## Security Note

The `fetch-airtable-data.py` script contains your API token and should NOT be committed to a public repository. It's in `.gitignore` to keep it private.

---

Built for IBM watsonx Challenge Teams
