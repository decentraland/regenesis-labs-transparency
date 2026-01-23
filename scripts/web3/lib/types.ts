// TypeScript types for wallet balance tracking

export interface TokenConfig {
  symbol: string;
  address: string; // Use 'native' for ETH
  decimals: number;
  coingeckoId?: string; // For price fetching
}

export interface TokenBalance {
  symbol: string;
  address: string;
  balance: string; // Raw balance as string (to preserve precision)
  balanceFormatted: string; // Human-readable balance
  usdValue: number | null;
  usdPrice: number | null;
}

export interface MorphoPosition {
  marketId: string;
  marketName: string;
  supplyAssets: string;
  supplyAssetsFormatted: string;
  borrowAssets: string;
  borrowAssetsFormatted: string;
  collateral: string;
  collateralFormatted: string;
  netValue: number | null;
}

export interface MerklReward {
  token: string;
  symbol: string;
  amount: string;
  amountFormatted: string;
  usdValue: number | null;
}

export interface DeFiPositions {
  morpho: MorphoPosition[];
  merklRewards: MerklReward[];
}

export interface WalletBalance {
  address: string;
  label: string;
  tokens: TokenBalance[];
  defi: DeFiPositions;
  totalUsdValue: number | null;
}

export interface BalanceSnapshot {
  timestamp: string;
  wallets: WalletBalance[];
  totalPortfolioValue: number | null;
}

export interface WalletConfig {
  address: `0x${string}`;
  label: string;
}

export interface PriceData {
  [contractAddress: string]: {
    usd: number;
  };
}
