import { formatUnits, getAddress, type PublicClient } from 'viem';
import type { MorphoPosition } from './types.js';

// Morpho Vault (ERC-4626) addresses on Ethereum mainnet (lowercase for viem compatibility)
// These are the vaults shown on DeBank for the Treasury wallet
// Addresses verified from Morpho's official app
export const MORPHO_VAULTS = [
  {
    address: '0xbeef01735c132ada46aa9aa4c54623caa92a64cb',
    name: 'Steakhouse USDC',
    symbol: 'steakUSDC',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
  },
  {
    address: '0xbeef047a543e45807105e51a8bbefcc5950fcfba',
    name: 'Steakhouse USDT',
    symbol: 'steakUSDT',
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
  },
  {
    address: '0xbeefff209270748ddd194831b3fa287a5386f5bc',
    name: 'Smokehouse USDC',
    symbol: 'smokeUSDC',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
  },
  {
    address: '0xa0804346780b4c2e3be118ac957d1db82f9d7484',
    name: 'Smokehouse USDT',
    symbol: 'smokeUSDT',
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
  },
  {
    address: '0xdd0f28e19c1780eb6396170735d45153d261490d',
    name: 'Gauntlet USDC Prime',
    symbol: 'gtUSDCprime',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
  },
  {
    address: '0x8eb67a509616cd6a7c1b3c8c21d48ff57df3d458',
    name: 'Gauntlet USDC Core',
    symbol: 'gtUSDCcore',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
  },
  {
    address: '0xc582f04d8a82795aa2ff9c8bb4c1c889fe7b754e',
    name: 'Gauntlet USDC Frontier',
    symbol: 'gtUSDCfrontier',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
  },
  {
    address: '0x8cb3649114051ca5119141a34c200d65dc0faa73',
    name: 'Gauntlet USDT Prime',
    symbol: 'gtUSDTprime',
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
  },
  {
    address: '0x777791c4d6dc2ce140d00d2828a7c93503c67777',
    name: 'Hyperithm USDC',
    symbol: 'hyperUSDC',
    underlyingSymbol: 'USDC',
    underlyingDecimals: 6,
  },
  {
    address: '0x888883f0eddf69ca4bfd00af93714ff97f188888',
    name: 'Hyperithm USDT',
    symbol: 'hyperUSDT',
    underlyingSymbol: 'USDT',
    underlyingDecimals: 6,
  },
];

// ERC-4626 Vault ABI (only functions we need)
const ERC4626_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'maxWithdraw',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'shares', type: 'uint256' }],
    name: 'convertToAssets',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Fetch Morpho Vault positions for a wallet
export async function getMorphoPositions(
  client: PublicClient,
  walletAddress: `0x${string}`
): Promise<MorphoPosition[]> {
  const positions: MorphoPosition[] = [];

  // First, get share balances for all vaults
  const balanceCalls = MORPHO_VAULTS.map((vault) => ({
    address: getAddress(vault.address) as `0x${string}`,
    abi: ERC4626_ABI,
    functionName: 'balanceOf' as const,
    args: [walletAddress] as const,
  }));

  try {
    const balanceResults = await client.multicall({ contracts: balanceCalls });

    // Find vaults with non-zero balances
    const vaultsWithBalances: { vault: typeof MORPHO_VAULTS[0]; shares: bigint }[] = [];

    for (let i = 0; i < MORPHO_VAULTS.length; i++) {
      const result = balanceResults[i];
      if (result.status === 'success' && result.result > 0n) {
        vaultsWithBalances.push({
          vault: MORPHO_VAULTS[i],
          shares: result.result as bigint,
        });
      }
    }

    if (vaultsWithBalances.length === 0) {
      return positions;
    }

    // Get asset values for vaults with balances using maxWithdraw
    const assetCalls = vaultsWithBalances.map(({ vault }) => ({
      address: getAddress(vault.address) as `0x${string}`,
      abi: ERC4626_ABI,
      functionName: 'maxWithdraw' as const,
      args: [walletAddress] as const,
    }));

    const assetResults = await client.multicall({ contracts: assetCalls });

    for (let i = 0; i < vaultsWithBalances.length; i++) {
      const { vault, shares } = vaultsWithBalances[i];
      const assetResult = assetResults[i];

      let assets = 0n;
      if (assetResult.status === 'success') {
        assets = assetResult.result as bigint;
      }

      positions.push({
        marketId: vault.address,
        marketName: vault.name,
        supplyAssets: assets.toString(),
        supplyAssetsFormatted: formatUnits(assets, vault.underlyingDecimals),
        borrowAssets: '0',
        borrowAssetsFormatted: '0',
        collateral: shares.toString(),
        collateralFormatted: formatUnits(shares, 18), // Vault shares are 18 decimals
        netValue: null, // Will be calculated with prices
      });
    }
  } catch (error) {
    console.error('Error fetching Morpho vault positions:', error);
  }

  return positions;
}
