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

        console.log('Checking for existing spreadsheet...');

        // Try to use existing spreadsheet, create only if needed
        const spreadsheetId = await sheetsService.ensureSpreadsheetExists();
        console.log('Spreadsheet ready:', spreadsheetId);

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

    initializeSpreadsheet();
  }, [isSignedIn]);

  return {
    isInitialized,
    isInitializing,
    error
  };
};