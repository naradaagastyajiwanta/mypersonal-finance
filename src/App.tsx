import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GOOGLE_CONFIG } from './config/google';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Transactions from './pages/transactions/Transactions';
import Analytics from './pages/analytics/Analytics';
import Settings from './pages/settings/Settings';
import Login from './pages/auth/Login';
import Setup from './pages/setup/Setup';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

function App() {
  // Check if Google Client ID is configured
  if (!GOOGLE_CONFIG.CLIENT_ID) {
    return <Setup />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App
