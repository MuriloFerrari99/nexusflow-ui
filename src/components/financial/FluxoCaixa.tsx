import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, TrendingUp, TrendingDown, DollarSign, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

interface DailyFluxoItem {
  date: string;
  contasPagar: number;
  contasReceber: number;
  saldoInicial: number;
  total: number;
}

interface FluxoItem {
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  balance: number;
}

export function FluxoCaixa() {
  const [fluxoData, setFluxoData] = useState<FluxoItem[]>([]);
  const [dailyFluxoData, setDailyFluxoData] = useState<DailyFluxoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<string>("30");

  useEffect(() => {
    loadFluxoData();
  }, [periodFilter]);

  const loadFluxoData = async () => {
    try {
      setLoading(true);
      
      const daysBack = parseInt(periodFilter);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);
      
      // Buscar saldo inicial das contas financeiras
      const { data: accounts, error: accountError } = await supabase
        .from('financial_accounts')
        .select('balance')
        .eq('is_active', true);

      if (accountError) throw accountError;

      const initialBalance = accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0;
      
      // Buscar transações
      const { data: transactions, error: transError } = await supabase
        .from('financial_transactions')
        .select(`
          id,
          description,
          amount,
          transaction_type,
          transaction_date,
          financial_categories (
            name
          )
        `)
        .gte('transaction_date', startDate.toISOString().split('T')[0])
        .eq('status', 'completed')
        .order('transaction_date', { ascending: true });

      if (transError) throw transError;

      // Buscar faturas pagas
      const { data: invoices, error: invError } = await supabase
        .from('invoices')
        .select('client_name, net_amount, issue_date, payment_method')
        .eq('status', 'paid')
        .gte('issue_date', startDate.toISOString().split('T')[0])
        .order('issue_date', { ascending: true });

      if (invError) throw invError;

      // Combinar dados
      const allItems: FluxoItem[] = [];
      
      // Adicionar transações
      transactions?.forEach(trans => {
        allItems.push({
          date: trans.transaction_date,
          description: trans.description,
          type: trans.transaction_type as 'income' | 'expense',
          amount: trans.amount,
          category: trans.financial_categories?.name || 'Sem categoria',
          balance: 0 // Será calculado depois
        });
      });

      // Adicionar faturas
      invoices?.forEach(inv => {
        allItems.push({
          date: inv.issue_date,
          description: `Fatura - ${inv.client_name}`,
          type: 'income',
          amount: inv.net_amount,
          category: 'Faturamento',
          balance: 0
        });
      });

      // Ordenar por data
      allItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Calcular saldo acumulado
      let runningBalance = initialBalance;
      const itemsWithBalance = allItems.map(item => {
        runningBalance += item.type === 'income' ? item.amount : -item.amount;
        return {
          ...item,
          balance: runningBalance
        };
      });

      setFluxoData(itemsWithBalance);

      // Criar fluxo diário
      const dailyData = createDailyFluxo(allItems, initialBalance, startDate);
      setDailyFluxoData(dailyData);
      
    } catch (error) {
      console.error('Error loading fluxo de caixa:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDailyFluxo = (items: FluxoItem[], initialBalance: number, startDate: Date): DailyFluxoItem[] => {
    const dailyMap = new Map<string, { contasPagar: number; contasReceber: number }>();
    
    // Agrupar por data
    items.forEach(item => {
      const dateKey = item.date;
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, { contasPagar: 0, contasReceber: 0 });
      }
      
      const dayData = dailyMap.get(dateKey)!;
      if (item.type === 'expense') {
        dayData.contasPagar += item.amount;
      } else {
        dayData.contasReceber += item.amount;
      }
    });

    // Gerar array de dias
    const result: DailyFluxoItem[] = [];
    let currentBalance = initialBalance;
    
    // Criar array com todos os dias do período
    const currentDate = new Date(startDate);
    const endDate = new Date();
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayData = dailyMap.get(dateKey) || { contasPagar: 0, contasReceber: 0 };
      
      const saldoInicial = currentBalance;
      const movimentacao = dayData.contasReceber - dayData.contasPagar;
      currentBalance += movimentacao;
      
      result.push({
        date: dateKey,
        contasPagar: dayData.contasPagar,
        contasReceber: dayData.contasReceber,
        saldoInicial: saldoInicial,
        total: currentBalance
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return result.reverse(); // Mais recente primeiro
  };

  const exportToExcel = () => {
    const exportData = dailyFluxoData.map(item => ({
      'Data': formatDate(item.date),
      'Contas a Pagar': formatCurrency(item.contasPagar),
      'Contas a Receber': formatCurrency(item.contasReceber),
      'Saldo Inicial': formatCurrency(item.saldoInicial),
      'TOTAL': formatCurrency(item.total)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fluxo de Caixa');
    
    const fileName = `fluxo-caixa-${periodFilter}-dias-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const getResumo = () => {
    const totalEntradas = fluxoData
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const totalSaidas = fluxoData
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const saldoFinal = totalEntradas - totalSaidas;
    const mediaEntradas = fluxoData.length > 0 ? totalEntradas / parseInt(periodFilter) * 30 : 0;
    
    return { totalEntradas, totalSaidas, saldoFinal, mediaEntradas };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const resumo = getResumo();

  return (
    <div className="space-y-6">
      {/* KPIs do Período */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(resumo.totalEntradas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saídas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(resumo.totalSaidas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo do Período</CardTitle>
            <DollarSign className={`h-4 w-4 ${resumo.saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${resumo.saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(resumo.saldoFinal)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Mensal</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(resumo.mediaEntradas)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles e Fluxo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fluxo de Caixa
            </CardTitle>
            
            <div className="flex gap-2">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="15">Últimos 15 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="60">Últimos 60 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={exportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando fluxo de caixa...</div>
          ) : (
            <div className="space-y-6">
              {/* Tabela de Fluxo Diário */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Fluxo de Caixa Diário</h3>
                {dailyFluxoData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma movimentação encontrada no período
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Contas a Pagar</TableHead>
                          <TableHead className="text-right">Contas a Receber</TableHead>
                          <TableHead className="text-right">Saldo Inicial</TableHead>
                          <TableHead className="text-right font-bold">TOTAL</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dailyFluxoData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {formatDate(item.date)}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              {item.contasPagar > 0 ? formatCurrency(item.contasPagar) : '-'}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              {item.contasReceber > 0 ? formatCurrency(item.contasReceber) : '-'}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {formatCurrency(item.saldoInicial)}
                            </TableCell>
                            <TableCell className={`text-right font-bold ${item.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(item.total)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Histórico Detalhado */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Histórico Detalhado</h3>
                {fluxoData.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhuma transação encontrada
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {fluxoData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${item.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <div className="font-medium text-sm">{item.description}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(item.date)} • {item.category}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-sm ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Saldo: {formatCurrency(item.balance)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}