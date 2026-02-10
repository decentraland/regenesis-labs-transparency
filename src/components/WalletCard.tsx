import { useState } from "react";
import { Wallet, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import type { WalletBalance } from "@/hooks/useBalanceData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const formatFullUsdValue = (value: number) => {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const UsdValue = ({ value, className }: { value: number; className?: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className={className}>{formatUsdValue(value)}</span>
    </TooltipTrigger>
    <TooltipContent>
      <span className="font-mono">{formatFullUsdValue(value)}</span>
    </TooltipContent>
  </Tooltip>
);

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
    <UsdValue value={subtotal} className="text-sm font-semibold text-primary cursor-default" />
  </div>
);

export function WalletCard({ wallet, title, isLoading, delay = 0 }: WalletCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sort tokens by USD value descending
  const sortedTokens = wallet?.tokens
    .slice()
    .sort((a, b) => (b.usdValue ?? 0) - (a.usdValue ?? 0)) ?? [];

  const hasMorpho = (wallet?.defi.morpho.length ?? 0) > 0;
  const hasRewards = (wallet?.defi.merklRewards.length ?? 0) > 0;
  const hasMoreContent = sortedTokens.length > 0 || hasMorpho || hasRewards;

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
          <UsdValue value={usdValue} className="text-xs text-muted-foreground cursor-default" />
        )}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
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
        {isLoading ? '...' : wallet ? <UsdValue value={wallet.totalUsdValue} className="cursor-default" /> : 'N/A'}
      </p>

      {/* Collapsed view - Summary only */}
      {!isExpanded && (
        <>
          {sortedTokens.length > 0 && (
            <SectionHeader label="Tokens" subtotal={tokenTotal} isFirst />
          )}
          {hasMorpho && (
            <SectionHeader label="Positions" subtotal={morphoTotal} />
          )}
          {hasRewards && (
            <SectionHeader label="Unclaimed Rewards" subtotal={rewardsTotal} />
          )}
        </>
      )}

      {/* Expanded view - All details */}
      {hasMoreContent && (
        <>
          <div
            className={`-mx-3 px-3 overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {/* Wallet Tokens */}
            {sortedTokens.length > 0 && (
              <>
                <SectionHeader label="Tokens" subtotal={tokenTotal} isFirst />
                <div className="divide-y divide-border/50 mt-1">
                  {sortedTokens.map((token) => (
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

            {/* Morpho Positions */}
            {wallet && hasMorpho && (
              <>
                <SectionHeader label="Positions" subtotal={morphoTotal} />
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
                          <UsdValue value={position.usdValue} className="text-xs text-muted-foreground cursor-default" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Unclaimed Rewards */}
            {wallet && hasRewards && (
              <>
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
              </>
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
    </TooltipProvider>
  );
}
