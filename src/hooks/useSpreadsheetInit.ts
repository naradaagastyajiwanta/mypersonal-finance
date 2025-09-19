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

        // Check if we already have a spreadsheet ID in localStorage
        const existingId = localStorage.getItem('finance_tracker_spreadsheet_id');

        if (!existingId) {
          console.log('Creating new spreadsheet...');
          await sheetsService.initializeSpreadsheet();
          console.log('Spreadsheet created successfully!');
        } else {
          console.log('Using existing spreadsheet:', existingId);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing spreadsheet:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize spreadsheet');
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