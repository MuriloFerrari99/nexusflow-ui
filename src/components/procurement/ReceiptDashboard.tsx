import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Plus, Search, Filter, Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export const ReceiptDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const receipts = [
    {
      id: "REC-2024-001",
      poNumber: "PO-000001",
      supplier: "Metalúrgica ABC Ltda",
      documentNumber: "NF-123456",
      status: "matched",
      receivedAt: "2024-02-18",
      receivedBy: "Carlos Silva",
      itemsReceived: 8,
      totalItems: 8,
      discrepancies: 0
    },
    {
      id: "REC-2024-002",
      poNumber: "PO-000002", 
      supplier: "Eletromec Indústria",
      documentNumber: "NF-987654",
      status: "discrepant",
      receivedAt: "2024-02-15",
      receivedBy: "Ana Costa",
      itemsReceived: 2,
      totalItems: 3,
      discrepancies: 1
    },
    {
      id: "REC-2024-003",
      poNumber: "PO-000004",
      supplier: "Fornecedor Global S.A.",
      documentNumber: "NF-456789",
      status: "pending",
      receivedAt: "2024-02-20",
      receivedBy: "João Santos",
      itemsReceived: 3,
      totalItems: 5,
      discrepancies: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "outline" as const },
      matched: { label: "Conferido", variant: "default" as const },
      discrepant: { label: "Discrepância", variant: "destructive" as const },
      posted: { label: "Lançado", variant: "default" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "matched":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "discrepant":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "posted":
        return <Package className="w-4 h-4 text-primary" />;
      default:
        return <Truck className="w-4 h-4 text-warning" />;
    }
  };

  const stats = [
    { label: "Recebimentos Hoje", value: "5", change: "+2" },
    { label: "Aguardando Conferência", value: "3", change: "0" },
    { label: "Com Discrepância", value: "2", change: "+1" },
    { label: "Taxa de Conformidade", value: "94%", change: "+2%" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recebimento & Conferência</h2>
          <p className="text-muted-foreground">
            Gerencie recebimentos e confira entregas dos fornecedores
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Recebimento
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
          <TabsTrigger value="quality">Qualidade</TabsTrigger>
          <TabsTrigger value="landed-cost">Landed Cost</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recebimentos</CardTitle>
                  <CardDescription>
                    Lista de todos os recebimentos e seu status de conferência
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar recebimentos..."
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
                    <TableHead>Recebimento #</TableHead>
                    <TableHead>PO #</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Recebido por</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(receipt.status)}
                          {receipt.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="link" className="p-0 h-auto">
                          {receipt.poNumber}
                        </Button>
                      </TableCell>
                      <TableCell>{receipt.supplier}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{receipt.documentNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {receipt.discrepancies > 0 && (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                          {receipt.itemsReceived}/{receipt.totalItems}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(receipt.receivedAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{receipt.receivedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          {receipt.status === "pending" && (
                            <Button size="sm">
                              Conferir
                            </Button>
                          )}
                          {receipt.status === "discrepant" && (
                            <Button size="sm" variant="destructive">
                              Resolver
                            </Button>
                          )}
                          {receipt.status === "matched" && (
                            <Button size="sm" variant="outline">
                              Lançar
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

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Qualidade</CardTitle>
              <CardDescription>
                Registre inspeções de qualidade e rejeições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum item aguardando inspeção</p>
                <p className="text-sm">Taxa de conformidade atual: 94%</p>
                <Button className="mt-4" variant="outline">
                  Ver Histórico de Qualidade
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="landed-cost">
          <Card>
            <CardHeader>
              <CardTitle>Landed Cost</CardTitle>
              <CardDescription>
                Ratear custos de frete, seguro e impostos de importação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum custo adicional para ratear</p>
                <Button className="mt-4" variant="outline">
                  Adicionar Custos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};