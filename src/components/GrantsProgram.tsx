import { Coins } from "lucide-react";

const GRANTS_DATA = {
  totalBudget: 1_923_076.92,
  totalSpent: 0,
};

export function GrantsProgram() {
  const remaining = GRANTS_DATA.totalBudget - GRANTS_DATA.totalSpent;
  const spentPercent = (GRANTS_DATA.totalSpent / GRANTS_DATA.totalBudget) * 100;

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

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
          <p className="text-xl font-bold text-foreground">
            {GRANTS_DATA.totalBudget.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">MANA</p>
        </div>
        <div className="rounded-lg bg-[hsl(340_85%_60%_/_0.15)] p-4">
          <p className="text-xs text-muted-foreground mb-1">Spent</p>
          <p className="text-xl font-bold text-[hsl(340_85%_60%)]">
            {GRANTS_DATA.totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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

      {/* Progress Bar */}
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
