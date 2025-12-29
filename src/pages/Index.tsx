import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { BalanceChart } from "@/components/BalanceChart";
import { BudgetOverview } from "@/components/BudgetOverview";
import { BudgetCategories } from "@/components/BudgetCategories";
import { AuditReport } from "@/components/AuditReport";
import { Roadmap } from "@/components/Roadmap";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(55_95%_55%_/_0.08)_0%,_transparent_50%)] pointer-events-none" />
      
      <Header />
      
      <main className="container relative px-4 py-8 md:px-6">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">DCL Regenesis Labs</h1>
          <p className="text-muted-foreground mt-1">Here you can check how DCL Regenesis Labs is allocating the funds.</p>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
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
        </div>

        {/* Wallet Cards */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 mb-8">
          <div className="rounded-xl bg-card border border-border p-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Operational Wallet</h3>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-3">$25,340</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stable Coin (USDC)</span>
                <span className="font-medium text-foreground">15,000 USDC</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">$MANA</span>
                <span className="font-medium text-foreground">24,500 MANA</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Treasury Wallet</h3>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-3">$122,180</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stable Coin (USDC)</span>
                <span className="font-medium text-foreground">85,000 USDC</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">$MANA</span>
                <span className="font-medium text-foreground">88,000 MANA</span>
              </div>
            </div>
          </div>
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
          
          {/* Quick Actions Card */}
          <div className="rounded-xl bg-card border border-border p-6 animate-slide-up" style={{ animationDelay: "350ms" }}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">Manage your finances</p>
            </div>
            <button
              onClick={() => window.location.href = 'mailto:xxxxx@example.com'}
              className="flex items-center justify-center gap-3 rounded-lg bg-primary text-primary-foreground w-full p-5 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-2xl">✉️</span>
              <span className="text-sm font-medium">Send an Email</span>
            </button>
          </div>
        </div>

        {/* Audit Report Section */}
        <AuditReport />

        {/* Roadmap Section */}
        <Roadmap />
      </main>
    </div>
  );
};

export default Index;
