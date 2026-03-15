import { Coins, Loader2 } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

export function GrantsProgram() {
  const { data, isLoading, error } = useDashboardData();

  const grants = data?.categories.find(c => c.id === 'grants-program');

  const totalBudget = grants?.budgetRequestedMana ?? 0;
  const spent = grants?.actualSpendingMana ?? 0;
  const remaining = grants?.actualFundsMana ?? 0;
  const spentPercent = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 animate-slide-up flex items-center justify-center h-[250px]" style={{ animationDelay: "280ms" }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 animate-slide-up" style={{ animationDelay: "280ms" }}>
        <p className="text-destructive">Failed to load grants data</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-slide-up" style={{ animationDelay: "280ms" }}>
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Coins className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Grants Program</h3>
          <p className="text-sm text-muted-foreground">Budget denominated in MANA</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
          <p className="text-xl font-bold text-foreground">
            {totalBudget.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">MANA</p>
        </div>
        <div className="rounded-lg bg-[hsl(340_85%_60%_/_0.15)] p-4">
          <p className="text-xs text-muted-foreground mb-1">Spent</p>
          <p className="text-xl font-bold text-[hsl(340_85%_60%)]">
            {spent.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">MANA</p>
        </div>
        <div className="rounded-lg bg-[hsl(280_70%_55%_/_0.15)] p-4">
          <p className="text-xs text-muted-foreground mb-1">Remaining</p>
          <p className="text-xl font-bold text-[hsl(280_70%_55%)]">
            {remaining.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">MANA</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Spent: {spentPercent.toFixed(1)}%</span>
          <span>Remaining: {(100 - spentPercent).toFixed(1)}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden flex bg-secondary">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${spentPercent}%`,
              backgroundColor: "hsl(340 85% 60%)",
            }}
          />
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${100 - spentPercent}%`,
              backgroundColor: "hsl(35 95% 55%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
