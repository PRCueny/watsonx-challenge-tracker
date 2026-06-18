# IBM watsonx Challenge Ideas Tracker

A web-based application for IBM teams to submit, track, and manage watsonx challenge ideas. Built with IBM Carbon Design System for authentic IBM branding.

## 📋 Overview

This application allows IBM teams to:
- Submit new watsonx challenge use cases with detailed information
- Track team members and their contributions
- View and search all submitted use cases
- Export and import data for sharing between team members
- Manage team member profiles with photos and titles

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No server or installation required!

### Setup Instructions

1. **Download the Files**
   - Ensure you have all files in the `website files` folder
   - Keep the folder structure intact

2. **Add IBM Branding Assets** (Optional but Recommended)
   - Place your IBM logo as `assets/ibm-logo.svg`
   - You can download the official IBM logo from:
     - [IBM Brand Center](https://www.ibm.com/brand/experience-guides/)
     - [IBM Consulting Marketing Resources](https://w3.ibm.com/consulting/contentplus/ibm-consulting-marketing-communications-resources/marketing-kit)
   
3. **Open the Application**
   - Double-click `index.html` to open in your default browser
   - Or right-click and choose "Open With" to select a specific browser

4. **Start Using**
   - Click "New Use Case" to submit your first challenge idea
   - Fill in all required fields and add team member emails
   - View, edit, and manage your use cases from the main page

## 📁 File Structure

```
website files/
├── index.html              # Main summary page
├── form.html               # Use case submission form
├── detail.html             # Individual use case detail view
├── README.md               # This file
├── css/
│   └── styles.css          # IBM Carbon Design System styling
├── js/
│   ├── storage.js          # Data management (localStorage)
│   ├── summary.js          # Summary page logic
│   ├── form.js             # Form handling and validation
│   └── detail.js           # Detail page logic
└── assets/
    ├── ibm-logo.svg        # IBM logo (add your own)
    ├── favicon.ico         # Browser tab icon (optional)
    └── placeholder-avatar.png  # Default team member photo
```

## 💡 Features

### Use Case Management
- **Submit New Use Cases**: Comprehensive form with validation
- **Required Fields**:
  - Use Case Name
  - Scope
  - Benefits
  - Outputs
  - Team Member Emails
- **Optional Fields**:
  - Comments/Additional Notes

### Team Member Profiles
- Add team members by email address
- Click on any team member to add:
  - Full name
  - Job title
  - Profile photo
- **Future Enhancement**: Automatic BluePages integration for IBM employee data

### Search & Filter
- Real-time search across all use cases
- Search by name, scope, benefits, outputs, or team member

### Data Management
- **Export**: Download all data as JSON file
- **Import**: Load data from JSON file
- **Merge or Replace**: Choose to merge with existing data or replace it
- **Local Storage**: Data persists in browser between sessions

### IBM Branding
- IBM Carbon Design System components
- IBM Plex Sans font family
- Official IBM color palette
- Responsive design for all devices

## 🔧 Usage Guide

### Creating a New Use Case

1. Click "New Use Case" button
2. Fill in all required fields:
   - **Use Case Name**: Clear, descriptive name
   - **Scope**: Detailed description of the challenge scope
   - **Benefits**: Expected benefits and value
   - **Outputs**: Deliverables and outcomes
   - **Comments**: Any additional context (optional)
3. Add team member emails (click "Add Team Member" for multiple)
4. Click "Save Use Case"

### Adding Team Member Details

1. Navigate to the use case detail page
2. Click on any team member card
3. In the popup modal:
   - Enter the member's full name
   - Enter their job title
   - Upload a profile photo (optional)
4. Click "Save"

### Searching Use Cases

- Use the search bar on the main page
- Search works across all fields including team member information
- Results update in real-time as you type

### Sharing Data with Team Members

**Option 1: Export/Import**
1. Click "Export Data" to download JSON file
2. Share the file via email or Slack
3. Recipient clicks "Import Data" and selects the file
4. Choose to merge or replace existing data

**Option 2: Share Folder**
1. Zip the entire "website files" folder
2. Share with team members
3. They extract and open `index.html`
4. Data is included in the shared folder

## 🎨 IBM Branding Guidelines

This application follows IBM's official brand guidelines:

### Colors
- **Primary Blue**: #0f62fe (IBM Blue 60)
- **Dark Gray**: #161616 (IBM Gray 100)
- **Light Gray**: #f4f4f4 (IBM Gray 10)

### Typography
- **Font Family**: IBM Plex Sans
- **Weights**: 300 (Light), 400 (Regular), 600 (Semibold)

### Resources
- [IBM Brand Experience Guides](https://www.ibm.com/brand/experience-guides/)
- [IBM Carbon Design System](https://carbondesignsystem.com/)
- [IBM Consulting Marketing Resources](https://w3.ibm.com/consulting/contentplus/ibm-consulting-marketing-communications-resources/marketing-kit)

## 🔮 Future Enhancements

### BluePages Integration
When IBM BluePages API access is available:
- Automatic employee photo retrieval
- Auto-populate name and title from email
- Real-time employee data updates

**Implementation Notes**:
- Code is structured to easily add API integration
- See `js/detail.js` for placeholder integration points
- Contact your IBM IT administrator for API credentials

### Potential Features
- Status tracking (Draft, In Progress, Completed)
- Comments and collaboration
- File attachments
- Email notifications
- Advanced filtering and sorting
- Analytics dashboard

## 🛠️ Technical Details

### Technology Stack
- **HTML5**: Structure and content
- **CSS3**: Styling with IBM Carbon Design System
- **Vanilla JavaScript**: No frameworks required
- **localStorage API**: Client-side data persistence

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Data Storage
- All data stored in browser's localStorage
- Maximum storage: ~5-10MB (varies by browser)
- Data persists until manually cleared
- Private to each browser/device

### Security Notes
- No server-side processing
- No data transmitted over network
- All data stays on local machine
- Use export/import for sharing

## 📞 Support

For questions or issues:
1. Check this README for common solutions
2. Review the IBM Brand Guidelines for branding questions
3. Contact your team lead or project administrator

## 📄 License

This application is for internal IBM use only. Follow IBM's internal software policies and guidelines.

---

**Version**: 1.0.0  
**Last Updated**: June 2026  
**Built for**: IBM watsonx Challenge Teams