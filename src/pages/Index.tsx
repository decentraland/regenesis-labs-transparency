import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { BalanceChart } from "@/components/BalanceChart";
import { TransactionList } from "@/components/TransactionList";
import { SpendingBreakdown } from "@/components/SpendingBreakdown";
import { BudgetOverview } from "@/components/BudgetOverview";
import { BudgetCategories } from "@/components/BudgetCategories";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(173_80%_40%_/_0.1)_0%,_transparent_50%)] pointer-events-none" />
      
      <Header />
      
      <main className="container relative px-4 py-8 md:px-6">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Good morning, Alex</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your finances today.</p>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Total Balance"
            value="$47,520"
            change="+12.5% from last month"
            changeType="positive"
            icon={Wallet}
            delay={0}
          />
          <MetricCard
            title="Monthly Income"
            value="$9,700"
            change="+8.2% from last month"
            changeType="positive"
            icon={TrendingUp}
            delay={50}
          />
          <MetricCard
            title="Monthly Expenses"
            value="$4,120"
            change="-3.1% from last month"
            changeType="positive"
            icon={TrendingDown}
            delay={100}
          />
          <MetricCard
            title="Savings Rate"
            value="57.5%"
            change="+5.3% from last month"
            changeType="positive"
            icon={PiggyBank}
            delay={150}
          />
        </div>

        {/* Budget Overview Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <BudgetOverview />
          <BudgetCategories />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <BalanceChart />
          </div>
          <div>
            <SpendingBreakdown />
          </div>
        </div>

        {/* Transactions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TransactionList />
          
          {/* Quick Actions Card */}
          <div className="rounded-xl bg-card border border-border p-6 animate-slide-up" style={{ animationDelay: "350ms" }}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">Manage your finances</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Transfer Money", icon: "💸" },
                { label: "Pay Bills", icon: "📄" },
                { label: "Add Account", icon: "🏦" },
                { label: "Set Budget", icon: "📊" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-3 rounded-lg bg-secondary/50 p-5 transition-all hover:bg-secondary hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
