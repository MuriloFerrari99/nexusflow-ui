import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, Filter, TrendingUp, TrendingDown, DollarSign, Package, Users, Clock } from "lucide-react";

export const ProcurementReports = () => {
  const [dateRange, setDateRange] = useState("last30days");

  const reports = [
    {
      id: "ppv-report",
      name: "Purchase Price Variance (PPV)",
      description: "Variação entre preço padrão e preço de compra",
      category: "Custos",
      frequency: "Mensal",
      lastRun: "2024-02-20",
      status: "ready"
    },
    {
      id: "supplier-scorecard",
      name: "Scorecard de Fornecedores",
      description: "Performance OTD, qualidade e pricing",
      category: "Fornecedores",
      frequency: "Semanal",
      lastRun: "2024-02-18",
      status: "ready"
    },
    {
      id: "stock-coverage",
      name: "Cobertura de Estoque",
      description: "Days of Supply por item e categoria",
      category: "Estoque",
      frequency: "Diário",
      lastRun: "2024-02-21",
      status: "ready"
    },
    {
      id: "procurement-analytics",
      name: "Analytics de Compras",
      description: "KPIs e tendências do processo de compras",
      category: "Performance",
      frequency: "Mensal",
      lastRun: "2024-02-15",
      status: "processing"
    }
  ];

  const kpis = [
    {
      name: "PPV Total",
      value: "R$ -12.5K",
      change: "-8.2%",
      trend: "down",
      description: "Variação negativa = economia"
    },
    {
      name: "Lead Time Médio",
      value: "14.5 dias",
      change: "-2.1 dias",
      trend: "down",
      description: "Redução no lead time"
    },
    {
      name: "Economia por Negociação",
      value: "R$ 34.8K",
      change: "+15.3%",
      trend: "up",
      description: "Últimos 3 meses"
    },
    {
      name: "Taxa de Conformidade",
      value: "94.2%",
      change: "+1.8%",
      trend: "up",
      description: "Itens recebidos conforme"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ready: { label: "Pronto", variant: "default" as const },
      processing: { label: "Processando", variant: "outline" as const },
      error: { label: "Erro", variant: "destructive" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ready;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-success" />
    ) : (
      <TrendingDown className="w-4 h-4 text-success" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Relatórios & KPIs</h2>
          <p className="text-muted-foreground">
            Analytics de performance e relatórios de compras
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Últimos 7 dias</SelectItem>
              <SelectItem value="last30days">Últimos 30 dias</SelectItem>
              <SelectItem value="last90days">Últimos 90 dias</SelectItem>
              <SelectItem value="lastyear">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">{kpi.name}</p>
                {getTrendIcon(kpi.trend)}
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {kpi.change}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="exports">Exportações</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Biblioteca de Relatórios</CardTitle>
                  <CardDescription>
                    Relatórios pré-definidos para análise de compras
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
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
                    <TableHead>Relatório</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Última Execução</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {report.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.frequency}</TableCell>
                      <TableCell>
                        {new Date(report.lastRun).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          <Button size="sm" className="gap-1">
                            <Download className="w-3 h-3" />
                            Baixar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Análise de Custos</CardTitle>
                </div>
                <CardDescription>
                  PPV, variação de preços e economia por categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                  <Button className="mt-4" size="sm">
                    Abrir Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Performance de Fornecedores</CardTitle>
                </div>
                <CardDescription>
                  OTD, qualidade, pricing e relacionamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                  <Button className="mt-4" size="sm">
                    Abrir Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Cobertura de Estoque</CardTitle>
                </div>
                <CardDescription>
                  Days of Supply, rupturas evitadas e giro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                  <Button className="mt-4" size="sm">
                    Abrir Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exports">
          <Card>
            <CardHeader>
              <CardTitle>Exportações</CardTitle>
              <CardDescription>
                Histórico de exportações e downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma exportação recente</p>
                <Button className="mt-4" variant="outline">
                  Nova Exportação
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};