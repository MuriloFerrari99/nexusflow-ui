import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Plus, Search, Filter, TrendingDown, AlertTriangle, CheckCircle, Calculator } from "lucide-react";

export const ReplenishmentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const suggestions = [
    {
      id: "SUGG-001",
      product: "Parafuso M8x20",
      currentStock: 45,
      rop: 100,
      safetyStock: 50,
      suggestedQty: 500,
      supplier: "Metalúrgica ABC",
      leadTime: 7,
      expectedStockout: "2024-02-25",
      priority: "alta",
      estimatedCost: 250.00
    },
    {
      id: "SUGG-002",
      product: "Rolamento 6204",
      currentStock: 12,
      rop: 25,
      safetyStock: 15,
      suggestedQty: 100,
      supplier: "Rolamentos Sul",
      leadTime: 14,
      expectedStockout: "2024-02-28",
      priority: "média",
      estimatedCost: 1200.00
    },
    {
      id: "SUGG-003",
      product: "Óleo Hidráulico ISO 68",
      currentStock: 2,
      rop: 10,
      safetyStock: 5,
      suggestedQty: 20,
      supplier: "Petrobras Distribuidora",
      leadTime: 3,
      expectedStockout: "2024-02-22",
      priority: "crítica",
      estimatedCost: 2800.00
    }
  ];

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      crítica: { label: "Crítica", variant: "destructive" as const },
      alta: { label: "Alta", variant: "outline" as const },
      média: { label: "Média", variant: "secondary" as const },
      baixa: { label: "Baixa", variant: "default" as const }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.média;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "crítica":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "alta":
        return <TrendingDown className="w-4 h-4 text-warning" />;
      default:
        return <Package className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const stats = [
    { label: "Itens em Risco", value: "8", change: "+2" },
    { label: "Sugestões Ativas", value: "12", change: "+3" },
    { label: "Economia Projetada", value: "R$ 18.5K", change: "+8%" },
    { label: "Cobertura Média", value: "32 dias", change: "-3 dias" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reposição Automática</h2>
          <p className="text-muted-foreground">
            Motor de reposição inteligente com base em ROP, EOQ e demanda
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calculator className="w-4 h-4" />
            Simular
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Executar Análise
          </Button>
        </div>
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

      <Tabs defaultValue="suggestions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
          <TabsTrigger value="policies">Políticas</TabsTrigger>
          <TabsTrigger value="simulator">Simulador</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sugestões de Reposição</CardTitle>
                  <CardDescription>
                    Itens que atingiram o ponto de pedido ou estão em risco
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar produtos..."
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
                    <TableHead>Produto</TableHead>
                    <TableHead>Estoque Atual</TableHead>
                    <TableHead>ROP</TableHead>
                    <TableHead>Sugerido</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Lead Time</TableHead>
                    <TableHead>Risco Ruptura</TableHead>
                    <TableHead>Custo Est.</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions.map((suggestion) => (
                    <TableRow key={suggestion.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(suggestion.priority)}
                          {suggestion.product}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={suggestion.currentStock < suggestion.rop ? "text-destructive font-medium" : ""}>
                            {suggestion.currentStock}
                          </span>
                          {suggestion.currentStock < suggestion.safetyStock && (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{suggestion.rop}</TableCell>
                      <TableCell className="font-medium">{suggestion.suggestedQty}</TableCell>
                      <TableCell>{suggestion.supplier}</TableCell>
                      <TableCell>{suggestion.leadTime} dias</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(suggestion.priority)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(suggestion.expectedStockout).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        R$ {suggestion.estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Simular
                          </Button>
                          <Button size="sm">
                            Criar PO
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

        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Políticas de Reposição</CardTitle>
              <CardDescription>
                Configure parâmetros ROP, EOQ, estoque de segurança e nível de serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Configure políticas por item ou categoria</p>
                <Button className="mt-4">
                  Configurar Políticas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulator">
          <Card>
            <CardHeader>
              <CardTitle>Simulador de Reposição</CardTitle>
              <CardDescription>
                Teste diferentes cenários e parâmetros antes de aplicar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Simulador em desenvolvimento</p>
                <p className="text-sm">Teste cenários de demanda e lead time</p>
                <Button className="mt-4" variant="outline">
                  Acessar Simulador
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics de Reposição</CardTitle>
              <CardDescription>
                Métricas de performance do motor de reposição
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Taxa de Acerto</p>
                  <p className="text-2xl font-bold text-foreground">94.2%</p>
                  <p className="text-sm">Sugestões que evitaram ruptura</p>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingDown className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Economia Gerada</p>
                  <p className="text-2xl font-bold text-foreground">R$ 42.8K</p>
                  <p className="text-sm">Últimos 6 meses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};