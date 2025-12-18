import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  Coffee,
  Zap,
  Home,
  Car,
  Smartphone,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

const transactions = [
  {
    id: 1,
    name: "Salary Deposit",
    category: "Income",
    amount: 8500,
    type: "income",
    date: "Dec 15, 2024",
    icon: ArrowDownLeft,
  },
  {
    id: 2,
    name: "Amazon Purchase",
    category: "Shopping",
    amount: -156.99,
    type: "expense",
    date: "Dec 14, 2024",
    icon: ShoppingBag,
  },
  {
    id: 3,
    name: "Starbucks",
    category: "Food & Drink",
    amount: -12.5,
    type: "expense",
    date: "Dec 14, 2024",
    icon: Coffee,
  },
  {
    id: 4,
    name: "Electric Bill",
    category: "Utilities",
    amount: -89.0,
    type: "expense",
    date: "Dec 13, 2024",
    icon: Zap,
  },
  {
    id: 5,
    name: "Rent Payment",
    category: "Housing",
    amount: -2200,
    type: "expense",
    date: "Dec 1, 2024",
    icon: Home,
  },
  {
    id: 6,
    name: "Freelance Payment",
    category: "Income",
    amount: 1200,
    type: "income",
    date: "Nov 30, 2024",
    icon: ArrowDownLeft,
  },
];

export function TransactionList() {
  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground">Your latest activity</p>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-secondary/50"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "rounded-lg p-2.5",
                  transaction.type === "income"
                    ? "bg-success/10 text-success"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                <transaction.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">{transaction.name}</p>
                <p className="text-sm text-muted-foreground">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "font-semibold",
                  transaction.type === "income" ? "text-success" : "text-foreground"
                )}
              >
                {transaction.type === "income" ? "+" : ""}
                ${Math.abs(transaction.amount).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{transaction.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
