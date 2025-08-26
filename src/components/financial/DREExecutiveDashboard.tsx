import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  DollarSign, 
  Percent,
  Calendar,
  Download
} from "lucide-react";

interface DREExecutiveData {
  kpis: {
    receitaTotal: { value: number; target: number; change: number };
    margemLiquida: { value: number; target: number; change: number };
    custoTotal: { value: number; budget: number; change: number };
    ebitda: { value: number; target: number; change: number };
  };
  alerts: Array<{
    type: 'warning' | 'danger' | 'info';
    title: string;
    description: string;
    action?: string;
  }>;
  projections: {
    endOfMonth: { receita: number; margem: number };
    endOfYear: { receita: number; margem: number };
  };
  benchmarks: {
    industryAverage: number;
    topPerformers: number;
    position: 'above' | 'below' | 'at';
  };
}

interface DREExecutiveDashboardProps {
  data: DREExecutiveData;
  period: string;
  onExport: () => void;
}

export function DREExecutiveDashboard({ data, period, onExport }: DREExecutiveDashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'bg-success';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-destructive';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <AlertTriangle className="h-4 w-4 text-primary" />;
    }
  };

  const TrendIndicator = ({ value, showIcon = true }: { value: number; showIcon?: boolean }) => {
    const isPositive = value >= 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
        {showIcon && (isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)}
        <span className="text-sm font-medium">
          {isPositive ? '+' : ''}{formatPercentage(value)}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com Ações */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Dashboard Executivo - DRE</h3>
          <p className="text-sm text-muted-foreground">
            Visão estratégica da performance financeira
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Relatório Executivo
          </Button>
        </div>
      </div>

      {/* KPIs Executivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Total */}
        <Card className="card-success">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold text-success">
              {formatCurrency(data.kpis.receitaTotal.value)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Meta: {formatCurrency(data.kpis.receitaTotal.target)}</span>
                <span>{((data.kpis.receitaTotal.value / data.kpis.receitaTotal.target) * 100).toFixed(0)}%</span>
              </div>
              <Progress 
                value={(data.kpis.receitaTotal.value / data.kpis.receitaTotal.target) * 100} 
                className="h-2"
              />
            </div>
            <TrendIndicator value={data.kpis.receitaTotal.change} />
          </CardContent>
        </Card>

        {/* Margem Líquida */}
        <Card className="card-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Margem Líquida</CardTitle>
              <Percent className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`text-2xl font-bold ${data.kpis.margemLiquida.value >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatPercentage(data.kpis.margemLiquida.value)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Meta: {formatPercentage(data.kpis.margemLiquida.target)}</span>
                <Badge variant={data.kpis.margemLiquida.value >= data.kpis.margemLiquida.target ? "default" : "destructive"}>
                  {data.kpis.margemLiquida.value >= data.kpis.margemLiquida.target ? 'Atingida' : 'Abaixo'}
                </Badge>
              </div>
              <Progress 
                value={Math.min((Math.abs(data.kpis.margemLiquida.value) / Math.abs(data.kpis.margemLiquida.target)) * 100, 100)} 
                className="h-2"
              />
            </div>
            <TrendIndicator value={data.kpis.margemLiquida.change} />
          </CardContent>
        </Card>

        {/* Custo Total */}
        <Card className="card-warning">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
              <Target className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(data.kpis.custoTotal.value)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Orçado: {formatCurrency(data.kpis.custoTotal.budget)}</span>
                <span>{((data.kpis.custoTotal.value / data.kpis.custoTotal.budget) * 100).toFixed(0)}%</span>
              </div>
              <Progress 
                value={(data.kpis.custoTotal.value / data.kpis.custoTotal.budget) * 100} 
                className="h-2"
              />
            </div>
            <TrendIndicator value={data.kpis.custoTotal.change} />
          </CardContent>
        </Card>

        {/* EBITDA */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">EBITDA</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`text-2xl font-bold ${data.kpis.ebitda.value >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(data.kpis.ebitda.value)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Meta: {formatCurrency(data.kpis.ebitda.target)}</span>
                <span>{((data.kpis.ebitda.value / data.kpis.ebitda.target) * 100).toFixed(0)}%</span>
              </div>
              <Progress 
                value={(data.kpis.ebitda.value / data.kpis.ebitda.target) * 100} 
                className="h-2"
              />
            </div>
            <TrendIndicator value={data.kpis.ebitda.change} />
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Projeções */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Inteligentes */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas e Recomendações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.alerts.length > 0 ? (
              data.alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium">{alert.title}</h4>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                    {alert.action && (
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        {alert.action}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-success mb-2">✓</div>
                <p className="text-sm text-muted-foreground">
                  Nenhum alerta. Performance dentro dos parâmetros esperados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projeções */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Projeções
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                Fim do Mês
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Receita Projetada</div>
                  <div className="text-lg font-semibold text-success">
                    {formatCurrency(data.projections.endOfMonth.receita)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Margem Projetada</div>
                  <div className="text-lg font-semibold text-primary">
                    {formatPercentage(data.projections.endOfMonth.margem)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Fim do Ano</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Receita Anual</div>
                  <div className="text-lg font-semibold text-success">
                    {formatCurrency(data.projections.endOfYear.receita)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Margem Anual</div>
                  <div className="text-lg font-semibold text-primary">
                    {formatPercentage(data.projections.endOfYear.margem)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benchmark Setorial */}
      <Card>
        <CardHeader>
          <CardTitle>Benchmark Setorial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Sua Margem</div>
              <div className="text-2xl font-bold text-primary">
                {formatPercentage(data.kpis.margemLiquida.value)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Média do Setor</div>
              <div className="text-2xl font-bold text-muted-foreground">
                {formatPercentage(data.benchmarks.industryAverage)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Top Performers</div>
              <div className="text-2xl font-bold text-success">
                {formatPercentage(data.benchmarks.topPerformers)}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Badge 
              variant={data.benchmarks.position === 'above' ? "default" : "secondary"}
              className="gap-1"
            >
              {data.benchmarks.position === 'above' && <TrendingUp className="h-3 w-3" />}
              {data.benchmarks.position === 'below' && <TrendingDown className="h-3 w-3" />}
              {data.benchmarks.position === 'above' ? 'Acima' : 
               data.benchmarks.position === 'below' ? 'Abaixo' : 'Na média'} da média setorial
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}