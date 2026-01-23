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

const SectionHeader = ({ label, subtotal, isFirst = false }: { label: string; subtotal: number; isFirst?: boolean }) => (
  <div className={`flex items-center justify-between py-3 px-3 -mx-3 bg-muted/30 rounded ${isFirst ? 'mt-0' : 'mt-4'}`}>
    <span className="text-xs font-bold uppercase tracking-wider text-foreground">{label}</span>
    <span className="text-sm font-semibold text-primary">{formatUsdValue(subtotal)}</span>
  </div>
);

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

  // Calculate section subtotals
  const tokenTotal = sortedTokens.reduce((sum, t) => sum + (t.usdValue ?? 0), 0);
  const morphoTotal = wallet?.defi.morpho.reduce((sum, p) => sum + (p.usdValue ?? 0), 0) ?? 0;
  const rewardsTotal = wallet?.defi.merklRewards.reduce((sum, r) => sum + (r.usdValue ?? 0), 0) ?? 0;

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

      {/* Wallet Tokens Section */}
      {sortedTokens.length > 0 && (
        <>
          <SectionHeader label="Wallet" subtotal={tokenTotal} isFirst />
          <div className="divide-y divide-border/50 mt-1">
            {topTokens.map((token) => (
              <TokenRow
                key={token.symbol}
                symbol={`$${token.symbol}`}
                amount={token.balanceFormatted}
                usdValue={token.usdValue}
              />
            ))}
          </div>
        </>
      )}

      {/* Expandable Section */}
      {hasMoreContent && (
        <>
          <div
            className={`-mx-3 px-3 overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {/* Remaining Tokens */}
            {remainingTokens.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">
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
              <div>
                <SectionHeader label="Morpho Positions" subtotal={morphoTotal} />
                <div className="divide-y divide-border/50 mt-1">
                  {wallet.defi.morpho.map((position) => (
                    <div key={position.marketId} className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">
                        {position.marketName}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground tabular-nums">
                          {parseFloat(position.supplyAssetsFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })} {position.underlyingSymbol}
                        </div>
                        {position.usdValue !== null && (
                          <div className="text-xs text-muted-foreground">
                            {formatUsdValue(position.usdValue)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Merkl Rewards */}
            {wallet && hasRewards && (
              <div>
                <SectionHeader label="Unclaimed Rewards" subtotal={rewardsTotal} />
                <div className="divide-y divide-border/50 mt-1">
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
