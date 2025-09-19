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

        // Clear any old cached data first for fresh start
        sheetsService.clearSpreadsheetData();
        console.log('Starting fresh spreadsheet initialization...');

        // Always create a new spreadsheet for this session
        const spreadsheetId = await sheetsService.initializeSpreadsheet();
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

    initializeSpreadsheet();
  }, [isSignedIn]);

  return {
    isInitialized,
    isInitializing,
    error
  };
};