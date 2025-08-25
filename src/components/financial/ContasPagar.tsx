import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, Search, Clock, CheckCircle, AlertTriangle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ContaPagar {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  supplier_name: string;
  category: string;
  payment_method: string;
  created_at: string;
  days_overdue?: number;
}

interface ContasPagarProps {
  refresh: boolean;
}

export function ContasPagar({ refresh }: ContasPagarProps) {
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    loadContas();
  }, [refresh]);

  const loadContas = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('financial_transactions')
        .select(`
          id,
          description,
          amount,
          transaction_date,
          status,
          payment_method,
          reference,
          created_at,
          financial_categories (
            name,
            category_type
          )
        `)
        .eq('transaction_type', 'expense')
        .order('transaction_date', { ascending: true });

      if (statusFilter && statusFilter !== "all") {
        if (statusFilter === "overdue") {
          query = query.eq('status', 'pending').lt('transaction_date', new Date().toISOString().split('T')[0]);
        } else if (statusFilter === "due_soon") {
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          query = query.eq('status', 'pending').lte('transaction_date', nextWeek.toISOString().split('T')[0]);
        } else {
          query = query.eq('status', statusFilter);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];
      
      if (searchTerm) {
        filteredData = filteredData.filter(conta =>
          conta.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conta.reference?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      const contasWithOverdue = filteredData.map(conta => {
        const dueDate = new Date(conta.transaction_date);
        const today = new Date();
        const diffTime = today.getTime() - dueDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          id: conta.id,
          description: conta.description,
          amount: conta.amount,
          due_date: conta.transaction_date,
          status: conta.status === 'pending' && diffDays > 0 ? 'overdue' : conta.status,
          supplier_name: conta.reference || 'Fornecedor não informado',
          category: conta.financial_categories?.name || 'Sem categoria',
          payment_method: conta.payment_method || 'N/A',
          created_at: conta.created_at,
          days_overdue: diffDays > 0 ? diffDays : 0
        };
      });

      setContas(contasWithOverdue);
    } catch (error) {
      console.error('Error loading contas a pagar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getKPIs = () => {
    const total = contas.reduce((sum, conta) => 
      ['pending', 'overdue'].includes(conta.status) ? sum + conta.amount : sum, 0
    );
    const overdue = contas.filter(conta => conta.status === 'overdue')
      .reduce((sum, conta) => sum + conta.amount, 0);
    const paid = contas.filter(conta => conta.status === 'completed')
      .reduce((sum, conta) => sum + conta.amount, 0);
    const dueSoon = contas.filter(conta => {
      const dueDate = new Date(conta.due_date);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return conta.status === 'pending' && dueDate <= nextWeek;
    }).reduce((sum, conta) => sum + conta.amount, 0);

    return { total, overdue, paid, dueSoon };
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

  const getStatusBadge = (status: string, daysOverdue?: number) => {
    const statusConfig = {
      pending: { label: 'A Pagar', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      overdue: { label: `Em Atraso (${daysOverdue}d)`, variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      completed: { label: 'Pago', variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const kpis = getKPIs();

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(kpis.total)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(kpis.overdue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vence em 7 dias</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(kpis.dueSoon)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pago no Mês</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(kpis.paid)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Lista */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDown className="h-5 w-5 text-red-600" />
            Contas a Pagar
          </CardTitle>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                placeholder="Buscar por descrição ou fornecedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">A Pagar</SelectItem>
                <SelectItem value="overdue">Em Atraso</SelectItem>
                <SelectItem value="due_soon">Vence em 7 dias</SelectItem>
                <SelectItem value="completed">Pagas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={loadContas} variant="outline">
              <Search className="h-4 w-4 mr-2" />
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
                  <TableHead>Descrição</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma conta a pagar encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  contas.map((conta) => (
                    <TableRow key={conta.id} className={conta.status === 'overdue' ? 'bg-red-50' : ''}>
                      <TableCell className="font-medium">{conta.description}</TableCell>
                      <TableCell>{conta.supplier_name}</TableCell>
                      <TableCell>{conta.category}</TableCell>
                      <TableCell className={conta.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                        {formatDate(conta.due_date)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(conta.status, conta.days_overdue)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(conta.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {conta.status !== 'completed' && (
                            <Button size="sm" variant="outline">
                              Marcar Pago
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Agendar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}