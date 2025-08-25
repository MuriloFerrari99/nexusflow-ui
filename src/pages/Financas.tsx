import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Download, ArrowUp, ArrowDown, BarChart3 } from "lucide-react";
import { FinancialDashboard } from "@/components/financial/FinancialDashboard";
import { ContasReceber } from "@/components/financial/ContasReceber";
import { ContasPagar } from "@/components/financial/ContasPagar";
import { FluxoCaixa } from "@/components/financial/FluxoCaixa";
import { DRE } from "@/components/financial/DRE";
import { InvoiceForm } from "@/components/financial/InvoiceForm";
import { TransactionForm } from "@/components/financial/TransactionForm";

export default function Financas() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [invoiceFormOpen, setInvoiceFormOpen] = useState(false);
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [refreshData, setRefreshData] = useState(0);

  const handleSuccess = () => {
    setRefreshData(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Módulo Financeiro</h1>
            <p className="text-muted-foreground">Gestão completa das finanças da empresa</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" onClick={() => {
              if (activeTab === "contas-receber") setInvoiceFormOpen(true);
              else if (activeTab === "contas-pagar") setTransactionFormOpen(true);
              else if (activeTab === "dashboard") setTransactionFormOpen(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {activeTab === "contas-receber" && "Nova Fatura"}
              {activeTab === "contas-pagar" && "Nova Despesa"}
              {activeTab === "fluxo-caixa" && "Novo Lançamento"}
              {activeTab === "dashboard" && "Novo Lançamento"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="contas-receber" className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-green-600" />
              Contas a Receber
            </TabsTrigger>
            <TabsTrigger value="contas-pagar" className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-red-600" />
              Contas a Pagar
            </TabsTrigger>
            <TabsTrigger value="fluxo-caixa" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Fluxo de Caixa
            </TabsTrigger>
            <TabsTrigger value="dre" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              DRE
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <FinancialDashboard />
          </TabsContent>

          <TabsContent value="contas-receber" className="space-y-4">
            <ContasReceber refresh={refreshData > 0} />
          </TabsContent>

          <TabsContent value="contas-pagar" className="space-y-4">
            <ContasPagar refresh={refreshData > 0} />
          </TabsContent>

          <TabsContent value="fluxo-caixa" className="space-y-4">
            <FluxoCaixa />
          </TabsContent>

          <TabsContent value="dre" className="space-y-4">
            <DRE />
          </TabsContent>
        </Tabs>

        {/* Forms */}
        <InvoiceForm
          open={invoiceFormOpen}
          onOpenChange={setInvoiceFormOpen}
          onSuccess={handleSuccess}
        />
        
        <TransactionForm
          open={transactionFormOpen}
          onOpenChange={setTransactionFormOpen}
          onSuccess={handleSuccess}
        />
      </div>
    </Layout>
  );
}