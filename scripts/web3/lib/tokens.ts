import { createPublicClient, http, erc20Abi, formatUnits, getAddress, type PublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import type { TokenConfig, TokenBalance, PriceData } from './types.js';
import { TOKENS, RPC_ENDPOINTS, COINGECKO_API } from '../config/wallets.js';

// Create a public client with fallback RPC endpoints
export function createClient(): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(RPC_ENDPOINTS[0], {
      retryCount: 3,
      retryDelay: 1000,
    }),
  });
}

// Fetch native ETH balance
async function getEthBalance(
  client: PublicClient,
  walletAddress: `0x${string}`
): Promise<bigint> {
  return client.getBalance({ address: walletAddress });
}

// Safely checksum an address
function checksumAddress(address: string): `0x${string}` {
  try {
    return getAddress(address) as `0x${string}`;
  } catch {
    // If checksum fails, try lowercase
    return getAddress(address.toLowerCase()) as `0x${string}`;
  }
}

// Fetch ERC20 token balances using multicall for efficiency
async function getTokenBalances(
  client: PublicClient,
  walletAddress: `0x${string}`,
  tokens: TokenConfig[]
): Promise<Map<string, bigint>> {
  const erc20Tokens = tokens.filter((t) => t.address !== 'native');

  if (erc20Tokens.length === 0) {
    return new Map();
  }

  const results = await client.multicall({
    contracts: erc20Tokens.map((token) => ({
      address: checksumAddress(token.address),
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [walletAddress],
    })),
  });

  const balances = new Map<string, bigint>();
  erc20Tokens.forEach((token, index) => {
    const result = results[index];
    if (result.status === 'success') {
      balances.set(token.address.toLowerCase(), result.result as bigint);
    } else {
      console.warn(`Failed to fetch balance for ${token.symbol}: ${result.error}`);
      balances.set(token.address.toLowerCase(), 0n);
    }
  });

  return balances;
}

// Fetch prices from CoinGecko using coin IDs
export async function fetchPrices(tokens: TokenConfig[]): Promise<PriceData> {
  const tokensWithIds = tokens.filter((t) => t.coingeckoId);
  const ids = tokensWithIds.map((t) => t.coingeckoId).join(',');

  try {
    // Fetch all prices by coin IDs
    const url = `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd`;
    const response = await fetch(url);
    const data = await response.json();

    // Map coin IDs back to addresses for lookup
    const prices: PriceData = {};
    for (const token of tokensWithIds) {
      const price = data[token.coingeckoId!]?.usd;
      if (price !== undefined) {
        const key = token.address === 'native' ? 'native' : token.address.toLowerCase();
        prices[key] = { usd: price };
      }
    }

    return prices;
  } catch (error) {
    console.error('Failed to fetch prices from CoinGecko:', error);
    return {};
  }
}

// Get all token balances for a wallet
export async function getWalletTokenBalances(
  client: PublicClient,
  walletAddress: `0x${string}`,
  prices: PriceData
): Promise<TokenBalance[]> {
  // Fetch ETH balance
  const ethBalance = await getEthBalance(client, walletAddress);

  // Fetch ERC20 balances
  const erc20Balances = await getTokenBalances(client, walletAddress, TOKENS);

  // Build token balance array
  const balances: TokenBalance[] = TOKENS.map((token) => {
    const rawBalance =
      token.address === 'native'
        ? ethBalance
        : erc20Balances.get(token.address.toLowerCase()) ?? 0n;

    const formattedBalance = formatUnits(rawBalance, token.decimals);
    const priceKey = token.address === 'native' ? 'native' : token.address.toLowerCase();
    const price = prices[priceKey]?.usd ?? null;
    const usdValue = price !== null ? parseFloat(formattedBalance) * price : null;

    return {
      symbol: token.symbol,
      address: token.address,
      balance: rawBalance.toString(),
      balanceFormatted: formattedBalance,
      usdPrice: price,
      usdValue: usdValue !== null ? Math.round(usdValue * 100) / 100 : null,
    };
  });

  // Filter out zero balances
  return balances.filter((b) => b.balance !== '0');
}
