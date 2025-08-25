import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CollectionKPIs() {
  // TODO: Integrar com dados reais do Supabase
  const kpis = [
    {
      title: "Valor em Atraso",
      value: "R$ 45.280,00",
      icon: DollarSign,
      trend: { direction: "down", value: "12%" },
      variant: "destructive" as const
    },
    {
      title: "Taxa de Recuperação",
      value: "78.5%",
      icon: TrendingUp,
      trend: { direction: "up", value: "5%" },
      variant: "default" as const
    },
    {
      title: "Próximos Vencimentos",
      value: "23",
      subtitle: "Próximos 7 dias",
      icon: Clock,
      trend: { direction: "up", value: "3" },
      variant: "secondary" as const
    },
    {
      title: "Cobranças Ativas",
      value: "156",
      icon: AlertTriangle,
      trend: { direction: "down", value: "8" },
      variant: "default" as const
    },
    {
      title: "Pagamentos Hoje",
      value: "R$ 12.450,00",
      icon: CheckCircle,
      trend: { direction: "up", value: "R$ 2.100" },
      variant: "default" as const
    },
    {
      title: "DSO Médio",
      value: "32 dias",
      subtitle: "Days Sales Outstanding",
      icon: TrendingDown,
      trend: { direction: "down", value: "4 dias" },
      variant: "default" as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            {kpi.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
            )}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
              <Badge variant={kpi.variant} className="text-xs">
                {kpi.trend.direction === "up" ? "↗" : "↘"} {kpi.trend.value}
              </Badge>
              <span>vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}