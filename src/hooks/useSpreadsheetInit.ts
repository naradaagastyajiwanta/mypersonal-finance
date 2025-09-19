import { useState, useEffect } from 'react';
import { GoogleSheetsService } from '../services/googleSheets';

export const useSpreadsheetInit = (isSignedIn: boolean) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setIsInitialized(false);
      setError(null);
      return;
    }

    const initializeSpreadsheet = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        const sheetsService = GoogleSheetsService.getInstance();

        // Check if we already have a spreadsheet ID
        const existingId = localStorage.getItem('finance_tracker_spreadsheet_id');

        if (existingId) {
          console.log('Using existing spreadsheet:', existingId);
          setIsInitialized(true);
          setIsInitializing(false);
          return;
        }

        console.log('No existing spreadsheet found, creating new one...');

        // Only create new spreadsheet if none exists
        const spreadsheetId = await sheetsService.ensureSpreadsheetExists();
        console.log('New spreadsheet created:', spreadsheetId);

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing spreadsheet:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize spreadsheet');

        // Clear localStorage on error to force recreation next time
        localStorage.removeItem('finance_tracker_spreadsheet_id');
      } finally {
        setIsInitializing(false);
      }
    };

    // Add small delay to ensure session restoration completes first
    setTimeout(initializeSpreadsheet, 500);
  }, [isSignedIn]);

  return {
    isInitialized,
    isInitializing,
    error
  };
};