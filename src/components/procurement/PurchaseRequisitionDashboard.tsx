import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Search, Filter, CheckCircle, Clock, XCircle } from "lucide-react";

export const PurchaseRequisitionDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const requisitions = [
    {
      id: "PR-2024-001",
      requester: "João Silva",
      costCenter: "Manutenção",
      status: "submitted",
      items: 3,
      totalValue: 5420.50,
      neededDate: "2024-02-15",
      createdAt: "2024-01-20",
      justification: "Peças para manutenção preventiva"
    },
    {
      id: "PR-2024-002",
      requester: "Maria Santos",
      costCenter: "Produção",
      status: "approved",
      items: 1,
      totalValue: 12500.00,
      neededDate: "2024-02-20",
      createdAt: "2024-01-18",
      justification: "Motor elétrico para linha 2"
    },
    {
      id: "PR-2024-003",
      requester: "Carlos Oliveira",
      costCenter: "TI",
      status: "draft",
      items: 5,
      totalValue: 8750.00,
      neededDate: "2024-02-25",
      createdAt: "2024-01-22",
      justification: "Equipamentos de rede"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Rascunho", variant: "secondary" as const },
      submitted: { label: "Enviado", variant: "outline" as const },
      approved: { label: "Aprovado", variant: "default" as const },
      rejected: { label: "Rejeitado", variant: "destructive" as const },
      converted: { label: "Convertido", variant: "default" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "submitted":
        return <Clock className="w-4 h-4 text-warning" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const stats = [
    { label: "Total PRs", value: "24", change: "+3" },
    { label: "Aguardando Aprovação", value: "8", change: "+2" },
    { label: "Aprovadas", value: "12", change: "+5" },
    { label: "Valor Total", value: "R$ 156.8K", change: "+12%" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Requisições de Compra</h2>
          <p className="text-muted-foreground">
            Gerencie solicitações internas de compra
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Requisição
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
          <TabsTrigger value="approval">Aprovação</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Requisições de Compra</CardTitle>
                  <CardDescription>
                    Lista de todas as requisições com filtros e busca
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar requisições..."
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
                    <TableHead>PR #</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Centro de Custo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Valor Estimado</TableHead>
                    <TableHead>Data Necessária</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisitions.map((pr) => (
                    <TableRow key={pr.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(pr.status)}
                          {pr.id}
                        </div>
                      </TableCell>
                      <TableCell>{pr.requester}</TableCell>
                      <TableCell>{pr.costCenter}</TableCell>
                      <TableCell>{getStatusBadge(pr.status)}</TableCell>
                      <TableCell>{pr.items} item(s)</TableCell>
                      <TableCell>R$ {pr.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{new Date(pr.neededDate).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          {pr.status === "submitted" && (
                            <Button size="sm">
                              Aprovar
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

        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle>Fila de Aprovação</CardTitle>
              <CardDescription>
                Requisições aguardando aprovação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>8 requisições aguardando aprovação</p>
                <Button className="mt-4">Ver Fila de Aprovação</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Métricas e tendências das requisições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Gráficos e métricas em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};