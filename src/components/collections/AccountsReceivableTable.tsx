import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Mail, MessageSquare, CreditCard, FileText, QrCode } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AccountsReceivableTableProps {
  filters?: any;
  showActions?: boolean;
}

export function AccountsReceivableTable({ filters, showActions = false }: AccountsReceivableTableProps) {
  // TODO: Integrar com dados reais do Supabase
  const [accounts] = useState([
    {
      id: "1",
      customer_name: "João Silva",
      customer_document: "123.456.789-00",
      amount: 1250.00,
      due_date: new Date("2024-08-20"),
      status: "overdue" as const,
      overdue_days: 5,
      invoice_number: "INV-001",
      payment_method: "pix" as const
    },
    {
      id: "2", 
      customer_name: "Maria Santos",
      customer_document: "987.654.321-00",
      amount: 850.00,
      due_date: new Date("2024-08-25"),
      status: "pending" as const,
      overdue_days: 0,
      invoice_number: "INV-002",
      payment_method: "boleto" as const
    },
    {
      id: "3",
      customer_name: "Tech Solutions LTDA",
      customer_document: "12.345.678/0001-90",
      amount: 3200.00,
      due_date: new Date("2024-08-15"),
      status: "overdue" as const,
      overdue_days: 10,
      invoice_number: "INV-003",
      payment_method: "credit_card" as const
    }
  ]);

  const getStatusColor = (status: string, overdueDays: number) => {
    if (status === "paid") return "default";
    if (status === "overdue") return "destructive";
    if (overdueDays === 0) return "secondary";
    return "secondary";
  };

  const getStatusText = (status: string, overdueDays: number) => {
    if (status === "paid") return "Pago";
    if (status === "overdue") return `Vencido (${overdueDays}d)`;
    if (overdueDays === 0) return "Pendente";
    return "Pendente";
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "pix": return <QrCode className="h-4 w-4" />;
      case "boleto": return <FileText className="h-4 w-4" />;
      case "credit_card": return <CreditCard className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contas a Receber</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Método</TableHead>
              {showActions && <TableHead>Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  {account.customer_name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {account.customer_document}
                </TableCell>
                <TableCell className="font-mono">
                  {formatCurrency(account.amount)}
                </TableCell>
                <TableCell>
                  {format(account.due_date, "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(account.status, account.overdue_days)}>
                    {getStatusText(account.status, account.overdue_days)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(account.payment_method)}
                    <span className="capitalize">{account.payment_method}</span>
                  </div>
                </TableCell>
                {showActions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Enviar SMS
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Nova Cobrança
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}