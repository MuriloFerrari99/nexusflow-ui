import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  tax_amount: number;
  net_amount: number;
  status: string;
  payment_method: string;
}

interface InvoiceListProps {
  refresh: boolean;
}

export function InvoiceList({ refresh }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    loadInvoices();
  }, [refresh]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];
      
      if (searchTerm) {
        filteredData = filteredData.filter(invoice =>
          invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.client_email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setInvoices(filteredData);
    } catch (error) {
      console.error('Error loading invoices:', error);
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Rascunho', variant: 'secondary' as const },
      pending: { label: 'Pendente', variant: 'default' as const },
      paid: { label: 'Paga', variant: 'secondary' as const },
      overdue: { label: 'Vencida', variant: 'destructive' as const },
      cancelled: { label: 'Cancelada', variant: 'outline' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant} className={config.variant === 'secondary' && status === 'paid' ? 'bg-green-100 text-green-800' : ''}>
        {config.label}
      </Badge>
    );
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status === 'pending' && new Date(dueDate) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faturas</CardTitle>
        
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              placeholder="Buscar por cliente, número da fatura ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="paid">Paga</SelectItem>
              <SelectItem value="overdue">Vencida</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={loadInvoices} variant="outline">
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
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Emissão</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma fatura encontrada
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id} className={isOverdue(invoice.due_date, invoice.status) ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">#{invoice.invoice_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.client_name}</div>
                        {invoice.client_email && (
                          <div className="text-sm text-muted-foreground">{invoice.client_email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                    <TableCell className={isOverdue(invoice.due_date, invoice.status) ? 'text-red-600 font-medium' : ''}>
                      {formatDate(invoice.due_date)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(isOverdue(invoice.due_date, invoice.status) ? 'overdue' : invoice.status)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.net_amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
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
  );
}