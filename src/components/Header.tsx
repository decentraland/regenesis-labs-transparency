import { Bell, Settings } from "lucide-react";
import dclLogo from "@/assets/dcl-logo.png";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img src={dclLogo} alt="DCL Regenesis Labs" className="h-10 w-10 rounded-lg" />
            <span className="text-lg font-bold text-foreground hidden sm:block">DCL Regenesis Labs Financial Report</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-border">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-foreground">DCL Regenesis</p>
              <p className="text-xs text-muted-foreground">Financial Dashboard</p>
            </div>
            <img src={dclLogo} alt="DCL Regenesis Labs" className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
