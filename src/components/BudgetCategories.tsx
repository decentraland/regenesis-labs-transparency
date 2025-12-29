import { cn } from "@/lib/utils";

const categories = [
  { name: "Personnel Cost", amount: 1927389, percentage: 35.1, color: "hsl(280 70% 55%)" },
  { name: "Project Allocation", amount: 1890000, percentage: 34.42, color: "hsl(300 75% 50%)" },
  { name: "Grants Program", amount: 875000, percentage: 15.93, color: "hsl(320 80% 55%)" },
  { name: "Operational Costs", amount: 720000, percentage: 13.11, color: "hsl(340 85% 60%)" },
  { name: "Legal and Compliance", amount: 79000, percentage: 1.44, color: "hsl(35 95% 55%)" },
];

export function BudgetCategories() {
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
          {categories.map((category, index) => (
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
