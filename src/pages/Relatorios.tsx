import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardGrid } from "@/components/analytics/DashboardGrid";
import { DashboardBuilder } from "@/components/analytics/DashboardBuilder";
import { ReportExports } from "@/components/analytics/ReportExports";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Plus, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Relatorios() {
  const [activeTab, setActiveTab] = useState("dashboards");
  const [selectedFilters, setSelectedFilters] = useState({
    dateRange: { from: null, to: null },
    users: [],
    modules: [],
    categories: [],
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Relatórios e Analytics</h1>
              <p className="text-muted-foreground">Dashboards customizáveis e insights avançados</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo Dashboard
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <AnalyticsFilters
              filters={selectedFilters}
              onFiltersChange={setSelectedFilters}
            />
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
            <TabsTrigger value="builder">Criar Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="exports">Exportações</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboards" className="space-y-6">
            <DashboardGrid filters={selectedFilters} />
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <DashboardBuilder />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Pré-definidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Relatórios pré-definidos serão implementados aqui</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exports" className="space-y-6">
            <ReportExports />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}