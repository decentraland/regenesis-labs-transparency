import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Housing", value: 2200, color: "hsl(280 70% 55%)" },
  { name: "Food & Drink", value: 650, color: "hsl(300 75% 50%)" },
  { name: "Transportation", value: 420, color: "hsl(320 80% 55%)" },
  { name: "Shopping", value: 380, color: "hsl(340 85% 60%)" },
  { name: "Utilities", value: 290, color: "hsl(35 95% 55%)" },
  { name: "Entertainment", value: 180, color: "hsl(45 90% 50%)" },
];

const total = data.reduce((acc, item) => acc + item.value, 0);

export function SpendingBreakdown() {
  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Spending Breakdown</h3>
        <p className="text-sm text-muted-foreground">Where your money goes</p>
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 25% 12%)",
                  border: "1px solid hsl(220 20% 20%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 24px -4px rgba(0,0,0,0.5)",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-foreground">
              ${total.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
        <div className="flex-1 space-y-3 w-full">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">
                  ${item.value.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {((item.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
