# CSV Import Guide for Airtable Data

## Overview

The watsonx Challenge Ideas Tracker now supports importing use cases directly from Airtable CSV exports. This allows you to easily sync data from your Airtable base to the website.

## How to Export from Airtable

1. Open your Airtable base
2. Go to the table/view you want to export
3. Click the "..." menu in the top right
4. Select "Download CSV"
5. Save the CSV file to your computer

## CSV Format Requirements

Your CSV file must include these column headers (exact names):

- **Use Case Name** (required) - The name of the use case
- **Scope** (optional) - Detailed description of the challenge scope
- **Benefits** (optional) - Expected benefits and value
- **Outputs** (optional) - Deliverables and outcomes
- **Team Name** (optional) - Name of the team
- **Team Lead Email** (optional) - Email address of the team lead
- **Team Member Emails** (optional) - Comma-separated list of team member emails
- **Comments** (optional) - Additional notes or comments

## How to Import CSV Data

1. Open the Website - Open index.html in your web browser
2. Click "Import from CSV" Button (📊 icon in the top action bar)
3. Select Your CSV File exported from Airtable
4. Wait for Import - You'll see a success message when complete
5. View Imported Data - The page will automatically refresh

## Important Notes

### Team Member Emails
- Multiple emails should be separated by commas
- The Team Lead Email will be automatically added with "Team Lead" title
- Team member emails must be valid (contain @)

### Data Handling
- Imported data is ADDED to existing use cases
- Only "Use Case Name" is required
- Empty fields will be stored as empty strings

## Sample CSV File

A sample CSV file (sample-airtable-export.csv) is included for testing.

## Tips

1. Regular Backups: Export your data regularly using "Export Data" button
2. Test First: Try importing the sample CSV file first
3. Clean Data: Ensure your Airtable data is clean before exporting

---

Built for IBM watsonx Challenge Teams
