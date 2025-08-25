import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, DollarSignIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardData {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netProfit: number;
  incomeChange: number;
  expensesChange: number;
  profitMargin: number;
}

export function FinancialDashboard() {
  const [data, setData] = useState<DashboardData>({
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    netProfit: 0,
    incomeChange: 0,
    expensesChange: 0,
    profitMargin: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

      // Get current month transactions
      const { data: currentTransactions, error: currentError } = await supabase
        .from('financial_transactions')
        .select('amount, transaction_type')
        .gte('transaction_date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lt('transaction_date', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`)
        .eq('status', 'completed');

      if (currentError) throw currentError;

      // Get last month transactions for comparison
      const { data: lastMonthTransactions, error: lastMonthError } = await supabase
        .from('financial_transactions')
        .select('amount, transaction_type')
        .gte('transaction_date', `${lastMonthYear}-${lastMonth.toString().padStart(2, '0')}-01`)
        .lt('transaction_date', `${lastMonthYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .eq('status', 'completed');

      if (lastMonthError) throw lastMonthError;

      // Calculate current month values
      const monthlyIncome = currentTransactions
        ?.filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      const monthlyExpenses = currentTransactions
        ?.filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      // Calculate last month values for comparison
      const lastMonthIncome = lastMonthTransactions
        ?.filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      const lastMonthExpenses = lastMonthTransactions
        ?.filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      // Calculate totals and percentages
      const netProfit = monthlyIncome - monthlyExpenses;
      const profitMargin = monthlyIncome > 0 ? (netProfit / monthlyIncome) * 100 : 0;
      
      const incomeChange = lastMonthIncome > 0 
        ? ((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100 
        : 0;
      
      const expensesChange = lastMonthExpenses > 0 
        ? ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
        : 0;

      // Get account balances for current balance
      const { data: accounts, error: accountsError } = await supabase
        .from('financial_accounts')
        .select('balance')
        .eq('is_active', true);

      if (accountsError) throw accountsError;

      const currentBalance = accounts?.reduce((sum, account) => sum + (account.balance || 0), 0) || 0;

      setData({
        currentBalance,
        monthlyIncome,
        monthlyExpenses,
        netProfit,
        incomeChange,
        expensesChange,
        profitMargin
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  if (loading) {
    return <div className="text-center py-8">Carregando dashboard...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${data.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(data.currentBalance)}
          </div>
          <p className="text-xs text-muted-foreground">
            Saldo total das contas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(data.monthlyIncome)}
          </div>
          <p className="text-xs text-muted-foreground flex items-center">
            {data.incomeChange >= 0 ? (
              <ArrowUpIcon className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-red-600 mr-1" />
            )}
            {formatPercentage(data.incomeChange)} vs mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(data.monthlyExpenses)}
          </div>
          <p className="text-xs text-muted-foreground flex items-center">
            {data.expensesChange >= 0 ? (
              <ArrowUpIcon className="h-3 w-3 text-red-600 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-green-600 mr-1" />
            )}
            {formatPercentage(data.expensesChange)} vs mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resultado</CardTitle>
          <TrendingUpIcon className={`h-4 w-4 ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(data.netProfit)}
          </div>
          <p className="text-xs text-muted-foreground">
            Margem de {data.profitMargin.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}