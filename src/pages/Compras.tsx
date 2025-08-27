import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  FileText, 
  Truck, 
  Calculator, 
  Users, 
  TrendingUp,
  Package,
  AlertTriangle,
  Plus
} from "lucide-react";
import { PurchaseRequisitionDashboard } from "@/components/procurement/PurchaseRequisitionDashboard";
import { RFQDashboard } from "@/components/procurement/RFQDashboard";
import { PurchaseOrderDashboard } from "@/components/procurement/PurchaseOrderDashboard";
import { ReceiptDashboard } from "@/components/procurement/ReceiptDashboard";
import { ReplenishmentDashboard } from "@/components/procurement/ReplenishmentDashboard";
import { SupplierDashboard } from "@/components/procurement/SupplierDashboard";
import { ProcurementReports } from "@/components/procurement/ProcurementReports";

const Compras = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const kpiCards = [
    {
      title: "PRs Pendentes",
      value: "15",
      description: "Requisições aguardando aprovação",
      icon: FileText,
      trend: "+12%",
      color: "text-warning"
    },
    {
      title: "RFQs Ativas",
      value: "8",
      description: "Cotações em aberto",
      icon: Users,
      trend: "+5%",
      color: "text-primary"
    },
    {
      title: "POs do Mês",
      value: "142",
      description: "Pedidos de compra",
      icon: ShoppingCart,
      trend: "+18%",
      color: "text-success"
    },
    {
      title: "Economia",
      value: "R$ 34.5K",
      description: "Economia por negociação",
      icon: TrendingUp,
      trend: "+25%",
      color: "text-success"
    }
  ];

  const urgentItems = [
    {
      id: "1",
      type: "Reposição",
      item: "Parafuso M8x20",
      supplier: "Metalúrgica ABC",
      urgency: "Alta",
      expectedStockout: "2 dias",
      action: "Criar PO"
    },
    {
      id: "2",
      type: "RFQ",
      item: "Motor Elétrico 5CV",
      supplier: "3 fornecedores",
      urgency: "Média",
      expectedStockout: "Vence em 1 dia",
      action: "Analisar Cotações"
    },
    {
      id: "3",
      type: "Aprovação",
      item: "PR #2024-0156",
      supplier: "Diversos",
      urgency: "Alta",
      expectedStockout: "Aguardando há 3 dias",
      action: "Aprovar"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Módulo de Compras</h1>
            <p className="text-muted-foreground">
              Gerencie requisições, cotações, pedidos e reposição automática
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Requisição
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="requisitions">Requisições</TabsTrigger>
            <TabsTrigger value="rfq">RFQ/Cotações</TabsTrigger>
            <TabsTrigger value="purchase-orders">Pedidos</TabsTrigger>
            <TabsTrigger value="receipts">Recebimento</TabsTrigger>
            <TabsTrigger value="replenishment">Reposição</TabsTrigger>
            <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiCards.map((kpi, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{kpi.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {kpi.trend}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Itens Urgentes
                  </CardTitle>
                  <CardDescription>
                    Ações que precisam de atenção imediata
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {urgentItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={item.urgency === "Alta" ? "destructive" : "secondary"}>
                              {item.urgency}
                            </Badge>
                            <span className="font-medium">{item.item}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.supplier} • {item.expectedStockout}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          {item.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Sugestões de Reposição
                  </CardTitle>
                  <CardDescription>
                    Itens próximos do ponto de pedido
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center text-muted-foreground py-8">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma sugestão de reposição no momento</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Executar Análise
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requisitions">
            <PurchaseRequisitionDashboard />
          </TabsContent>

          <TabsContent value="rfq">
            <RFQDashboard />
          </TabsContent>

          <TabsContent value="purchase-orders">
            <PurchaseOrderDashboard />
          </TabsContent>

          <TabsContent value="receipts">
            <ReceiptDashboard />
          </TabsContent>

          <TabsContent value="replenishment">
            <ReplenishmentDashboard />
          </TabsContent>

          <TabsContent value="suppliers">
            <SupplierDashboard />
          </TabsContent>

          <TabsContent value="reports">
            <ProcurementReports />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Compras;