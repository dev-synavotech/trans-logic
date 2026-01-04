import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  role?: "admin" | "support" | "affiliate" | "customer" | "provider";
}

const roleLabels = {
  admin: { title: "Admin User", subtitle: "admin@translogic.io" },
  support: { title: "Support Agent", subtitle: "support@translogic.io" },
  affiliate: { title: "Affiliate Partner", subtitle: "partner@translogic.io" },
  customer: { title: "Customer", subtitle: "customer@translogic.io" },
  provider: { title: "Fleet Provider", subtitle: "provider@translogic.io" },
};

const DashboardHeader = ({ role = "admin" }: DashboardHeaderProps) => {
  const { title, subtitle } = roleLabels[role];
  return (
    <header className="h-14 sm:h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 ml-12 lg:ml-0">
      {/* Search */}
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-9 sm:h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-2 h-2 rounded-full bg-accent animate-pulse" />
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent flex items-center justify-center">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
