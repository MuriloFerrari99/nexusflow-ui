import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Table, 
  TrendingUp, 
  Calendar,
  Users,
  DollarSign,
  Plus
} from "lucide-react";

interface WidgetLibraryProps {
  onAddWidget: (type: string) => void;
}

const widgetTypes = [
  {
    id: "kpi",
    name: "KPI Card",
    description: "Métrica simples com comparação",
    icon: TrendingUp,
    category: "Métricas",
    preview: "Receita Total\n$125,450\n+12% vs mês anterior"
  },
  {
    id: "line-chart",
    name: "Gráfico de Linha",
    description: "Tendências ao longo do tempo",
    icon: LineChart,
    category: "Gráficos",
    preview: "Vendas por mês"
  },
  {
    id: "bar-chart",
    name: "Gráfico de Barras",
    description: "Comparação entre categorias",
    icon: BarChart3,
    category: "Gráficos",
    preview: "Vendas por produto"
  },
  {
    id: "pie-chart",
    name: "Gráfico de Pizza",
    description: "Distribuição percentual",
    icon: PieChart,
    category: "Gráficos",
    preview: "Market share"
  },
  {
    id: "data-table",
    name: "Tabela de Dados",
    description: "Dados tabulares detalhados",
    icon: Table,
    category: "Tabelas",
    preview: "Lista de leads"
  },
  {
    id: "calendar-heatmap",
    name: "Mapa de Calor",
    description: "Atividade por período",
    icon: Calendar,
    category: "Especiais",
    preview: "Atividade por dia"
  },
  {
    id: "user-metrics",
    name: "Métricas de Usuário",
    description: "Performance individual",
    icon: Users,
    category: "RH",
    preview: "Top performers"
  },
  {
    id: "financial-summary",
    name: "Resumo Financeiro",
    description: "Indicadores financeiros",
    icon: DollarSign,
    category: "Financeiro",
    preview: "Fluxo de caixa"
  },
];

const categories = ["Todos", "Métricas", "Gráficos", "Tabelas", "Especiais", "RH", "Financeiro"];

export function WidgetLibrary({ onAddWidget }: WidgetLibraryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Biblioteca de Widgets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant="outline" 
              className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Widget Types */}
        <div className="space-y-3">
          {widgetTypes.map((widget) => {
            const IconComponent = widget.icon;
            return (
              <div
                key={widget.id}
                className="border rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer group"
                onClick={() => onAddWidget(widget.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-medium truncate">{widget.name}</h4>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{widget.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {widget.category}
                    </Badge>
                  </div>
                </div>
                
                {/* Preview */}
                <div className="mt-3 p-2 bg-muted/30 rounded text-xs text-center text-muted-foreground font-mono">
                  {widget.preview}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Ações Rápidas</h4>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => onAddWidget("dashboard-overview")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard Completo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => onAddWidget("sales-funnel")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Funil de Vendas
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}