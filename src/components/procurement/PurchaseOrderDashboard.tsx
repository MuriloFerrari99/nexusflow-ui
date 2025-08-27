import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Plus, Search, Filter, Send, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";

export const PurchaseOrderDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const purchaseOrders = [
    {
      id: "PO-000001",
      supplier: "Metalúrgica ABC Ltda",
      status: "confirmed",
      total: 25480.50,
      items: 8,
      expectedDate: "2024-02-20",
      sentAt: "2024-01-25",
      currency: "BRL",
      paymentTerms: "30 dias"
    },
    {
      id: "PO-000002",
      supplier: "Eletromec Indústria",
      status: "sent",
      total: 12750.00,
      items: 3,
      expectedDate: "2024-02-15",
      sentAt: "2024-01-28",
      currency: "BRL",
      paymentTerms: "45 dias"
    },
    {
      id: "PO-000003",
      supplier: "Tech Solutions Brasil",
      status: "draft",
      total: 34200.00,
      items: 12,
      expectedDate: "2024-02-25",
      sentAt: null,
      currency: "BRL",
      paymentTerms: "30 dias"
    },
    {
      id: "PO-000004",
      supplier: "Fornecedor Global S.A.",
      status: "partially_received",
      total: 8950.75,
      items: 5,
      expectedDate: "2024-02-10",
      sentAt: "2024-01-20",
      currency: "BRL",
      paymentTerms: "60 dias"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Rascunho", variant: "secondary" as const },
      sent: { label: "Enviado", variant: "outline" as const },
      confirmed: { label: "Confirmado", variant: "default" as const },
      partially_received: { label: "Parcialmente Recebido", variant: "outline" as const },
      received: { label: "Recebido", variant: "default" as const },
      closed: { label: "Fechado", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case "sent":
        return <Send className="w-4 h-4 text-warning" />;
      case "partially_received":
        return <Truck className="w-4 h-4 text-primary" />;
      case "received":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "draft":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      default:
        return <ShoppingCart className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const stats = [
    { label: "POs Ativos", value: "28", change: "+4" },
    { label: "Aguardando Confirmação", value: "6", change: "+1" },
    { label: "Em Trânsito", value: "12", change: "+3" },
    { label: "Valor Total", value: "R$ 287.5K", change: "+15%" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pedidos de Compra</h2>
          <p className="text-muted-foreground">
            Gerencie pedidos de compra e acompanhe entregas
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Pedido
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pedidos de Compra</CardTitle>
                  <CardDescription>
                    Lista de todos os pedidos com status e prazos
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar pedidos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO #</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Data Prevista</TableHead>
                    <TableHead>Condições</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(po.status)}
                          {po.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{po.supplier}</p>
                          {po.sentAt && (
                            <p className="text-sm text-muted-foreground">
                              Enviado em {new Date(po.sentAt).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(po.status)}</TableCell>
                      <TableCell>{po.items} item(s)</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            R$ {po.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-muted-foreground">{po.currency}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {new Date(po.expectedDate) < new Date() && po.status !== "received" ? (
                            <AlertCircle className="w-4 h-4 text-destructive" />
                          ) : (
                            <Clock className="w-4 h-4 text-muted-foreground" />
                          )}
                          {new Date(po.expectedDate).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {po.paymentTerms}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          {po.status === "draft" && (
                            <Button size="sm" className="gap-1">
                              <Send className="w-3 h-3" />
                              Enviar
                            </Button>
                          )}
                          {po.status === "confirmed" && (
                            <Button size="sm" variant="outline" className="gap-1">
                              <Truck className="w-3 h-3" />
                              Receber
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Timeline de Entregas</CardTitle>
              <CardDescription>
                Acompanhe o cronograma de entregas previstas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Timeline de entregas em desenvolvimento</p>
                <Button className="mt-4" variant="outline">
                  Ver Cronograma
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Métricas de performance e tendências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Gráficos e métricas em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};