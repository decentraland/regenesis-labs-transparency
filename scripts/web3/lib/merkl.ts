import { formatUnits } from 'viem';
import type { MerklReward, PriceData } from './types.js';

// Merkl API endpoint
const MERKL_API = 'https://api.merkl.xyz';

interface MerklTokenInfo {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  price?: number;
}

interface MerklRewardItem {
  root: string;
  distributionChainId: number;
  recipient: string;
  amount: string;
  claimed: string;
  pending: string;
  proofs: string[];
  token: MerklTokenInfo;
}

interface MerklChainResponse {
  chain: {
    id: number;
    name: string;
  };
  rewards: MerklRewardItem[];
}

// Fetch unclaimed Merkl rewards for a wallet
export async function getMerklRewards(
  walletAddress: string,
  prices: PriceData
): Promise<MerklReward[]> {
  const rewards: MerklReward[] = [];

  try {
    // Fetch rewards from Merkl API (chainId 1 = Ethereum mainnet)
    const url = `${MERKL_API}/v4/users/${walletAddress}/rewards?chainId=1`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Merkl API returned ${response.status}`);
      return rewards;
    }

    const data: MerklChainResponse[] = await response.json();

    // Find Ethereum mainnet data
    const ethData = data.find((d) => d.chain.id === 1);
    if (!ethData || !ethData.rewards) {
      return rewards;
    }

    for (const reward of ethData.rewards) {
      const totalAmount = BigInt(reward.amount || '0');
      const claimed = BigInt(reward.claimed || '0');
      const unclaimed = totalAmount - claimed;

      if (unclaimed <= 0n) {
        continue;
      }

      const { token } = reward;
      const decimals = token.decimals ?? 18;
      const symbol = token.symbol ?? 'UNKNOWN';
      const tokenAddress = token.address;

      const amountFormatted = formatUnits(unclaimed, decimals);

      // Get USD value - try from API price first, then from our prices
      let usdValue: number | null = null;
      if (token.price) {
        usdValue = parseFloat(amountFormatted) * token.price;
        usdValue = Math.round(usdValue * 100) / 100;
      } else {
        const priceKey = tokenAddress.toLowerCase();
        if (prices[priceKey]?.usd) {
          usdValue = parseFloat(amountFormatted) * prices[priceKey].usd;
          usdValue = Math.round(usdValue * 100) / 100;
        }
      }

      rewards.push({
        token: tokenAddress,
        symbol,
        amount: unclaimed.toString(),
        amountFormatted,
        usdValue,
      });
    }
  } catch (error) {
    console.error('Error fetching Merkl rewards:', error);
  }

  return rewards;
}
