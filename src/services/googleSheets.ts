import { GOOGLE_CONFIG } from '../config/google';
import type { Transaction, Category, Account } from '../types/index';

declare global {
  interface Window {
    gapi: any;
  }
}

export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private spreadsheetId: string | null = null;

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  private get sheets() {
    return window.gapi.client.sheets;
  }

  private getSpreadsheetId(): string {
    if (this.spreadsheetId) {
      return this.spreadsheetId;
    }

    // Try to get from localStorage
    const stored = localStorage.getItem('finance_tracker_spreadsheet_id');
    if (stored) {
      this.spreadsheetId = stored;
      return stored;
    }

    throw new Error('No spreadsheet ID found. Please initialize first.');
  }

  private setSpreadsheetId(id: string): void {
    this.spreadsheetId = id;
    localStorage.setItem('finance_tracker_spreadsheet_id', id);
  }

  async initializeSpreadsheet(): Promise<string> {
    try {
      // Create new spreadsheet
      const response = await this.sheets.spreadsheets.create({
        properties: {
          title: 'Finance Tracker Data'
        },
        sheets: [
          { properties: { title: GOOGLE_CONFIG.SHEETS.TRANSACTIONS } },
          { properties: { title: GOOGLE_CONFIG.SHEETS.CATEGORIES } },
          { properties: { title: GOOGLE_CONFIG.SHEETS.ACCOUNTS } },
          { properties: { title: GOOGLE_CONFIG.SHEETS.BUDGETS } }
        ]
      });

      const spreadsheetId = response.result.spreadsheetId;

      // Store spreadsheet ID
      this.setSpreadsheetId(spreadsheetId);

      // Initialize headers
      await this.initializeHeaders(spreadsheetId);

      // Initialize default data
      await this.initializeDefaultData(spreadsheetId);

      return spreadsheetId;
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      throw error;
    }
  }

  private async initializeHeaders(spreadsheetId: string) {
    const requests = [
      {
        range: `${GOOGLE_CONFIG.SHEETS.TRANSACTIONS}!A1:H1`,
        values: [['ID', 'Date', 'Amount', 'Type', 'Category', 'Account', 'Description', 'Created_At']]
      },
      {
        range: `${GOOGLE_CONFIG.SHEETS.CATEGORIES}!A1:E1`,
        values: [['ID', 'Name', 'Type', 'Color', 'Icon']]
      },
      {
        range: `${GOOGLE_CONFIG.SHEETS.ACCOUNTS}!A1:E1`,
        values: [['ID', 'Name', 'Type', 'Balance', 'Currency']]
      },
      {
        range: `${GOOGLE_CONFIG.SHEETS.BUDGETS}!A1:F1`,
        values: [['ID', 'Category_ID', 'Month', 'Year', 'Amount', 'Spent']]
      }
    ];

    for (const request of requests) {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: request.range,
        valueInputOption: 'USER_ENTERED',
        resource: { values: request.values }
      });
    }
  }

  private async initializeDefaultData(spreadsheetId: string) {
    // Default categories
    const defaultCategories = [
      ['cat1', 'Makanan & Minum', 'expense', '#ef4444', 'utensils'],
      ['cat2', 'Transportasi', 'expense', '#3b82f6', 'car'],
      ['cat3', 'Belanja', 'expense', '#8b5cf6', 'shopping-bag'],
      ['cat4', 'Hiburan', 'expense', '#f59e0b', 'play'],
      ['cat5', 'Gaji', 'income', '#10b981', 'briefcase'],
      ['cat6', 'Bonus', 'income', '#06b6d4', 'gift']
    ];

    // Default accounts
    const defaultAccounts = [
      ['acc1', 'Cash', 'cash', '500000', 'IDR'],
      ['acc2', 'Bank BCA', 'bank', '2000000', 'IDR'],
      ['acc3', 'E-Wallet', 'cash', '150000', 'IDR']
    ];

    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${GOOGLE_CONFIG.SHEETS.CATEGORIES}!A2:E7`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: defaultCategories }
    });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${GOOGLE_CONFIG.SHEETS.ACCOUNTS}!A2:E4`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: defaultAccounts }
    });
  }

  // Transaction CRUD operations
  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.getSpreadsheetId(),
        range: `${GOOGLE_CONFIG.SHEETS.TRANSACTIONS}!A2:H`,
      });

      const rows = response.result.values || [];
      return rows.map((row: string[]) => ({
        id: row[0],
        date: row[1],
        amount: parseFloat(row[2]),
        type: row[3] as 'income' | 'expense',
        category: row[4],
        account: row[5],
        description: row[6],
        createdAt: row[7]
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<void> {
    try {
      const id = `txn_${Date.now()}`;
      const createdAt = new Date().toISOString();

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.getSpreadsheetId(),
        range: `${GOOGLE_CONFIG.SHEETS.TRANSACTIONS}!A:H`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[
            id,
            transaction.date,
            transaction.amount,
            transaction.type,
            transaction.category,
            transaction.account,
            transaction.description || '',
            createdAt
          ]]
        }
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.getSpreadsheetId(),
        range: `${GOOGLE_CONFIG.SHEETS.CATEGORIES}!A2:E`,
      });

      const rows = response.result.values || [];
      return rows.map((row: string[]) => ({
        id: row[0],
        name: row[1],
        type: row[2] as 'income' | 'expense',
        color: row[3],
        icon: row[4]
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getAccounts(): Promise<Account[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.getSpreadsheetId(),
        range: `${GOOGLE_CONFIG.SHEETS.ACCOUNTS}!A2:E`,
      });

      const rows = response.result.values || [];
      return rows.map((row: string[]) => ({
        id: row[0],
        name: row[1],
        type: row[2] as 'cash' | 'bank' | 'investment',
        balance: parseFloat(row[3]),
        currency: 'IDR' as const
      }));
    } catch (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }
  }
}