#!/usr/bin/env python3
"""
Fetch data from Airtable and save to JSON file
"""

import requests
import json
import re

# Airtable configuration
AIRTABLE_TOKEN = "patqfJXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
BASE_ID = "appOrzCHmG98YM4jf"
TABLE_NAME = "tblXXXXXXXXXXXXXX"

def clean_email(email_str):
    """Extract clean email from various formats"""
    if not email_str:
        return ""
    
    # Remove markdown link format: [email](mailto:email)
    markdown_match = re.search(r'\[([^\]]+)\]\(mailto:([^\)]+)\)', email_str)
    if markdown_match:
        return markdown_match.group(2).strip()
    
    # Extract from format: Name <email>
    angle_match = re.search(r'<([^>]+)>', email_str)
    if angle_match:
        return angle_match.group(1).strip()
    
    # Extract from mailto: links
    mailto_match = re.search(r'mailto:([^\s\)]+)', email_str)
    if mailto_match:
        return mailto_match.group(1).strip()
    
    # Just clean up the string
    return email_str.strip()

def extract_name_from_email_string(email_str):
    """Extract name if present in format: Name <email>"""
    if not email_str:
        return ""
    
    # Check for format: Name <email>
    name_match = re.match(r'([^<]+)<', email_str)
    if name_match:
        return name_match.group(1).strip()
    
    return ""

def fetch_airtable_data():
    """Fetch all records from Airtable"""
    url = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_NAME}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_TOKEN}",
        "Content-Type": "application/json"
    }
    
    all_records = []
    offset = None
    
    while True:
        params = {}
        if offset:
            params['offset'] = offset
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        all_records.extend(data.get('records', []))
        
        offset = data.get('offset')
        if not offset:
            break
    
    return all_records

def transform_record(record):
    """Transform Airtable record to our format"""
    fields = record.get('fields', {})
    
    # Process team members
    team_members = []
    team_member_emails = fields.get('Team Member Email', [])
    
    if isinstance(team_member_emails, list):
        for i, email_str in enumerate(team_member_emails):
            clean_email_addr = clean_email(email_str)
            extracted_name = extract_name_from_email_string(email_str)
            
            team_members.append({
                'email': clean_email_addr,
                'name': extracted_name,
                'title': 'Team Lead' if i == 0 else '',
                'photo': ''
            })
    
    return {
        'id': record['id'],
        'name': fields.get('Use Case Name', ''),
        'scope': fields.get('Scope', ''),
        'benefits': fields.get('Benefits', ''),
        'outputs': fields.get('Outputs', ''),
        'comments': fields.get('Comments', ''),
        'teamName': fields.get('Team Name', ''),
        'teamMembers': team_members,
        'createdAt': record.get('createdTime', ''),
        'updatedAt': fields.get('Last Modified', '')
    }

def main():
    print("Fetching data from Airtable...")
    records = fetch_airtable_data()
    print(f"Found {len(records)} records")
    
    print("Transforming data...")
    transformed = [transform_record(r) for r in records]
    
    print("Saving to data/airtable-data.json...")
    with open('data/airtable-data.json', 'w') as f:
        json.dump(transformed, f, indent=2)
    
    print(f"✓ Successfully saved {len(transformed)} use cases")
    
    # Show sample of cleaned emails
    print("\nSample of cleaned emails:")
    for uc in transformed[:3]:
        print(f"\n{uc['name']}:")
        for member in uc['teamMembers'][:2]:
            print(f"  - Email: {member['email']}")
            if member['name']:
                print(f"    Name: {member['name']}")

if __name__ == '__main__':
    main()
