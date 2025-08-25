import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  transaction_type: string;
  transaction_date: string;
  payment_method: string;
  reference: string;
  financial_categories: {
    name: string;
  };
  financial_accounts: {
    name: string;
  };
}

interface TransactionListProps {
  refresh: boolean;
}

export function TransactionList({ refresh }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    loadTransactions();
  }, [refresh]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('financial_transactions')
        .select(`
          *,
          financial_categories (name),
          financial_accounts (name)
        `)
        .order('transaction_date', { ascending: false });

      if (typeFilter && typeFilter !== "all") {
        query = query.eq('transaction_type', typeFilter);
      }

      if (dateFrom) {
        query = query.gte('transaction_date', dateFrom);
      }

      if (dateTo) {
        query = query.lte('transaction_date', dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];
      
      if (searchTerm) {
        filteredData = filteredData.filter(transaction =>
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setTransactions(filteredData);
    } catch (error) {
      console.error('Error loading transactions:', error);
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getTransactionTypeBadge = (type: string) => {
    return type === 'income' 
      ? <Badge variant="secondary" className="bg-green-100 text-green-800">Entrada</Badge>
      : <Badge variant="destructive">Saída</Badge>;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      cash: 'Dinheiro',
      pix: 'PIX',
      bank_transfer: 'Transferência',
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      check: 'Cheque',
      other: 'Outro'
    };
    return methods[method] || method;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lançamentos Financeiros</CardTitle>
        
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              placeholder="Buscar por descrição ou referência..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Entrada</SelectItem>
              <SelectItem value="expense">Saída</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="Data inicial"
            className="w-40"
          />

          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="Data final"
            className="w-40"
          />

          <Button onClick={loadTransactions} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum lançamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
                    <TableCell>{getTransactionTypeBadge(transaction.transaction_type)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        {transaction.reference && (
                          <div className="text-sm text-muted-foreground">Ref: {transaction.reference}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.financial_categories?.name || '-'}</TableCell>
                    <TableCell>{transaction.financial_accounts?.name || '-'}</TableCell>
                    <TableCell>{getPaymentMethodLabel(transaction.payment_method)}</TableCell>
                    <TableCell className={`text-right font-medium ${
                      transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}