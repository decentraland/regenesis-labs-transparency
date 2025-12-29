import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const budgetData = [
  {
    category: "Personnel",
    spent: 1421293,
    remaining: 506096,
    budget: 1927389,
  },
  {
    category: "Projects",
    spent: 194773,
    remaining: 1695227,
    budget: 1890000,
  },
  {
    category: "Operations",
    spent: 54333,
    remaining: 665667,
    budget: 720000,
  },
  {
    category: "Legal",
    spent: 34335,
    remaining: 44665,
    budget: 79000,
  },
  {
    category: "Grants",
    spent: 0,
    remaining: 875000,
    budget: 875000,
  },
];

const totalBudget = budgetData.reduce((acc, item) => acc + item.budget, 0);
const totalSpent = budgetData.reduce((acc, item) => acc + item.spent, 0);
const totalRemaining = totalBudget - totalSpent;

export function BudgetOverview() {
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
