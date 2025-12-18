import { Bell, Search, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">F</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">FinanceFlow</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="h-10 w-64 rounded-lg bg-secondary border-0 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <button className="relative rounded-lg p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </button>
          <button className="rounded-lg p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-border">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-foreground">Alex Morgan</p>
              <p className="text-xs text-muted-foreground">Premium Account</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-success flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">AM</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
