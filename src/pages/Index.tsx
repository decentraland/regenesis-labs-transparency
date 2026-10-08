import { useEffect } from "react";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { BudgetOverview } from "@/components/BudgetOverview";
import { BudgetCategories } from "@/components/BudgetCategories";
import { AuditReport } from "@/components/AuditReport";
import { GrantsProgram } from "@/components/GrantsProgram";
import { Roadmap } from "@/components/Roadmap";
import { WalletCard } from "@/components/WalletCard";
import { useBalanceData } from "@/hooks/useBalanceData";
import { Wallet, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";

// Verbatim from the Specification of Governance proposal DAO:c9e5d8a (passed Nov 7, 2024).
const DAO_MISSION =
  "Ensure the sustainability of the Decentraland Ecosystem through representative governance, efficient management of collective resources, and technical innovation.";
const DAO_MISSION_PROPOSAL_URL = "https://decentraland.org/governance/proposal/?id=923d0c82-7ba7-4c39-836a-17f959741b1a";
const DAO_MISSION_DOCS_URL = "https://docs.decentraland.org/dao/dao/mission-vision-and-roles";
const DAO_TRANSPARENCY_URL = "https://decentraland.org/governance/transparency/";

const formatUsdValue = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const Index = () => {
  const { data: balanceData, isLoading } = useBalanceData();

  const operationalWallet = balanceData?.wallets.find(w => w.label === 'Operational');
  const treasuryWallet = balanceData?.wallets.find(w => w.label === 'Treasury');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(55_95%_55%_/_0.08)_0%,_transparent_50%)] pointer-events-none" />

      <Header />

      <main className="container relative px-4 py-8 md:px-6">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <p className="text-muted-foreground">Here you can check how DCL Regenesis Labs is allocating the funds.</p>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Decentraland DAO mission:</span>{" "}
            {DAO_MISSION}{" "}
            <a
              href={DAO_MISSION_PROPOSAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Approved proposal
            </a>
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a
              href={DAO_MISSION_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <span>Mission, vision &amp; roles</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={DAO_TRANSPARENCY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <span>DAO transparency</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <section id="treasury" className="scroll-mt-20">
          <h2
            className="text-xl font-semibold text-foreground hover:text-primary transition-colors cursor-pointer inline-block mb-4"
            onClick={() => history.replaceState(null, '', '#treasury')}
          >Treasury Overview</h2>
          {/* Metric Cards */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <MetricCard
              title="Total Portfolio Value"
              value={isLoading ? 'Loading...' : balanceData ? formatUsdValue(balanceData.totalPortfolioValue) : 'N/A'}
              change={balanceData ? `Updated ${new Date(balanceData.timestamp).toLocaleDateString()}` : ''}
              changeType="neutral"
              icon={Wallet}
              delay={0}
            />
            <MetricCard
              title="Operational Wallet"
              value={isLoading ? 'Loading...' : operationalWallet ? formatUsdValue(operationalWallet.totalUsdValue) : 'N/A'}
              change=""
              changeType="neutral"
              icon={TrendingUp}
              delay={50}
            />
            <MetricCard
              title="Treasury Wallet"
              value={isLoading ? 'Loading...' : treasuryWallet ? formatUsdValue(treasuryWallet.totalUsdValue) : 'N/A'}
              change=""
              changeType="neutral"
              icon={TrendingDown}
              delay={100}
            />
          </div>

          {/* Wallet Cards */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 items-start mb-8">
            <WalletCard
              wallet={operationalWallet}
              title="Operational Wallet"
              isLoading={isLoading}
              delay={150}
            />
            <WalletCard
              wallet={treasuryWallet}
              title="Treasury Wallet"
              isLoading={isLoading}
              delay={200}
            />
          </div>
        </section>

        {/* Budget Overview Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <BudgetOverview />
          <BudgetCategories />
        </div>

        {/* Grants Program Section (MANA) */}
        <div className="mb-8">
          <GrantsProgram />
        </div>

        {/* Audit Report Section */}
        <section id="audits" className="scroll-mt-20">
          <AuditReport />
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="scroll-mt-20">
          <Roadmap />
        </section>
        {/* <div className="mb-8 flex justify-center">
          <div className="rounded-xl bg-card border border-border p-6 animate-slide-up w-full max-w-md" style={{ animationDelay: "350ms" }}>
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
        </div> */}

      </main>
    </div>
  );
};

export default Index;
