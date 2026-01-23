import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Loader2 } from "lucide-react";

export function BudgetOverview() {
  const { data, isLoading, error } = useDashboardData();

  // Transform dashboard data into chart format, sorted by allocation descending
  const budgetData = data?.categories
    .slice()
    .sort((a, b) => b.budgetAllocation - a.budgetAllocation)
    .map((cat) => ({
      category: cat.category.replace(' Cost', '').replace(' Allocation', '').replace(' Program', '').replace(' and Compliance', ''),
      spent: cat.realSpending,
      remaining: cat.actualFunds,
      budget: cat.budgetRequested,
    })) ?? [];

  const totalBudget = budgetData.reduce((acc, item) => acc + item.budget, 0);
  const totalSpent = budgetData.reduce((acc, item) => acc + item.spent, 0);
  const totalRemaining = budgetData.reduce((acc, item) => acc + item.remaining, 0);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 animate-slide-up flex items-center justify-center h-[450px]" style={{ animationDelay: "200ms" }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <p className="text-destructive">Failed to load budget data</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Spent & Remaining Budget</h3>
        <p className="text-sm text-muted-foreground">Budget allocation by category</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
          <p className="text-xl font-bold text-foreground">${(totalBudget / 1000000).toFixed(2)}M</p>
        </div>
        <div className="rounded-lg bg-[hsl(340_85%_60%_/_0.15)] p-4">
          <p className="text-xs text-muted-foreground mb-1">Spent</p>
          <p className="text-xl font-bold text-[hsl(340_85%_60%)]">${(totalSpent / 1000000).toFixed(2)}M</p>
        </div>
        <div className="rounded-lg bg-[hsl(280_70%_55%_/_0.15)] p-4">
          <p className="text-xs text-muted-foreground mb-1">Remaining</p>
          <p className="text-xl font-bold text-[hsl(280_70%_55%)]">${(totalRemaining / 1000000).toFixed(2)}M</p>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={budgetData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
            barSize={28}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(60 5% 60%)", fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <YAxis
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(60 10% 98%)", fontSize: 12, fontWeight: 500 }}
              width={75}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220 25% 12%)",
                border: "1px solid hsl(220 20% 20%)",
                borderRadius: "8px",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.5)",
              }}
              labelStyle={{ color: "hsl(60 10% 98%)", fontWeight: 600, marginBottom: 4 }}
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name === "spent" ? "Spent" : "Remaining"
              ]}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: 10 }}
              formatter={(value) => (
                <span style={{ color: "hsl(60 5% 60%)", fontSize: 12 }}>
                  {value === "spent" ? "Current Spending" : "Actual Funds"}
                </span>
              )}
            />
            <Bar
              dataKey="spent"
              stackId="budget"
              fill="hsl(340 85% 60%)"
              radius={[4, 0, 0, 4]}
              name="spent"
            />
            <Bar
              dataKey="remaining"
              stackId="budget"
              fill="hsl(35 95% 55%)"
              radius={[0, 4, 4, 0]}
              name="remaining"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
