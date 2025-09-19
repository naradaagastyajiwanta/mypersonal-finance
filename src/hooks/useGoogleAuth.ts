import { useState, useEffect } from 'react';
import { GOOGLE_CONFIG } from '../config/google';

declare global {
  interface Window {
    gapi: any;
    google: any;
    googleSignInCallback?: (response: any) => void;
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
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session first
    const savedUser = localStorage.getItem('finance_tracker_user');
    const savedToken = localStorage.getItem('finance_tracker_token');

    if (savedUser && savedToken) {
      console.log('Restoring saved session...');
      setUser(JSON.parse(savedUser));
      setAccessToken(savedToken);
      setIsSignedIn(true);

      // Set token for API calls
      if (window.gapi?.client) {
        window.gapi.client.setToken({ access_token: savedToken });
      }
    }

    initializeGoogleIdentity();
  }, []);

  const initializeGoogleIdentity = async () => {
    try {
      // Check if Client ID is configured
      if (!GOOGLE_CONFIG.CLIENT_ID) {
        console.warn('Google Client ID not configured');
        setIsLoading(false);
        return;
      }

      // Load Google Identity Services
      await loadGoogleIdentityServices();

      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        callback: handleSignInResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Load GAPI for Sheets API
      await loadGoogleAPI();
      await new Promise<void>((resolve) => {
        window.gapi.load('client', resolve);
      });

      await window.gapi.client.init({
        discoveryDocs: GOOGLE_CONFIG.DISCOVERY_DOCS
      });

      // If we have a saved token, set it for API calls
      const savedToken = localStorage.getItem('finance_tracker_token');
      if (savedToken && window.gapi?.client) {
        window.gapi.client.setToken({ access_token: savedToken });
        console.log('Restored API token from localStorage');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing Google Identity:', error);
      setIsLoading(false);
    }
  };

  const loadGoogleIdentityServices = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
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

  const handleSignInResponse = async (response: any) => {
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));

      const userData = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      };

      setUser(userData);
      setIsSignedIn(true);

      // Save user data to localStorage
      localStorage.setItem('finance_tracker_user', JSON.stringify(userData));

      // Get access token for API calls
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        scope: GOOGLE_CONFIG.SCOPES.join(' '),
        callback: (tokenResponse: any) => {
          setAccessToken(tokenResponse.access_token);
          window.gapi.client.setToken({ access_token: tokenResponse.access_token });

          // Save token to localStorage
          localStorage.setItem('finance_tracker_token', tokenResponse.access_token);
        },
      });

      tokenClient.requestAccessToken({ prompt: '' });
    } catch (error) {
      console.error('Error handling sign in response:', error);
    }
  };

  const signIn = async () => {
    console.log('Attempting to sign in with Google Identity Services...');
    try {
      // Show the sign-in prompt
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup
          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CONFIG.CLIENT_ID,
            scope: GOOGLE_CONFIG.SCOPES.join(' '),
            callback: async (tokenResponse: any) => {
              setAccessToken(tokenResponse.access_token);
              window.gapi.client.setToken({ access_token: tokenResponse.access_token });

              // Get user info
              try {
                const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const userInfo = await response.json();

                const userData = {
                  id: userInfo.id,
                  name: userInfo.name,
                  email: userInfo.email,
                  picture: userInfo.picture
                };

                setUser(userData);
                setIsSignedIn(true);

                // Save session data
                localStorage.setItem('finance_tracker_user', JSON.stringify(userData));
                localStorage.setItem('finance_tracker_token', tokenResponse.access_token);
              } catch (error) {
                console.error('Error getting user info:', error);
              }
            },
          });

          tokenClient.requestAccessToken({ prompt: 'consent' });
        }
      });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      if (accessToken) {
        window.google.accounts.oauth2.revoke(accessToken);
      }
      window.google.accounts.id.disableAutoSelect();

      // Clear local state
      setUser(null);
      setIsSignedIn(false);
      setAccessToken(null);
      window.gapi.client.setToken(null);

      // Clear localStorage
      localStorage.removeItem('finance_tracker_user');
      localStorage.removeItem('finance_tracker_token');
      localStorage.removeItem('finance_tracker_spreadsheet_id');

      console.log('Session cleared successfully');
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