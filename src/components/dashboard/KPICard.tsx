import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: ReactNode;
  variant?: "default" | "success" | "warning" | "primary";
  className?: string;
}

export const KPICard = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = "default",
  className
}: KPICardProps) => {
  return (
    <div className={cn(
      "card-kpi",
      variant === "success" && "card-success",
      variant === "warning" && "card-warning", 
      variant === "primary" && "card-primary",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            variant === "success" && "bg-success/20 text-success",
            variant === "warning" && "bg-warning/20 text-warning",
            variant === "primary" && "bg-primary/20 text-primary",
            variant === "default" && "bg-muted text-foreground"
          )}>
            {icon}
          </div>
          <h3 className="font-medium text-muted-foreground text-sm">{title}</h3>
        </div>
      </div>

      {/* Main Value */}
      <div className="mb-2">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            trend.isPositive 
              ? "bg-success/20 text-success" 
              : "bg-destructive/20 text-destructive"
          )}>
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend.value)}%
          </div>
          <span className="text-xs text-muted-foreground">
            vs. mês anterior
          </span>
        </div>
      )}
    </div>
  );
};