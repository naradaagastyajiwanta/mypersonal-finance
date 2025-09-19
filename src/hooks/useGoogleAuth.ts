import { useState, useEffect } from 'react';
import { GOOGLE_CONFIG } from '../config/google';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [authInstance, setAuthInstance] = useState<any>(null);

  useEffect(() => {
    initializeGapi();
  }, []);

  const initializeGapi = async () => {
    try {
      // Check if Client ID is configured
      if (!GOOGLE_CONFIG.CLIENT_ID) {
        console.warn('Google Client ID not configured');
        setIsLoading(false);
        return;
      }

      // Load Google API
      await loadGoogleAPI();

      // Load required gapi modules
      await new Promise<void>((resolve) => {
        window.gapi.load('client:auth2', () => {
          resolve();
        });
      });

      // Initialize auth
      await initAuth();
    } catch (error) {
      console.error('Error initializing Google API:', error);
      setIsLoading(false);
    }
  };

  const loadGoogleAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  };

  const initAuth = async () => {
    try {
      // Initialize gapi client first
      await window.gapi.client.init({
        clientId: GOOGLE_CONFIG.CLIENT_ID,
        scope: GOOGLE_CONFIG.SCOPES.join(' '),
        discoveryDocs: GOOGLE_CONFIG.DISCOVERY_DOCS
      });

      // Initialize auth2
      await window.gapi.auth2.init({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
      });

      const authInstanceRef = window.gapi.auth2.getAuthInstance();
      setAuthInstance(authInstanceRef);

      // Check if user is already signed in
      const isSignedInStatus = authInstanceRef.isSignedIn.get();
      setIsSignedIn(isSignedInStatus);

      if (isSignedInStatus) {
        updateUserInfo(authInstanceRef.currentUser.get());
      }

      // Listen for sign-in state changes
      authInstanceRef.isSignedIn.listen(setIsSignedIn);
      authInstanceRef.currentUser.listen(updateUserInfo);

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing auth:', error);
      setIsLoading(false);
    }
  };

  const updateUserInfo = (googleUser: any) => {
    if (googleUser.isSignedIn()) {
      const profile = googleUser.getBasicProfile();
      setUser({
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl()
      });
    } else {
      setUser(null);
    }
  };

  const signIn = async () => {
    console.log('signIn called, authInstance:', authInstance);
    if (!authInstance) {
      console.error('Auth instance not available');
      return;
    }

    try {
      console.log('Calling authInstance.signIn()...');
      await authInstance.signIn();
      console.log('Sign in successful');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    if (!authInstance) return;

    try {
      await authInstance.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    isLoading,
    isSignedIn,
    user,
    signIn,
    signOut
  };
};