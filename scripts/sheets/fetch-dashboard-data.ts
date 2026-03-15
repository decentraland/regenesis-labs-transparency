/**
 * Script to fetch Dashboard data from Google Sheets and convert to JSON
 *
 * Usage: npx tsx scripts/sheets/fetch-dashboard-data.ts
 *
 * The sheet must be published to the web for this to work:
 * File > Share > Publish to web > Select "Dashboard - High level expenditures" > CSV
 */

import { writeDataFile } from '../lib/output.js';

// CSV export URL for the spreadsheet
// Can be overridden via environment variables (e.g., in GitHub Actions)
// SPREADSHEET_ID: The Google Sheets document ID
// SHEET_GID: The sheet tab ID (0 = first sheet)
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_GID = process.env.SHEET_GID;
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;

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
  budgetRequestedMana: number;
  actualSpendingMana: number;
  actualFundsMana: number;
}

interface DashboardData {
  lastUpdated: string;
  categories: BudgetCategory[];
  grandTotal: BudgetCategory | null;
}

function parseNumeric(value: string, stripPattern: RegExp): number {
  if (!value) return 0;
  const num = parseFloat(value.replace(stripPattern, ''));
  return isNaN(num) ? 0 : num;
}

function parseMoneyValue(value: string): number {
  return parseNumeric(value, /[$,\s]/g);
}

function parseManaValue(value: string): number {
  // Handles formats like "$ MANA 1,923,076.92" and "$1,923,076.92"
  return parseNumeric(value, /[$,\s]|MANA/gi);
}

function parsePercentValue(value: string): number {
  return parseNumeric(value, /[%\s]/g);
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
  // Column mapping:
  // A=id, B=category, C=budgetRequested, D=realSpending, E=totalBudgetForecasted,
  // F=SKIP (Total Budget committed), G=availableFunds, H=availableFundsPercent,
  // I=budgetAllocation, J=budgetSpentPercent, K=budgetRequestedMana, L=actualSpendingMana, M=actualFundsMana
  return {
    id: row[0] || '',
    category: row[1] || '',
    budgetRequested: parseMoneyValue(row[2]),
    realSpending: parseMoneyValue(row[3]),
    totalBudgetForecasted: parseMoneyValue(row[4]),
    // row[5] skipped (Total Budget committed)
    availableFunds: parseMoneyValue(row[6]),
    availableFundsPercent: parsePercentValue(row[7]),
    budgetAllocation: parsePercentValue(row[8]),
    budgetSpentPercent: parsePercentValue(row[9]),
    budgetRequestedMana: parseManaValue(row[10]),
    actualSpendingMana: parseManaValue(row[11]),
    actualFundsMana: parseManaValue(row[12]),
  };
}

async function fetchDashboardData(): Promise<DashboardData> {
  if (!SPREADSHEET_ID) throw new Error('Missing SPREADSHEET_ID environment variable');
  const response = await fetch(SHEET_CSV_URL, {
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
  }

  const csvText = await response.text();
  const lines = csvText.split('\n').filter(line => line.trim());

  // Skip header row (row 1 has column headers)
  // Data starts at row 2
  const dataLines = lines.slice(1);

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
