import { useState } from "react";
import { Wallet, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import type { WalletBalance } from "@/hooks/useBalanceData";

interface WalletCardProps {
  wallet: WalletBalance | undefined;
  title: string;
  isLoading: boolean;
  delay?: number;
}

const formatUsdValue = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const formatTokenAmount = (amount: string, symbol: string) => {
  const num = parseFloat(amount);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M ${symbol}`;
  }
  if (num >= 1000) {
    return `${num.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${symbol}`;
  }
  if (num >= 1) {
    return `${num.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${symbol}`;
  }
  // For small amounts (less than 1), show more decimals
  if (num > 0) {
    return `${num.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 })} ${symbol}`;
  }
  return `0 ${symbol}`;
};

export function WalletCard({ wallet, title, isLoading, delay = 0 }: WalletCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sort tokens by USD value descending
  const sortedTokens = wallet?.tokens
    .slice()
    .sort((a, b) => (b.usdValue ?? 0) - (a.usdValue ?? 0)) ?? [];

  const topTokens = sortedTokens.slice(0, 3);
  const remainingTokens = sortedTokens.slice(3);
  const hasMorpho = (wallet?.defi.morpho.length ?? 0) > 0;
  const hasRewards = (wallet?.defi.merklRewards.length ?? 0) > 0;
  const hasMoreContent = remainingTokens.length > 0 || hasMorpho || hasRewards;

  const TokenRow = ({ symbol, amount, usdValue }: { symbol: string; amount: string; usdValue: number | null }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{symbol}</span>
      <div className="text-right">
        <div className="text-sm font-medium text-foreground">
          {formatTokenAmount(amount, symbol.replace('$', ''))}
        </div>
        {usdValue !== null && (
          <div className="text-xs text-muted-foreground">
            {formatUsdValue(usdValue)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="rounded-xl bg-card border border-border p-6 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {isLoading ? (
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        ) : (
          <Wallet className="h-5 w-5 text-primary" />
        )}
      </div>

      {/* Total Value */}
      <p className="text-2xl font-bold text-foreground mb-4">
        {isLoading ? '...' : wallet ? formatUsdValue(wallet.totalUsdValue) : 'N/A'}
      </p>

      {/* Top 3 Tokens */}
      <div className="divide-y divide-border/50">
        {topTokens.map((token) => (
          <TokenRow
            key={token.symbol}
            symbol={`$${token.symbol}`}
            amount={token.balanceFormatted}
            usdValue={token.usdValue}
          />
        ))}
      </div>

      {/* Expandable Section */}
      {hasMoreContent && (
        <>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {/* Remaining Tokens */}
            {remainingTokens.length > 0 && (
              <div className="pt-4 mt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Other Tokens
                </p>
                <div className="divide-y divide-border/50">
                  {remainingTokens.map((token) => (
                    <TokenRow
                      key={token.symbol}
                      symbol={`$${token.symbol}`}
                      amount={token.balanceFormatted}
                      usdValue={token.usdValue}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Morpho Positions */}
            {wallet && hasMorpho && (
              <div className="pt-4 mt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Morpho Positions
                </p>
                <div className="space-y-2">
                  {wallet.defi.morpho.map((position) => (
                    <div key={position.marketId} className="flex items-center justify-between py-1">
                      <span className="text-sm text-muted-foreground">
                        {position.marketName}
                      </span>
                      <span className="text-sm font-medium text-foreground tabular-nums">
                        {parseFloat(position.supplyAssetsFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Merkl Rewards */}
            {wallet && hasRewards && (
              <div className="pt-4 mt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Unclaimed Rewards
                </p>
                <div className="divide-y divide-border/50">
                  {wallet.defi.merklRewards.map((reward) => (
                    <TokenRow
                      key={reward.token}
                      symbol={`$${reward.symbol}`}
                      amount={reward.amountFormatted}
                      usdValue={reward.usdValue}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View More / View Less Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-1.5 w-full mt-4 pt-3 border-t border-border text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>Show details</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
