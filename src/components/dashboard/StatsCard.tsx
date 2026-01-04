import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

const StatsCard = ({ title, value, change, changeType, icon: Icon, iconColor = "bg-accent/10 text-accent" }: StatsCardProps) => {
  return (
    <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border hover:shadow-medium transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center", iconColor)}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <span className={cn(
          "text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full",
          changeType === "positive" && "bg-success/10 text-success",
          changeType === "negative" && "bg-destructive/10 text-destructive",
          changeType === "neutral" && "bg-muted text-muted-foreground"
        )}>
          {change}
        </span>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1 group-hover:text-accent transition-colors">
        {value}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
    </div>
  );
};

export default StatsCard;
