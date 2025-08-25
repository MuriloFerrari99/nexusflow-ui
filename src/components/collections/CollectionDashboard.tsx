import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionKPIs } from "./CollectionKPIs";
import { AccountsReceivableTable } from "./AccountsReceivableTable";
import { CollectionTimeline } from "./CollectionTimeline";
import { QuickCollection } from "./QuickCollection";
import { CollectionFilters } from "./CollectionFilters";
import { DefaultRiskDashboard } from "./DefaultRiskDashboard";

export function CollectionDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "30",
    customer: "",
    paymentMethod: "all"
  });

  return (
    <div className="space-y-6">
      <CollectionKPIs />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="receivables">Contas a Receber</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <CollectionFilters filters={filters} onFiltersChange={setFilters} />
              <AccountsReceivableTable filters={filters} />
            </TabsContent>
            
            <TabsContent value="receivables">
              <AccountsReceivableTable filters={filters} showActions />
            </TabsContent>
            
            <TabsContent value="timeline">
              <CollectionTimeline />
            </TabsContent>
            
            <TabsContent value="analytics">
              <DefaultRiskDashboard />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <QuickCollection />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full text-left p-2 rounded-md hover:bg-accent text-sm">
                📧 Enviar lembrete por email
              </button>
              <button className="w-full text-left p-2 rounded-md hover:bg-accent text-sm">
                📱 Enviar SMS de cobrança
              </button>
              <button className="w-full text-left p-2 rounded-md hover:bg-accent text-sm">
                🔄 Conciliar pagamentos
              </button>
              <button className="w-full text-left p-2 rounded-md hover:bg-accent text-sm">
                📊 Gerar relatório
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}