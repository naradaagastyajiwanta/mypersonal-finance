# Finance Tracker PWA - Setup Instructions

## Google API Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - Google Sheets API
   - Google Drive API

### 2. Create OAuth 2.0 Credentials

1. Go to **Credentials** in the Google Cloud Console
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Configure OAuth consent screen:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:5175`
   - Authorized redirect URIs: `http://localhost:5175`

4. Copy the **Client ID**

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Google Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
   ```

### 4. Run the Application

```bash
npm run dev
```

## First Time Setup Flow

1. **Login with Google**: Click "Masuk dengan Google" button
2. **Grant Permissions**: Allow access to Google Sheets and Drive
3. **Create Spreadsheet**: App will automatically create a new spreadsheet in your Google Drive
4. **Start Using**: Add your first transaction!

## Google Sheets Structure

The app creates a spreadsheet with 4 sheets:

### Transactions Sheet
| ID | Date | Amount | Type | Category | Account | Description | Created_At |
|----|------|--------|------|----------|---------|-------------|------------|

### Categories Sheet
| ID | Name | Type | Color | Icon |
|----|------|------|-------|------|

### Accounts Sheet
| ID | Name | Type | Balance | Currency |
|----|------|------|---------|----------|

### Budgets Sheet
| ID | Category_ID | Month | Year | Amount | Spent |
|----|-------------|-------|------|--------|-------|

## Features

- ✅ Google Authentication
- ✅ Google Sheets as Database
- ✅ Real-time Data Sync
- ✅ Responsive PWA Design
- ✅ IDR Currency Support
- ✅ Transaction Management
- ✅ Budget Tracking
- ✅ Analytics & Reports

## Troubleshooting

### "Google API not loaded"
- Make sure you have internet connection
- Check if Client ID is correct in `.env`

### "Permission denied"
- Ensure OAuth consent screen is configured
- Check authorized domains in Google Cloud Console

### "Spreadsheet not found"
- App will create new spreadsheet on first login
- Manually set VITE_SPREADSHEET_ID in `.env` if needed