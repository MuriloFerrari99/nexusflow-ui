import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, TrendingUp, TrendingDown, BarChart3, PieChart, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfQuarter, endOfQuarter, subWeeks, subMonths, subYears, subQuarters } from "date-fns";
import { ptBR } from "date-fns/locale";

// Import dos novos componentes
import { DREFilters, type DREFiltersData } from "./DREFilters";
import { DRECharts } from "./DRECharts";
import { DREExecutiveDashboard } from "./DREExecutiveDashboard";
import { DREDrillDown } from "./DREDrillDown";

interface DREData {
  period: string;
  receitaBruta: number;
  deducoes: number;
  receitaLiquida: number;
  custosDispesas: number;
  resultadoLiquido: number;
  margemBruta: number;
  margemLiquida: number;
  comparison?: {
    receitaBruta: number;
    resultadoLiquido: number;
    margemLiquida: number;
  };
}

interface PeriodData {
  vendas: number;
  servicos: number;
  outrasReceitas: number;
  impostos: number;
  devolucoes: number;
  custosDiretos: number;
  despesasOperacionais: number;
  despesasFinanceiras: number;
}

export function DRE() {
  const [activeTab, setActiveTab] = useState("executive");
  const [dreData, setDreData] = useState<DREData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Novos estados para os filtros e dados
  const [filters, setFilters] = useState<DREFiltersData>({
    period: 'month',
    categories: [],
    projects: [],
    responsibles: [],
    comparisonPeriod: 'previous'
  });
  
  const [chartsData, setChartsData] = useState<any>(null);
  const [executiveData, setExecutiveData] = useState<any>(null);
  const [drillDownData, setDrillDownData] = useState<any>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const calculateDRE = (current: PeriodData, previous?: PeriodData): DREData => {
    const receitaBruta = current.vendas + current.servicos + current.outrasReceitas;
    const deducoes = current.impostos + current.devolucoes;
    const receitaLiquida = receitaBruta - deducoes;
    const custosDispesas = current.custosDiretos + current.despesasOperacionais + current.despesasFinanceiras;
    const resultadoLiquido = receitaLiquida - custosDispesas;
    
    const margemBruta = receitaBruta > 0 ? ((receitaLiquida / receitaBruta) * 100) : 0;
    const margemLiquida = receitaLiquida > 0 ? ((resultadoLiquido / receitaLiquida) * 100) : 0;

    let comparison;
    if (previous) {
      const prevReceitaBruta = previous.vendas + previous.servicos + previous.outrasReceitas;
      const prevReceitaLiquida = prevReceitaBruta - (previous.impostos + previous.devolucoes);
      const prevResultadoLiquido = prevReceitaLiquida - (previous.custosDiretos + previous.despesasOperacionais + previous.despesasFinanceiras);
      const prevMargemLiquida = prevReceitaLiquida > 0 ? ((prevResultadoLiquido / prevReceitaLiquida) * 100) : 0;

      comparison = {
        receitaBruta: prevReceitaBruta > 0 ? (((receitaBruta - prevReceitaBruta) / prevReceitaBruta) * 100) : 0,
        resultadoLiquido: prevResultadoLiquido !== 0 ? (((resultadoLiquido - prevResultadoLiquido) / Math.abs(prevResultadoLiquido)) * 100) : 0,
        margemLiquida: margemLiquida - prevMargemLiquida
      };
    }

    return {
      period: filters.period,
      receitaBruta,
      deducoes,
      receitaLiquida,
      custosDispesas,
      resultadoLiquido,
      margemBruta,
      margemLiquida,
      comparison
    };
  };

  const getPeriodDates = (period: string, customRange?: { from?: Date; to?: Date }) => {
    const now = new Date();
    
    if (period === 'custom' && customRange?.from && customRange?.to) {
      return {
        start: customRange.from,
        end: customRange.to,
        prevStart: new Date(customRange.from.getTime() - (customRange.to.getTime() - customRange.from.getTime())),
        prevEnd: customRange.from
      };
    }
    
    switch (period) {
      case "week":
        return {
          start: startOfWeek(now, { locale: ptBR }),
          end: endOfWeek(now, { locale: ptBR }),
          prevStart: startOfWeek(subWeeks(now, 1), { locale: ptBR }),
          prevEnd: endOfWeek(subWeeks(now, 1), { locale: ptBR })
        };
      case "month":
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          prevStart: startOfMonth(subMonths(now, 1)),
          prevEnd: endOfMonth(subMonths(now, 1))
        };
      case "quarter":
        return {
          start: startOfQuarter(now),
          end: endOfQuarter(now),
          prevStart: startOfQuarter(subQuarters(now, 1)),
          prevEnd: endOfQuarter(subQuarters(now, 1))
        };
      case "year":
        return {
          start: startOfYear(now),
          end: endOfYear(now),
          prevStart: startOfYear(subYears(now, 1)),
          prevEnd: endOfYear(subYears(now, 1))
        };
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          prevStart: startOfMonth(subMonths(now, 1)),
          prevEnd: endOfMonth(subMonths(now, 1))
        };
    }
  };

  const loadDREData = async () => {
    try {
      setLoading(true);
      const { start, end, prevStart, prevEnd } = getPeriodDates(filters.period, filters.dateRange);

      // Buscar dados do período atual
      const [
        { data: currentInvoices },
        { data: currentTransactions },
        { data: currentPayments }
      ] = await Promise.all([
        supabase
          .from("invoices")
          .select("total_amount, status, created_at")
          .eq("status", "paid")
          .gte("created_at", start.toISOString())
          .lte("created_at", end.toISOString()),
        
        supabase
          .from("financial_transactions")
          .select("amount, transaction_type, category_id, created_at, financial_categories(name, category_type)")
          .gte("created_at", start.toISOString())
          .lte("created_at", end.toISOString()),
        
        supabase
          .from("payments")
          .select("amount, created_at")
          .gte("created_at", start.toISOString())
          .lte("created_at", end.toISOString())
      ]);

      // Buscar dados do período anterior para comparação
      const [
        { data: prevInvoices },
        { data: prevTransactions },
        { data: prevPayments }
      ] = await Promise.all([
        supabase
          .from("invoices")
          .select("total_amount, status, created_at")
          .eq("status", "paid")
          .gte("created_at", prevStart.toISOString())
          .lte("created_at", prevEnd.toISOString()),
        
        supabase
          .from("financial_transactions")
          .select("amount, transaction_type, category_id, created_at, financial_categories(name, category_type)")
          .gte("created_at", prevStart.toISOString())
          .lte("created_at", prevEnd.toISOString()),
        
        supabase
          .from("payments")
          .select("amount, created_at")
          .gte("created_at", prevStart.toISOString())
          .lte("created_at", prevEnd.toISOString())
      ]);

      // Processar dados do período atual
      const current: PeriodData = {
        vendas: currentInvoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0,
        servicos: currentTransactions?.filter(t => t.transaction_type === 'income' && t.financial_categories?.category_type === 'service').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        outrasReceitas: currentTransactions?.filter(t => t.transaction_type === 'income' && !['revenue', 'service'].includes(t.financial_categories?.category_type || '')).reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        impostos: currentTransactions?.filter(t => t.transaction_type === 'expense' && t.financial_categories?.category_type === 'tax').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        devolucoes: currentTransactions?.filter(t => t.transaction_type === 'expense' && t.financial_categories?.category_type === 'refund').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        custosDiretos: currentTransactions?.filter(t => t.transaction_type === 'expense' && t.financial_categories?.category_type === 'material').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        despesasOperacionais: currentTransactions?.filter(t => t.transaction_type === 'expense' && ['operational', 'salary', 'rent', 'marketing'].includes(t.financial_categories?.category_type || '')).reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        despesasFinanceiras: currentTransactions?.filter(t => t.transaction_type === 'expense' && t.financial_categories?.category_type === 'financial').reduce((sum, t) => sum + Number(t.amount), 0) || 0
      };

      // Processar dados do período anterior
      const previous: PeriodData = {
        vendas: prevInvoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0,
        servicos: prevTransactions?.filter(t => t.transaction_type === 'income' && t.financial_categories?.category_type === 'service').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        outrasReceitas: prevTransactions?.filter(t => t.transaction_type === 'income' && !['revenue', 'service'].includes(t.financial_categories?.category_type || '')).reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        impostos: prevTransactions?.filter(t => t.transaction_type === 'expense' && t.financial_categories?.category_type === 'tax').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        devolucoes: prevTransactions?.filter(t => t.transaction_type === 'expense' && t.financial_categories?.category_type === 'refund').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        custosDiretos: prevTransactions?.filter(t => t.transaction_type === 'expense' && t.financial_categories?.category_type === 'material').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        despesasOperacionais: prevTransactions?.filter(t => t.transaction_type === 'expense' && ['operational', 'salary', 'rent', 'marketing'].includes(t.financial_categories?.category_type || '')).reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        despesasFinanceiras: prevTransactions?.filter(t => t.transaction_type === 'expense' && t.financial_categories?.category_type === 'financial').reduce((sum, t) => sum + Number(t.amount), 0) || 0
      };

      const dre = calculateDRE(current, previous);
      setDreData(dre);

      // Gerar dados para os gráficos
      await loadChartsData();
      await loadExecutiveData(dre);
      await loadDrillDownData();

    } catch (error) {
      console.error("Erro ao carregar dados da DRE:", error);
      toast.error("Erro ao carregar dados da DRE");
    } finally {
      setLoading(false);
    }
  };

  const loadChartsData = async () => {
    try {
      // Dados fictícios para demonstração - substitua pela lógica real
      const monthlyData = [
        { month: 'Jan', receita: 120000, custos: 80000, resultado: 40000, margem: 33.3 },
        { month: 'Fev', receita: 135000, custos: 85000, resultado: 50000, margem: 37.0 },
        { month: 'Mar', receita: 150000, custos: 90000, resultado: 60000, margem: 40.0 },
        { month: 'Abr', receita: 140000, custos: 88000, resultado: 52000, margem: 37.1 },
        { month: 'Mai', receita: 165000, custos: 95000, resultado: 70000, margem: 42.4 },
        { month: 'Jun', receita: 180000, custos: 100000, resultado: 80000, margem: 44.4 }
      ];

      const categoriesData = [
        { name: 'Pessoal', value: 45000, color: 'hsl(var(--destructive))' },
        { name: 'Marketing', value: 25000, color: 'hsl(var(--warning))' },
        { name: 'Operacional', value: 20000, color: 'hsl(var(--primary))' },
        { name: 'Financeiro', value: 10000, color: 'hsl(var(--success))' }
      ];

      const trendsData = {
        receita: { value: 180000, change: 15.2 },
        custos: { value: 100000, change: -5.1 },
        margem: { value: 44.4, change: 7.3 }
      };

      setChartsData({
        monthly: monthlyData,
        categories: categoriesData,
        trends: trendsData
      });
    } catch (error) {
      console.error("Erro ao carregar dados dos gráficos:", error);
    }
  };

  const loadExecutiveData = async (dreData: DREData) => {
    try {
      // Dados fictícios para demonstração - substitua pela lógica real
      const executiveData = {
        kpis: {
          receitaTotal: { value: dreData.receitaBruta, target: 200000, change: 15.2 },
          margemLiquida: { value: dreData.margemLiquida, target: 40, change: 7.3 },
          custoTotal: { value: dreData.custosDispesas, budget: 120000, change: -5.1 },
          ebitda: { value: dreData.resultadoLiquido * 1.15, target: 100000, change: 12.8 }
        },
        alerts: [
          {
            type: 'warning' as const,
            title: 'Custos de Marketing Elevados',
            description: 'Custos de marketing 15% acima do orçado este mês',
            action: 'Revisar campanhas'
          }
        ],
        projections: {
          endOfMonth: { receita: 220000, margem: 45.2 },
          endOfYear: { receita: 2400000, margem: 42.8 }
        },
        benchmarks: {
          industryAverage: 38.5,
          topPerformers: 52.3,
          position: dreData.margemLiquida > 38.5 ? 'above' as const : 'below' as const
        }
      };

      setExecutiveData(executiveData);
    } catch (error) {
      console.error("Erro ao carregar dados executivos:", error);
    }
  };

  const loadDrillDownData = async () => {
    try {
      // Dados fictícios para demonstração - substitua pela lógica real
      const drillDownData = {
        receitas: [
          {
            id: '1',
            name: 'Vendas de Produtos',
            value: 120000,
            percentage: 66.7,
            change: 15.2,
            category: 'Produto',
            hasChildren: true,
            children: [
              {
                id: '1.1',
                name: 'Produto A',
                value: 80000,
                percentage: 44.4,
                category: 'Solar',
                hasChildren: false
              }
            ]
          }
        ],
        custos: [
          {
            id: '2',
            name: 'Custos de Material',
            value: 60000,
            percentage: 60.0,
            change: -2.1,
            category: 'Direto',
            hasChildren: false
          }
        ],
        despesas: [
          {
            id: '3',
            name: 'Despesas de Pessoal',
            value: 45000,
            percentage: 45.0,
            change: 8.5,
            category: 'Operacional',
            hasChildren: false
          }
        ]
      };

      setDrillDownData(drillDownData);
    } catch (error) {
      console.error("Erro ao carregar dados de drill-down:", error);
    }
  };

  const exportToExcel = () => {
    if (!dreData) return;

    const data = [
      ["DEMONSTRATIVO DE RESULTADO DO EXERCÍCIO"],
      [""],
      ["RECEITA BRUTA", formatCurrency(dreData.receitaBruta)],
      ["(-) DEDUÇÕES", formatCurrency(-dreData.deducoes)],
      ["= RECEITA LÍQUIDA", formatCurrency(dreData.receitaLiquida)],
      [""],
      ["(-) CUSTOS E DESPESAS", formatCurrency(-dreData.custosDispesas)],
      [""],
      ["= RESULTADO LÍQUIDO", formatCurrency(dreData.resultadoLiquido)],
      [""],
      ["INDICADORES"],
      ["Margem Bruta (%)", formatPercentage(dreData.margemBruta)],
      ["Margem Líquida (%)", formatPercentage(dreData.margemLiquida)]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DRE");
    
    const fileName = `dre-${filters.period}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success("DRE exportada com sucesso!");
  };

  useEffect(() => {
    loadDREData();
  }, [filters]);

  const getPeriodLabel = () => {
    switch (filters.period) {
      case "week": return "Semana Atual";
      case "month": return "Mês Atual";
      case "quarter": return "Trimestre Atual";
      case "year": return "Ano Atual";
      case "custom": return "Período Personalizado";
      default: return "Mês Atual";
    }
  };

  const renderComparisonIcon = (value: number) => {
    if (value > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (value < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">DRE - Demonstrativo de Resultado</h2>
            <p className="text-muted-foreground">Análise de receitas, custos e resultados</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">DRE - Demonstrativo de Resultado</h2>
          <p className="text-muted-foreground">Módulo completo de análise financeira e Business Intelligence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel} disabled={!dreData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros Avançados */}
      <DREFilters 
        filters={filters} 
        onFiltersChange={setFilters}
        categories={[
          { id: '1', name: 'Marketing' },
          { id: '2', name: 'Vendas' },
          { id: '3', name: 'Operacional' }
        ]}
        projects={[
          { id: '1', name: 'Projeto Solar A' },
          { id: '2', name: 'Projeto Solar B' }
        ]}
        responsibles={[
          { id: '1', name: 'João Silva' },
          { id: '2', name: 'Maria Santos' }
        ]}
      />

      {/* Tabs para diferentes visões */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="executive" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Executivo
          </TabsTrigger>
          <TabsTrigger value="traditional" className="flex items-center gap-2">
            DRE Tradicional
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Gráficos
          </TabsTrigger>
          <TabsTrigger value="drilldown" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Drill-Down
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            Orçamento
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Executivo */}
        <TabsContent value="executive">
          {executiveData && (
            <DREExecutiveDashboard
              data={executiveData}
              period={getPeriodLabel()}
              onExport={exportToExcel}
            />
          )}
        </TabsContent>

        {/* DRE Tradicional */}
        <TabsContent value="traditional">
          {dreData && (
            <>
              {/* KPIs Principais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Receita Bruta - {getPeriodLabel()}</CardDescription>
                    <CardTitle className="text-2xl text-success">
                      {formatCurrency(dreData.receitaBruta)}
                    </CardTitle>
                    {dreData.comparison && (
                      <div className="flex items-center gap-1 text-sm">
                        {renderComparisonIcon(dreData.comparison.receitaBruta)}
                        <span className={dreData.comparison.receitaBruta >= 0 ? "text-success" : "text-destructive"}>
                          {dreData.comparison.receitaBruta >= 0 ? "+" : ""}{formatPercentage(dreData.comparison.receitaBruta)}
                        </span>
                      </div>
                    )}
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Resultado Líquido</CardDescription>
                    <CardTitle className={`text-2xl ${dreData.resultadoLiquido >= 0 ? "text-success" : "text-destructive"}`}>
                      {formatCurrency(dreData.resultadoLiquido)}
                    </CardTitle>
                    {dreData.comparison && (
                      <div className="flex items-center gap-1 text-sm">
                        {renderComparisonIcon(dreData.comparison.resultadoLiquido)}
                        <span className={dreData.comparison.resultadoLiquido >= 0 ? "text-success" : "text-destructive"}>
                          {dreData.comparison.resultadoLiquido >= 0 ? "+" : ""}{formatPercentage(dreData.comparison.resultadoLiquido)}
                        </span>
                      </div>
                    )}
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Margem Bruta</CardDescription>
                    <CardTitle className="text-2xl text-primary">
                      {formatPercentage(dreData.margemBruta)}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Margem Líquida</CardDescription>
                    <CardTitle className={`text-2xl ${dreData.margemLiquida >= 0 ? "text-success" : "text-destructive"}`}>
                      {formatPercentage(dreData.margemLiquida)}
                    </CardTitle>
                    {dreData.comparison && (
                      <div className="flex items-center gap-1 text-sm">
                        {renderComparisonIcon(dreData.comparison.margemLiquida)}
                        <span className={dreData.comparison.margemLiquida >= 0 ? "text-success" : "text-destructive"}>
                          {dreData.comparison.margemLiquida >= 0 ? "+" : ""}{formatPercentage(dreData.comparison.margemLiquida)}
                        </span>
                      </div>
                    )}
                  </CardHeader>
                </Card>
              </div>

              {/* Tabela DRE */}
              <Card>
                <CardHeader>
                  <CardTitle>Demonstrativo de Resultado - {getPeriodLabel()}</CardTitle>
                  <CardDescription>
                    Estrutura detalhada de receitas, custos e resultados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60%]">Conta</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">% Receita Líq.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-success-light/50">
                        <TableCell className="font-medium text-success">
                          RECEITA BRUTA
                        </TableCell>
                        <TableCell className="text-right font-semibold text-success">
                          {formatCurrency(dreData.receitaBruta)}
                        </TableCell>
                        <TableCell className="text-right text-success">
                          {dreData.receitaLiquida > 0 ? formatPercentage((dreData.receitaBruta / dreData.receitaLiquida) * 100) : "-"}
                        </TableCell>
                      </TableRow>
                    
                      <TableRow>
                        <TableCell className="pl-8 text-destructive">
                          (-) Deduções
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          {formatCurrency(-dreData.deducoes)}
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          {dreData.receitaLiquida > 0 ? formatPercentage((dreData.deducoes / dreData.receitaLiquida) * 100) : "-"}
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-t-2 bg-primary/10">
                        <TableCell className="font-bold text-primary">
                          = RECEITA LÍQUIDA
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          {formatCurrency(dreData.receitaLiquida)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          100,0%
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="text-destructive">
                          (-) Custos e Despesas
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          {formatCurrency(-dreData.custosDispesas)}
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          {dreData.receitaLiquida > 0 ? formatPercentage((dreData.custosDispesas / dreData.receitaLiquida) * 100) : "-"}
                        </TableCell>
                      </TableRow>

                      <TableRow className={`border-t-2 font-bold ${dreData.resultadoLiquido >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                        <TableCell className={dreData.resultadoLiquido >= 0 ? 'text-success' : 'text-destructive'}>
                          = RESULTADO LÍQUIDO
                        </TableCell>
                        <TableCell className={`text-right font-bold ${dreData.resultadoLiquido >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatCurrency(dreData.resultadoLiquido)}
                        </TableCell>
                        <TableCell className={`text-right font-bold ${dreData.resultadoLiquido >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatPercentage(dreData.margemLiquida)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Gráficos e Visualizações */}
        <TabsContent value="charts">
          {chartsData && (
            <DRECharts data={chartsData} />
          )}
        </TabsContent>

        {/* Drill-Down Analysis */}
        <TabsContent value="drilldown">
          {drillDownData && (
            <DREDrillDown 
              data={drillDownData}
              onItemClick={(item) => console.log('Item clicked:', item)}
            />
          )}
        </TabsContent>

        {/* Módulo de Orçamento */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Módulo de Orçamento</CardTitle>
              <CardDescription>
                Em desenvolvimento - Orçado vs Realizado, Projeções e Cenários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Funcionalidade em desenvolvimento para a próxima fase
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}