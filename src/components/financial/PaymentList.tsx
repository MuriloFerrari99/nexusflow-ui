import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  payment_type: string;
  amount: number;
  description: string;
  payment_date: string;
  payment_method: string;
  reference: string;
  status: string;
  invoices?: {
    invoice_number: string;
    client_name: string;
  };
  financial_accounts: {
    name: string;
  };
}

interface PaymentListProps {
  refresh: boolean;
}

export function PaymentList({ refresh }: PaymentListProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [methodFilter, setMethodFilter] = useState<string>("");

  useEffect(() => {
    loadPayments();
  }, [refresh]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('payments')
        .select(`
          *,
          invoices (invoice_number, client_name),
          financial_accounts (name)
        `)
        .order('payment_date', { ascending: false });

      if (typeFilter) {
        query = query.eq('payment_type', typeFilter);
      }

      if (methodFilter) {
        query = query.eq('payment_method', methodFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];
      
      if (searchTerm) {
        filteredData = filteredData.filter(payment =>
          payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.invoices?.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setPayments(filteredData);
    } catch (error) {
      console.error('Error loading payments:', error);
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

  const getPaymentTypeBadge = (type: string) => {
    return type === 'received' 
      ? <Badge variant="secondary" className="bg-green-100 text-green-800">Recebido</Badge>
      : <Badge variant="destructive">Enviado</Badge>;
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'default' as const },
      completed: { label: 'Concluído', variant: 'secondary' as const },
      failed: { label: 'Falhou', variant: 'destructive' as const },
      cancelled: { label: 'Cancelado', variant: 'outline' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;
    
    return (
      <Badge variant={config.variant} className={config.variant === 'secondary' ? 'bg-green-100 text-green-800' : ''}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamentos</CardTitle>
        
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              placeholder="Buscar por descrição, referência ou cliente..."
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
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="received">Recebido</SelectItem>
              <SelectItem value="sent">Enviado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="cash">Dinheiro</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="bank_transfer">Transferência</SelectItem>
              <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
              <SelectItem value="debit_card">Cartão de Débito</SelectItem>
              <SelectItem value="check">Cheque</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={loadPayments} variant="outline">
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
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum pagamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                    <TableCell>{getPaymentTypeBadge(payment.payment_type)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.description}</div>
                        {payment.invoices && (
                          <div className="text-sm text-muted-foreground">
                            Fatura #{payment.invoices.invoice_number} - {payment.invoices.client_name}
                          </div>
                        )}
                        {payment.reference && (
                          <div className="text-sm text-muted-foreground">Ref: {payment.reference}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{payment.financial_accounts?.name || '-'}</TableCell>
                    <TableCell>{getPaymentMethodLabel(payment.payment_method)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className={`text-right font-medium ${
                      payment.payment_type === 'received' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {payment.payment_type === 'received' ? '+' : '-'}
                      {formatCurrency(Math.abs(payment.amount))}
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