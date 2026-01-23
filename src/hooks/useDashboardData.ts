import { useQuery } from '@tanstack/react-query';

// Use local data in development, GitHub Pages in production
const DATA_BASE_URL = import.meta.env.DEV
  ? '/data'
  : 'https://decentraland.github.io/dclregenesislabsdashboard';

export interface BudgetCategory {
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

export interface DashboardData {
  lastUpdated: string;
  categories: BudgetCategory[];
  grandTotal: BudgetCategory | null;
}

async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${DATA_BASE_URL}/dashboard-data.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
  }
  return response.json();
}

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
