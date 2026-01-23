/**
 * Script to fetch Dashboard data from Google Sheets and convert to JSON
 *
 * Usage: npx tsx scripts/sheets/fetch-dashboard-data.ts
 *
 * The sheet must be published to the web for this to work:
 * File > Share > Publish to web > Select "Dashboard - High level expenditures" > CSV
 */

import { writeDataFile } from '../lib/output.js';

// Published CSV URL for "Dashboard - High level expenditures" sheet
// Can be overridden via SHEET_CSV_URL environment variable (e.g., in GitHub Actions)
const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdk5b3yvdxydtzTbjKATZJpgGMfg1_4ByL51S3ypKfgrA5VvxiRZVP8ltCoRoRWMVrXHHVuiKWxU92/pub?gid=703579216&single=true&output=csv';
const SHEET_CSV_URL = process.env.SHEET_CSV_URL || DEFAULT_SHEET_URL;

interface BudgetCategory {
  id: string;
  category: string;
  budgetRequested: number;
  realSpending: number;
  totalBudgetForecasted: number;
  availableFunds: number;
  availableFundsPercent: number;
  budgetAllocation: number;
  budgetSpentPercent: number;
  actualFunds: number;
}

interface DashboardData {
  lastUpdated: string;
  categories: BudgetCategory[];
  grandTotal: BudgetCategory | null;
}

function parseMoneyValue(value: string): number {
  if (!value) return 0;
  // Remove $, commas, and whitespace
  const cleaned = value.replace(/[$,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parsePercentValue(value: string): number {
  if (!value) return 0;
  // Remove % and whitespace
  const cleaned = value.replace(/[%\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function rowToBudgetCategory(row: string[]): BudgetCategory {
  return {
    id: row[0] || '',
    category: row[1] || '',
    budgetRequested: parseMoneyValue(row[2]),
    realSpending: parseMoneyValue(row[3]),
    totalBudgetForecasted: parseMoneyValue(row[4]),
    availableFunds: parseMoneyValue(row[5]),
    availableFundsPercent: parsePercentValue(row[6]),
    budgetAllocation: parsePercentValue(row[7]),
    budgetSpentPercent: parsePercentValue(row[8]),
    actualFunds: parseMoneyValue(row[9]),
  };
}

async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(SHEET_CSV_URL, {
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
  }

  const csvText = await response.text();
  const lines = csvText.split('\n').filter(line => line.trim());

  // Skip header rows (row 1 is title, row 2 is empty, row 3 is headers)
  // Data starts at row 4
  const dataLines = lines.slice(3);

  const categories: BudgetCategory[] = [];
  let grandTotal: BudgetCategory | null = null;

  for (const line of dataLines) {
    const row = parseCSVLine(line);
    if (!row[0]) continue; // Skip empty rows

    const category = rowToBudgetCategory(row);

    if (category.id === 'grand-total') {
      grandTotal = category;
    } else {
      categories.push(category);
    }
  }
  return {
    lastUpdated: new Date().toISOString(),
    categories,
    grandTotal,
  };
}

async function main() {
  try {
    console.log('Fetching dashboard data from Google Sheets...');
    const data = await fetchDashboardData();

    // Output summary to console
    console.log(`Found ${data.categories.length} categories`);
    if (data.grandTotal) {
      console.log(`Grand total budget: $${data.grandTotal.budgetRequested.toLocaleString()}`);
    }

    // Write to shared data directory
    writeDataFile('dashboard-data.json', data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    process.exit(1);
  }
}

main();
