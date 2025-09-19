# Finance Tracker PWA 💰

A modern Personal Finance Tracker built as a Progressive Web App (PWA) using React, TypeScript, and Google Sheets as the database.

## 🌟 Features

- **📊 Dashboard**: Real-time overview of income, expenses, and balance
- **💳 Transaction Management**: Add, view, and search transactions with filtering
- **📈 Analytics**: Monthly overview with category breakdowns and charts
- **🔐 Google Authentication**: Secure login with Google OAuth 2.0
- **☁️ Cloud Storage**: Data stored in your own Google Sheets
- **📱 Progressive Web App**: Install on mobile devices, works offline
- **💱 IDR Currency**: Full support for Indonesian Rupiah
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Database**: Google Sheets API v4
- **Authentication**: Google OAuth 2.0
- **Forms**: React Hook Form + Zod validation
- **Icons**: React Icons (Feather)
- **Date Handling**: date-fns

## 📱 PWA Features

- ✅ Responsive mobile-first design
- ✅ Offline functionality (service worker)
- ✅ Installable on mobile devices
- ✅ Fast loading with Vite
- ✅ Real-time data synchronization

## 🛠️ Setup & Installation

### Prerequisites

1. Node.js 20.19+ or 22.12+
2. Google Cloud Console account
3. Google account for testing

### 1. Clone & Install

```bash
git clone <repository-url>
cd finance-tracker
npm install
```

### 2. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable APIs:
   - Google Sheets API
   - Google Drive API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5177`
   - Authorized redirect URIs: `http://localhost:5177`

### 3. Environment Configuration

```bash
cp .env.example .env
```

Add your Google Client ID to `.env`:
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5177`

## 📊 Data Structure

The app automatically creates a Google Spreadsheet with 4 sheets:

### Transactions
- ID, Date, Amount, Type, Category, Account, Description, Created_At

### Categories
- ID, Name, Type, Color, Icon
- Pre-populated with Indonesian categories

### Accounts
- ID, Name, Type, Balance, Currency
- Supports Cash, Bank, Investment accounts

### Budgets
- ID, Category_ID, Month, Year, Amount, Spent

## 💡 Usage

1. **Login**: Click "Masuk dengan Google"
2. **Grant Permissions**: Allow access to Google Sheets and Drive
3. **Automatic Setup**: App creates spreadsheet with default data
4. **Add Transactions**: Use the + button or "Add Transaction"
5. **View Analytics**: Check monthly overview and category breakdowns
6. **Filter & Search**: Use the transaction filters and search

## 🔒 Privacy & Security

- **Your Data**: Stored in your own Google Drive
- **No Server**: Pure client-side application
- **OAuth Security**: Industry-standard Google authentication
- **Local Storage**: Minimal caching for better performance

## 🌍 Indonesian Localization

- Currency: Indonesian Rupiah (IDR)
- Categories: Indonesian category names
- Format: Indonesian number formatting
- UI: Mixed English/Indonesian for better UX

## 📈 Key Components

- **Authentication Context**: Manages Google OAuth state
- **Google Sheets Service**: Handles all API operations
- **React Query Hooks**: Data fetching and caching
- **Currency Utils**: IDR formatting functions
- **Form Components**: Reusable form with validation

## 🔧 Development

```bash
# Development server
npm run dev

# Type checking
npm run build

# Preview production build
npm run preview
```

## 📝 License

MIT License - feel free to use for personal projects!

---

**Built with ❤️ for Indonesian personal finance management**
