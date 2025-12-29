import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", balance: 24500 },
  { month: "Feb", balance: 26200 },
  { month: "Mar", balance: 25800 },
  { month: "Apr", balance: 28400 },
  { month: "May", balance: 31200 },
  { month: "Jun", balance: 29800 },
  { month: "Jul", balance: 33500 },
  { month: "Aug", balance: 35200 },
  { month: "Sep", balance: 38400 },
  { month: "Oct", balance: 41200 },
  { month: "Nov", balance: 43800 },
  { month: "Dec", balance: 47520 },
];

export function BalanceChart() {
  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Balance Overview</h3>
        <p className="text-sm text-muted-foreground">Your balance trend this year</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(280 70% 55%)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="hsl(320 80% 55%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(340 85% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(60 5% 60%)", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(60 5% 60%)", fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220 25% 12%)",
                border: "1px solid hsl(220 20% 20%)",
                borderRadius: "8px",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.5)",
              }}
              labelStyle={{ color: "hsl(60 10% 98%)" }}
              itemStyle={{ color: "hsl(320 80% 55%)" }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="hsl(320 80% 55%)"
              strokeWidth={2}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
