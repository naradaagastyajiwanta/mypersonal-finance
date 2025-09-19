// Google OAuth dan Sheets API Configuration
export const GOOGLE_CONFIG = {
  // OAuth 2.0 Client ID - akan diisi setelah setup Google Console
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',

  // OAuth Scopes yang diperlukan
  SCOPES: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ],

  // Discovery docs untuk Google Sheets API
  DISCOVERY_DOCS: [
    'https://sheets.googleapis.com/$discovery/rest?version=v4'
  ],

  // Spreadsheet ID - akan diset setelah user membuat/pilih spreadsheet
  SPREADSHEET_ID: import.meta.env.VITE_SPREADSHEET_ID || '',

  // Sheet names untuk data
  SHEETS: {
    TRANSACTIONS: 'Transactions',
    CATEGORIES: 'Categories',
    ACCOUNTS: 'Accounts',
    BUDGETS: 'Budgets'
  }
};