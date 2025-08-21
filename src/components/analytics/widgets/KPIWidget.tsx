import { TrendingUp, TrendingDown, DollarSign, Users, Package, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIWidgetProps {
  config: {
    metric?: string;
    value?: number;
    comparison?: {
      period: string;
      value: number;
    };
    format?: "number" | "currency" | "percentage";
    icon?: string;
  };
}

const iconMap = {
  dollar: DollarSign,
  users: Users,
  package: Package,
  target: Target,
};

export function KPIWidget({ config }: KPIWidgetProps) {
  const {
    metric = "Métrica",
    value = 0,
    comparison = { period: "mês anterior", value: 0 },
    format = "number",
    icon = "target"
  } = config;

  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(val);
      case "percentage":
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat("pt-BR").format(val);
    }
  };

  const isPositive = comparison.value >= 0;
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Target;

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{metric}</p>
          <p className="text-2xl font-bold">{formatValue(value)}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-green-600" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-600" />
        )}
        <span
          className={cn(
            "text-sm font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}
        >
          {isPositive ? "+" : ""}{comparison.value.toFixed(1)}%
        </span>
        <span className="text-sm text-muted-foreground">
          vs {comparison.period}
        </span>
      </div>
    </div>
  );
}