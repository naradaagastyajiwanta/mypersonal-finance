import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import type { GoogleUser } from '../hooks/useGoogleAuth';

interface AuthContextType {
  isLoading: boolean;
  isSignedIn: boolean;
  user: GoogleUser | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useGoogleAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};