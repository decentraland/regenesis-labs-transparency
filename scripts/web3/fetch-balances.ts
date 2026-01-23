#!/usr/bin/env tsx
/**
 * Wallet Balance Tracker Script
 *
 * Fetches token balances and DeFi positions for configured wallets
 * using direct RPC calls (no paid APIs required).
 *
 * Usage: npx tsx scripts/fetch-balances.ts
 */

import { createClient, getWalletTokenBalances, fetchPrices } from './lib/tokens.js';
import { getMorphoPositions } from './lib/morpho.js';
import { getMerklRewards } from './lib/merkl.js';
import { WALLETS, TOKENS } from './config/wallets.js';
import { writeDataFile } from '../lib/output.js';
import type { BalanceSnapshot, WalletBalance } from './lib/types.js';

async function main() {
  console.log('🔍 Fetching wallet balances...\n');

  const client = createClient();

  // Fetch prices first (shared across all wallets)
  console.log('💰 Fetching token prices from CoinGecko...');
  const prices = await fetchPrices(TOKENS);
  console.log(`   Found prices for ${Object.keys(prices).length} tokens\n`);

  const walletBalances: WalletBalance[] = [];

  for (const wallet of WALLETS) {
    console.log(`📊 Processing wallet: ${wallet.label} (${wallet.address})`);

    // Fetch token balances
    const tokenBalances = await getWalletTokenBalances(client, wallet.address, prices);
    console.log(`   Found ${tokenBalances.length} tokens with non-zero balances`);

    // Fetch Morpho positions
    const morphoPositions = await getMorphoPositions(client, wallet.address);
    console.log(`   Found ${morphoPositions.length} Morpho positions`);

    // Fetch Merkl rewards
    const merklRewards = await getMerklRewards(wallet.address, prices);
    if (merklRewards.length > 0) {
      console.log(`   Found ${merklRewards.length} Merkl reward(s)`);
    }

    // Calculate total USD value
    const tokenUsdTotal = tokenBalances.reduce(
      (sum, t) => sum + (t.usdValue ?? 0),
      0
    );

    walletBalances.push({
      address: wallet.address,
      label: wallet.label,
      tokens: tokenBalances,
      defi: {
        morpho: morphoPositions,
        merklRewards,
      },
      totalUsdValue: Math.round(tokenUsdTotal * 100) / 100,
    });

    console.log(`   Total token value: $${tokenUsdTotal.toLocaleString()}\n`);
  }

  // Calculate portfolio total
  const portfolioTotal = walletBalances.reduce(
    (sum, w) => sum + (w.totalUsdValue ?? 0),
    0
  );

  // Build snapshot
  const snapshot: BalanceSnapshot = {
    timestamp: new Date().toISOString(),
    wallets: walletBalances,
    totalPortfolioValue: Math.round(portfolioTotal * 100) / 100,
  };

  // Write output using shared utility
  writeDataFile('balances.json', snapshot);

  // If it's the 1st of the month, save a monthly snapshot
  const today = new Date();
  if (today.getUTCDate() === 1) {
    const month = String(today.getUTCMonth() + 1).padStart(2, '0');
    const year = today.getUTCFullYear();
    const snapshotFilename = `snapshots/${month}-${year}.json`;
    writeDataFile(snapshotFilename, snapshot);
    console.log(`📅 Monthly snapshot saved: ${snapshotFilename}`);
  }

  console.log(`📈 Total Portfolio Value: $${portfolioTotal.toLocaleString()}`);
  console.log(`⏰ Timestamp: ${snapshot.timestamp}`);

  // Also print a summary table
  console.log('\n📋 Summary:');
  console.log('─'.repeat(60));
  for (const wallet of walletBalances) {
    console.log(`\n${wallet.label} (${wallet.address.slice(0, 8)}...)`);
    console.log('  Tokens:');
    for (const token of wallet.tokens) {
      const value = token.usdValue !== null ? `$${token.usdValue.toLocaleString()}` : 'N/A';
      console.log(`    ${token.symbol.padEnd(6)} ${token.balanceFormatted.slice(0, 12).padStart(14)} = ${value}`);
    }
    if (wallet.defi.morpho.length > 0) {
      console.log('  Morpho Positions:');
      for (const pos of wallet.defi.morpho) {
        console.log(`    ${pos.marketName}: Supply ${pos.supplyAssetsFormatted}`);
      }
    }
    if (wallet.defi.merklRewards.length > 0) {
      console.log('  Merkl Rewards (unclaimed):');
      for (const reward of wallet.defi.merklRewards) {
        const value = reward.usdValue !== null ? `= $${reward.usdValue.toLocaleString()}` : '';
        console.log(`    ${reward.symbol}: ${parseFloat(reward.amountFormatted).toFixed(4)} ${value}`);
      }
    }
  }
  console.log('\n' + '─'.repeat(60));
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
