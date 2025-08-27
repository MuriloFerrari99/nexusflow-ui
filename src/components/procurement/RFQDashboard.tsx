import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Filter, Mail, CheckCircle2, Clock } from "lucide-react";

export const RFQDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const rfqs = [
    {
      id: "RFQ-2024-001",
      title: "Peças de Manutenção Q1/2024",
      status: "sent",
      suppliersInvited: 3,
      quotesReceived: 1,
      dueDate: "2024-02-15",
      createdBy: "Ana Costa",
      items: 5,
      estimatedValue: 15000
    },
    {
      id: "RFQ-2024-002", 
      title: "Motores Elétricos Linha 2",
      status: "quoted",
      suppliersInvited: 4,
      quotesReceived: 3,
      dueDate: "2024-02-12",
      createdBy: "Carlos Silva",
      items: 2,
      estimatedValue: 25000
    },
    {
      id: "RFQ-2024-003",
      title: "Equipamentos de TI",
      status: "draft",
      suppliersInvited: 0,
      quotesReceived: 0,
      dueDate: "2024-02-20",
      createdBy: "Maria Santos",
      items: 8,
      estimatedValue: 45000
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Rascunho", variant: "secondary" as const },
      sent: { label: "Enviado", variant: "outline" as const },
      quoted: { label: "Cotado", variant: "default" as const },
      awarded: { label: "Adjudicado", variant: "default" as const },
      closed: { label: "Fechado", variant: "outline" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const stats = [
    { label: "RFQs Ativos", value: "12", change: "+2" },
    { label: "Aguardando Cotação", value: "5", change: "0" },
    { label: "Cotações Recebidas", value: "18", change: "+8" },
    { label: "Taxa de Resposta", value: "75%", change: "+5%" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">RFQ & Cotações</h2>
          <p className="text-muted-foreground">
            Gerencie solicitações de cotação e compare propostas
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova RFQ
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
          <TabsTrigger value="compare">Comparativo</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Solicitações de Cotação</CardTitle>
                  <CardDescription>
                    Gerencie RFQs e acompanhe o progresso das cotações
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar RFQs..."
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
                    <TableHead>RFQ #</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fornecedores</TableHead>
                    <TableHead>Cotações</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Valor Estimado</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfqs.map((rfq) => (
                    <TableRow key={rfq.id}>
                      <TableCell className="font-medium">{rfq.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rfq.title}</p>
                          <p className="text-sm text-muted-foreground">{rfq.items} itens</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(rfq.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {rfq.suppliersInvited}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {rfq.quotesReceived > 0 ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <Clock className="w-4 h-4 text-warning" />
                          )}
                          {rfq.quotesReceived}/{rfq.suppliersInvited}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(rfq.dueDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        R$ {rfq.estimatedValue.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          {rfq.status === "quoted" && (
                            <Button size="sm">
                              Comparar
                            </Button>
                          )}
                          {rfq.status === "draft" && (
                            <Button size="sm" variant="outline" className="gap-1">
                              <Mail className="w-3 h-3" />
                              Enviar
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

        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Cotações</CardTitle>
              <CardDescription>
                Compare propostas lado a lado e selecione vencedores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecione uma RFQ com cotações para comparar</p>
                <Button className="mt-4" variant="outline">
                  Buscar RFQs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de RFQ</CardTitle>
              <CardDescription>
                Modelos padrão para agilizar criação de RFQs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum template criado ainda</p>
                <Button className="mt-4">
                  Criar Primeiro Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};