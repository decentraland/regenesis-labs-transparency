import type { WalletConfig, TokenConfig } from '../lib/types.js';

// Wallets to track
export const WALLETS: WalletConfig[] = [
  {
    address: '0x5613eC65db405FD33613c3620AA8B15BBC888E4B',
    label: 'Operational',
  },
  {
    address: '0x93accd5b8aee795c6efcfdedfe4a292e59e00e84',
    label: 'Treasury',
  },
];

// Tokens to track on Ethereum mainnet
export const TOKENS: TokenConfig[] = [
  {
    symbol: 'ETH',
    address: 'native',
    decimals: 18,
    coingeckoId: 'ethereum',
  },
  {
    symbol: 'WETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    coingeckoId: 'weth',
  },
  {
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    coingeckoId: 'usd-coin',
  },
  {
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    coingeckoId: 'tether',
  },
  {
    symbol: 'DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    coingeckoId: 'dai',
  },
  {
    symbol: 'MANA',
    address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
    decimals: 18,
    coingeckoId: 'decentraland',
  },
  {
    symbol: 'MORPHO',
    address: '0x58D97B57BB95320F9a05dC918Aef65434969c2B2',
    decimals: 18,
    coingeckoId: 'morpho',
  },
];

// Known Morpho markets the wallets may have positions in
export const MORPHO_MARKETS = [
  {
    id: '0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc' as `0x${string}`,
    name: 'USDC/WETH (86%)',
  },
  {
    id: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49' as `0x${string}`,
    name: 'USDC/wstETH (86%)',
  },
  {
    id: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41' as `0x${string}`,
    name: 'WETH/wstETH (94.5%)',
  },
];

// Free public RPC endpoints for Ethereum mainnet
export const RPC_ENDPOINTS = [
  'https://rpc.decentraland.org/mainnet',
  'https://ethereum-rpc.publicnode.com',
  'https://rpc.ankr.com/eth',
  'https://eth.llamarpc.com',
  'https://1rpc.io/eth',
];

// CoinGecko API endpoint
export const COINGECKO_API = 'https://api.coingecko.com/api/v3';
