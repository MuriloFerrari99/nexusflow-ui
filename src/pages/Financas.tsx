import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Download, FileText, CreditCard } from "lucide-react";
import { FinancialDashboard } from "@/components/financial/FinancialDashboard";
import { TransactionForm } from "@/components/financial/TransactionForm";
import { TransactionList } from "@/components/financial/TransactionList";
import { InvoiceForm } from "@/components/financial/InvoiceForm";
import { InvoiceList } from "@/components/financial/InvoiceList";
import { PaymentForm } from "@/components/financial/PaymentForm";
import { PaymentList } from "@/components/financial/PaymentList";

export default function Financas() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [invoiceFormOpen, setInvoiceFormOpen] = useState(false);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
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
              if (activeTab === "ledger") setTransactionFormOpen(true);
              else if (activeTab === "faturas") setInvoiceFormOpen(true);
              else if (activeTab === "pagamentos") setPaymentFormOpen(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {activeTab === "ledger" && "Novo Lançamento"}
              {activeTab === "faturas" && "Nova Fatura"}
              {activeTab === "pagamentos" && "Novo Pagamento"}
              {activeTab === "dashboard" && "Novo Lançamento"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
            <TabsTrigger value="faturas">Faturas</TabsTrigger>
            <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <FinancialDashboard />
            <TransactionList refresh={refreshData > 0} />
          </TabsContent>

          <TabsContent value="ledger" className="space-y-4">
            <TransactionList refresh={refreshData > 0} />
          </TabsContent>

          <TabsContent value="faturas" className="space-y-4">
            <InvoiceList refresh={refreshData > 0} />
          </TabsContent>

          <TabsContent value="pagamentos" className="space-y-4">
            <PaymentList refresh={refreshData > 0} />
          </TabsContent>
        </Tabs>

        {/* Forms */}
        <TransactionForm
          open={transactionFormOpen}
          onOpenChange={setTransactionFormOpen}
          onSuccess={handleSuccess}
        />
        
        <InvoiceForm
          open={invoiceFormOpen}
          onOpenChange={setInvoiceFormOpen}
          onSuccess={handleSuccess}
        />
        
        <PaymentForm
          open={paymentFormOpen}
          onOpenChange={setPaymentFormOpen}
          onSuccess={handleSuccess}
        />
      </div>
    </Layout>
  );
}