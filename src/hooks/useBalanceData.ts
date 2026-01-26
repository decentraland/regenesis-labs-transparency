import { useQuery } from '@tanstack/react-query';

const BALANCES_URL = 'https://decentraland.github.io/regenesis-labs-transparency/balances.json';

export interface TokenBalance {
  symbol: string;
  address: string;
  balance: string;
  balanceFormatted: string;
  usdPrice: number | null;
  usdValue: number | null;
}

export interface MorphoPosition {
  marketId: string;
  marketName: string;
  underlyingSymbol: string;
  supplyAssets: string;
  supplyAssetsFormatted: string;
  borrowAssets: string;
  borrowAssetsFormatted: string;
  collateral: string;
  collateralFormatted: string;
  netValue: number | null;
  usdValue: number | null;
}

export interface MerklReward {
  token: string;
  symbol: string;
  amount: string;
  amountFormatted: string;
  usdValue: number | null;
}

export interface WalletBalance {
  address: string;
  label: string;
  tokens: TokenBalance[];
  defi: {
    morpho: MorphoPosition[];
    merklRewards: MerklReward[];
  };
  totalUsdValue: number;
}

export interface BalanceSnapshot {
  timestamp: string;
  wallets: WalletBalance[];
  totalPortfolioValue: number;
}

async function fetchBalanceData(): Promise<BalanceSnapshot> {
  const response = await fetch(BALANCES_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch balance data: ${response.statusText}`);
  }
  return response.json();
}

export function useBalanceData() {
  return useQuery({
    queryKey: ['balanceData'],
    queryFn: fetchBalanceData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Get a specific wallet by label
 */
export function useWalletByLabel(label: string) {
  const { data, ...rest } = useBalanceData();
  const wallet = data?.wallets.find((w) => w.label === label);
  return { data: wallet, ...rest };
}
