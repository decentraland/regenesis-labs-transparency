import { cn } from "@/lib/utils";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Loader2 } from "lucide-react";

const categoryColors = [
  "hsl(280 70% 55%)",
  "hsl(300 75% 50%)",
  "hsl(320 80% 55%)",
  "hsl(340 85% 60%)",
  "hsl(35 95% 55%)",
];

export function BudgetCategories() {
  const { data, isLoading, error } = useDashboardData();

  // Transform dashboard data into display format, sorted by allocation descending
  const categories = data?.categories
    .filter((cat) => cat.id !== 'grants-program')
    .slice()
    .sort((a, b) => b.budgetAllocation - a.budgetAllocation)
    .map((cat, index) => ({
      name: cat.category,
      amount: cat.budgetRequested,
      percentage: cat.budgetAllocation,
      color: categoryColors[index % categoryColors.length],
    })) ?? [];

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 animate-slide-up flex items-center justify-center h-[400px]" style={{ animationDelay: "250ms" }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 animate-slide-up" style={{ animationDelay: "250ms" }}>
        <p className="text-destructive">Failed to load budget categories</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-slide-up" style={{ animationDelay: "250ms" }}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Key Budget Categories</h3>
        <p className="text-sm text-muted-foreground">Allocation breakdown</p>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 pb-3 border-b border-border mb-2">
        <div className="col-span-6">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</span>
        </div>
        <div className="col-span-3 text-right">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Budget ($)</span>
        </div>
        <div className="col-span-3 text-right">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Allocation</span>
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-1">
        {categories.map((category, index) => (
          <div
            key={category.name}
            className="grid grid-cols-12 gap-2 py-3 px-3 rounded-lg transition-colors"
            style={{
              backgroundColor: `hsl(${280 + index * 15} ${70 + index * 5}% ${55 + index * 5}% / ${0.25 - index * 0.03})`
            }}
          >
            <div className="col-span-6 flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm font-medium text-foreground truncate">
                {category.name}
              </span>
            </div>
            <div className="col-span-3 text-right">
              <span className="text-sm font-semibold text-foreground">
                ${category.amount.toLocaleString()}
              </span>
            </div>
            <div className="col-span-3 text-right">
              <span className="text-sm font-bold text-foreground">
                {category.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="h-3 rounded-full overflow-hidden flex bg-secondary">
          {categories.map((category) => (
            <div
              key={category.name}
              className="h-full transition-all duration-500"
              style={{
                width: `${category.percentage}%`,
                backgroundColor: category.color,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
