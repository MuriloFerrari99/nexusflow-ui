import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subWeeks, subMonths, subYears } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [dreData, setDreData] = useState<DREData | null>(null);
  const [loading, setLoading] = useState(true);

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
      period: selectedPeriod,
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

  const getPeriodDates = (period: string) => {
    const now = new Date();
    
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
      const { start, end, prevStart, prevEnd } = getPeriodDates(selectedPeriod);

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

    } catch (error) {
      console.error("Erro ao carregar dados da DRE:", error);
      toast.error("Erro ao carregar dados da DRE");
    } finally {
      setLoading(false);
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
    
    const fileName = `dre-${selectedPeriod}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success("DRE exportada com sucesso!");
  };

  useEffect(() => {
    loadDREData();
  }, [selectedPeriod]);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "week": return "Semana Atual";
      case "month": return "Mês Atual";
      case "year": return "Ano Atual";
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
          <p className="text-muted-foreground">Análise de receitas, custos e resultados por período</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportToExcel} disabled={!dreData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {dreData && (
        <>
          {/* KPIs Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Receita Bruta - {getPeriodLabel()}</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {formatCurrency(dreData.receitaBruta)}
                </CardTitle>
                {dreData.comparison && (
                  <div className="flex items-center gap-1 text-sm">
                    {renderComparisonIcon(dreData.comparison.receitaBruta)}
                    <span className={dreData.comparison.receitaBruta >= 0 ? "text-green-600" : "text-red-600"}>
                      {dreData.comparison.receitaBruta >= 0 ? "+" : ""}{formatPercentage(dreData.comparison.receitaBruta)}
                    </span>
                  </div>
                )}
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Resultado Líquido</CardDescription>
                <CardTitle className={`text-2xl ${dreData.resultadoLiquido >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(dreData.resultadoLiquido)}
                </CardTitle>
                {dreData.comparison && (
                  <div className="flex items-center gap-1 text-sm">
                    {renderComparisonIcon(dreData.comparison.resultadoLiquido)}
                    <span className={dreData.comparison.resultadoLiquido >= 0 ? "text-green-600" : "text-red-600"}>
                      {dreData.comparison.resultadoLiquido >= 0 ? "+" : ""}{formatPercentage(dreData.comparison.resultadoLiquido)}
                    </span>
                  </div>
                )}
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Margem Bruta</CardDescription>
                <CardTitle className="text-2xl text-blue-600">
                  {formatPercentage(dreData.margemBruta)}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Margem Líquida</CardDescription>
                <CardTitle className={`text-2xl ${dreData.margemLiquida >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatPercentage(dreData.margemLiquida)}
                </CardTitle>
                {dreData.comparison && (
                  <div className="flex items-center gap-1 text-sm">
                    {renderComparisonIcon(dreData.comparison.margemLiquida)}
                    <span className={dreData.comparison.margemLiquida >= 0 ? "text-green-600" : "text-red-600"}>
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
                  <TableRow className="bg-green-50 dark:bg-green-950/20">
                    <TableCell className="font-medium text-green-700 dark:text-green-400">
                      RECEITA BRUTA
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-700 dark:text-green-400">
                      {formatCurrency(dreData.receitaBruta)}
                    </TableCell>
                    <TableCell className="text-right text-green-700 dark:text-green-400">
                      {dreData.receitaLiquida > 0 ? formatPercentage((dreData.receitaBruta / dreData.receitaLiquida) * 100) : "-"}
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="pl-8 text-red-700 dark:text-red-400">
                      (-) Deduções
                    </TableCell>
                    <TableCell className="text-right text-red-700 dark:text-red-400">
                      {formatCurrency(-dreData.deducoes)}
                    </TableCell>
                    <TableCell className="text-right text-red-700 dark:text-red-400">
                      {dreData.receitaLiquida > 0 ? formatPercentage((dreData.deducoes / dreData.receitaLiquida) * 100) : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-t-2 bg-blue-50 dark:bg-blue-950/20">
                    <TableCell className="font-bold text-blue-700 dark:text-blue-400">
                      = RECEITA LÍQUIDA
                    </TableCell>
                    <TableCell className="text-right font-bold text-blue-700 dark:text-blue-400">
                      {formatCurrency(dreData.receitaLiquida)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-blue-700 dark:text-blue-400">
                      100,0%
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="text-red-700 dark:text-red-400">
                      (-) Custos e Despesas
                    </TableCell>
                    <TableCell className="text-right text-red-700 dark:text-red-400">
                      {formatCurrency(-dreData.custosDispesas)}
                    </TableCell>
                    <TableCell className="text-right text-red-700 dark:text-red-400">
                      {dreData.receitaLiquida > 0 ? formatPercentage((dreData.custosDispesas / dreData.receitaLiquida) * 100) : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow className={`border-t-2 font-bold ${dreData.resultadoLiquido >= 0 ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
                    <TableCell className={dreData.resultadoLiquido >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                      = RESULTADO LÍQUIDO
                    </TableCell>
                    <TableCell className={`text-right font-bold ${dreData.resultadoLiquido >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {formatCurrency(dreData.resultadoLiquido)}
                    </TableCell>
                    <TableCell className={`text-right font-bold ${dreData.resultadoLiquido >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {formatPercentage(dreData.margemLiquida)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}